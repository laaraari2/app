export interface IIdempotencyStore {
    hasBeenProcessed(key: string): Promise<boolean>;
    markAsProcessed(key: string): Promise<void>;
}

export class IdempotencyKey {
    public static generate(eventId: string, handlerName: string): string {
        return `${eventId}:${handlerName}`;
    }
}

export class InMemoryIdempotencyStore implements IIdempotencyStore {
    private processedKeys: Set<string> = new Set();

    public async hasBeenProcessed(key: string): Promise<boolean> {
        return this.processedKeys.has(key);
    }

    public async markAsProcessed(key: string): Promise<void> {
        this.processedKeys.add(key);
    }
}
