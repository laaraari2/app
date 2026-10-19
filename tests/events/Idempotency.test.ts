import { describe, it, expect } from 'vitest';
import { InMemoryIdempotencyStore, IdempotencyKey } from '../../src/lib/events/idempotency/Idempotency';

describe('Idempotency', () => {
    it('should generate correct keys', () => {
        const key = IdempotencyKey.generate('event-1', 'HandlerA');
        expect(key).toBe('event-1:HandlerA');
    });

    it('should track processed keys', async () => {
        const store = new InMemoryIdempotencyStore();
        const key = 'event-1:HandlerA';

        expect(await store.hasBeenProcessed(key)).toBe(false);

        await store.markAsProcessed(key);

        expect(await store.hasBeenProcessed(key)).toBe(true);
    });
});
