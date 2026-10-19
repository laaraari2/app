import { outboxRepository } from '../../infrastructure/persistence/outbox.repository';
import { eventBusService } from './event-bus.service';

export class OutboxService {
  public async processPendingOutbox(
    tenantId?: string,
    limit: number = 50
  ): Promise<{ processed: number; failed: number }> {
    const pendingMessages = await outboxRepository.getPending(tenantId, limit);
    let processed = 0;
    let failed = 0;

    for (const msg of pendingMessages) {
      try {
        await eventBusService.publish(msg.event);
        await outboxRepository.updateStatus(msg.id, 'PROCESSED');
        processed++;
      } catch (err: any) {
        failed++;
        const errorMessage = err.message || 'Unknown handler execution error';
        const backoffMs = Math.pow(2, msg.retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s...
        const nextRetryAt = new Date(Date.now() + backoffMs).toISOString();

        await outboxRepository.recordFailedAttempt(msg.id, errorMessage, nextRetryAt);
      }
    }

    return { processed, failed };
  }
}

export const outboxService = new OutboxService();
