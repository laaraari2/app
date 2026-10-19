import { db } from '../../../../db/store';
import { OutboxMessage, OutboxStatus, DomainEvent } from '../../domain/entities/event-types';

export class OutboxRepository {
  public async save(message: OutboxMessage): Promise<OutboxMessage> {
    db.outboxMessages.set(message.id, { ...message });
    return message;
  }

  public async findById(id: string): Promise<OutboxMessage | null> {
    const msg = db.outboxMessages.get(id);
    return msg ? { ...msg } : null;
  }

  public async getPending(tenantId?: string, limit: number = 50): Promise<OutboxMessage[]> {
    const now = new Date().toISOString();
    let messages = Array.from(db.outboxMessages.values()).filter(
      msg =>
        msg.status === 'PENDING' &&
        (!msg.nextRetryAt || msg.nextRetryAt <= now)
    );

    if (tenantId) {
      messages = messages.filter(msg => msg.tenantId === tenantId);
    }

    return messages
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, limit);
  }

  public async updateStatus(
    id: string,
    status: OutboxStatus,
    error?: string
  ): Promise<OutboxMessage> {
    const msg = db.outboxMessages.get(id);
    if (!msg) {
      throw new Error(`Outbox message ${id} not found`);
    }

    msg.status = status;
    if (error) msg.error = error;
    if (status === 'PROCESSED') {
      msg.processedAt = new Date().toISOString();
    }
    db.outboxMessages.set(id, msg);
    return { ...msg };
  }

  public async recordFailedAttempt(
    id: string,
    error: string,
    nextRetryAt: string
  ): Promise<OutboxMessage> {
    const msg = db.outboxMessages.get(id);
    if (!msg) {
      throw new Error(`Outbox message ${id} not found`);
    }

    msg.retryCount += 1;
    msg.error = error;
    msg.nextRetryAt = nextRetryAt;
    if (msg.retryCount >= msg.maxRetries) {
      msg.status = 'FAILED';
    } else {
      msg.status = 'PENDING';
    }
    db.outboxMessages.set(id, msg);
    return { ...msg };
  }

  public isProcessed(eventId: string): boolean {
    return db.processedEventIds.has(eventId);
  }

  public markProcessed(eventId: string): void {
    db.processedEventIds.add(eventId);
  }

  public async logEvent(event: DomainEvent): Promise<void> {
    db.domainEventLogs.set(event.eventId, { ...event });
  }

  public async getEventLogs(tenantId?: string, limit: number = 100): Promise<DomainEvent[]> {
    let events = Array.from(db.domainEventLogs.values());
    if (tenantId) {
      events = events.filter(e => e.tenantId === tenantId);
    }
    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

export const outboxRepository = new OutboxRepository();
