import { randomUUID } from 'crypto';
import {
  DomainEvent,
  EventHandlerRegistration,
  OutboxMessage,
  StandardEventType,
} from '../../domain/entities/event-types';
import { outboxRepository } from '../../infrastructure/persistence/outbox.repository';
import { auditService } from '../../../../services/audit.service';

export type NotificationHook = (event: DomainEvent) => Promise<void>;
export type WorkflowTriggerHook = (event: DomainEvent) => Promise<void>;

export class EventBusService {
  private handlers: Map<string, EventHandlerRegistration[]> = new Map();
  private notificationHooks: NotificationHook[] = [];
  private workflowTriggerHook?: WorkflowTriggerHook;

  public registerWorkflowTrigger(hook: WorkflowTriggerHook): void {
    this.workflowTriggerHook = hook;
  }

  public registerNotificationHook(hook: NotificationHook): void {
    this.notificationHooks.push(hook);
  }

  public subscribe(
    eventType: StandardEventType,
    handlerName: string,
    handler: (event: DomainEvent) => Promise<void>,
    options?: { idempotent?: boolean }
  ): string {
    const registrationId = randomUUID();
    const registration: EventHandlerRegistration = {
      id: registrationId,
      eventType,
      handlerName,
      handler,
      idempotent: options?.idempotent ?? true,
    };

    const existing = this.handlers.get(eventType) || [];
    existing.push(registration);
    this.handlers.set(eventType, existing);

    return registrationId;
  }

  public unsubscribe(registrationId: string): boolean {
    for (const [eventType, list] of this.handlers.entries()) {
      const filtered = list.filter(h => h.id !== registrationId);
      if (filtered.length !== list.length) {
        this.handlers.set(eventType, filtered);
        return true;
      }
    }
    return false;
  }

  public async publish<T = any>(
    input: Omit<DomainEvent<T>, 'eventId' | 'timestamp' | 'status'> &
      Partial<Pick<DomainEvent<T>, 'eventId' | 'timestamp' | 'status'>>
  ): Promise<DomainEvent<T>> {
    const eventId = input.eventId || randomUUID();
    const correlationId = input.correlationId || randomUUID();
    const timestamp = input.timestamp || new Date().toISOString();

    const event: DomainEvent<T> = {
      eventId,
      eventType: input.eventType,
      tenantId: input.tenantId,
      correlationId,
      timestamp,
      actor: input.actor || { userId: 'system', userEmail: 'system@eduvora.internal', userRole: 'SYSTEM' },
      payload: input.payload,
      status: 'PROCESSING',
      version: input.version || 1,
    };

    // Idempotency check: if eventId already processed, return logged event
    if (outboxRepository.isProcessed(eventId)) {
      console.log(`ℹ️ [EventBus] Event ${eventId} (${event.eventType}) already processed. Skipping duplicate execution.`);
      event.status = 'COMPLETED';
      return event;
    }

    // 1. Log event in event repository
    await outboxRepository.logEvent(event);

    // 2. Log in Audit Service
    await auditService.logAction({
      tenantId: event.tenantId,
      actorId: event.actor.userId || 'system',
      actorEmail: event.actor.userEmail || 'system@eduvora.internal',
      action: `DOMAIN_EVENT:${event.eventType}`,
      resource: 'EVENT_BUS',
      targetId: event.eventId,
      changes: { correlationId: event.correlationId, payload: event.payload },
    });

    // 3. Dispatch to registered Event Handlers
    const registrations = this.handlers.get(event.eventType) || [];
    for (const reg of registrations) {
      try {
        await reg.handler(event);
      } catch (err: any) {
        console.error(`❌ [EventBus] Handler '${reg.handlerName}' failed for event ${eventId}:`, err);
        event.status = 'FAILED';
        await outboxRepository.logEvent(event);
        throw err;
      }
    }

    // 4. Dispatch to Notification Hooks
    for (const hook of this.notificationHooks) {
      try {
        await hook(event);
      } catch (err) {
        console.error(`⚠️ [EventBus] Notification hook error for event ${eventId}:`, err);
      }
    }

    // 5. Trigger Workflow Engine if registered
    if (this.workflowTriggerHook) {
      try {
        await this.workflowTriggerHook(event);
      } catch (err) {
        console.error(`⚠️ [EventBus] Workflow engine execution failed for event ${eventId}:`, err);
      }
    }

    // Mark event as processed for idempotency
    outboxRepository.markProcessed(eventId);
    event.status = 'COMPLETED';
    await outboxRepository.logEvent(event);

    return event;
  }

  public async publishWithOutbox<T = any>(
    input: Omit<DomainEvent<T>, 'eventId' | 'timestamp' | 'status'> &
      Partial<Pick<DomainEvent<T>, 'eventId' | 'timestamp' | 'status'>>,
    maxRetries: number = 3
  ): Promise<{ event: DomainEvent<T>; outboxMessage: OutboxMessage }> {
    const eventId = input.eventId || randomUUID();
    const correlationId = input.correlationId || randomUUID();
    const timestamp = input.timestamp || new Date().toISOString();

    const event: DomainEvent<T> = {
      eventId,
      eventType: input.eventType,
      tenantId: input.tenantId,
      correlationId,
      timestamp,
      actor: input.actor || { userId: 'system', userEmail: 'system@eduvora.internal', userRole: 'SYSTEM' },
      payload: input.payload,
      status: 'PENDING',
      version: input.version || 1,
    };

    const outboxMessage: OutboxMessage = {
      id: randomUUID(),
      tenantId: event.tenantId,
      event,
      status: 'PENDING',
      retryCount: 0,
      maxRetries,
      createdAt: new Date().toISOString(),
    };

    await outboxRepository.save(outboxMessage);
    return { event, outboxMessage };
  }

  public clearHandlers(): void {
    this.handlers.clear();
    this.notificationHooks = [];
  }
}

export const eventBusService = new EventBusService();
