import { IDomainEvent } from '../core/DomainEvent';

export interface OutboxMessage {
    id: string;
    aggregateType: string;
    aggregateId: string;
    type: string;
    payload: string; // JSON stringified event
    createdAt: Date;
    processedAt: Date | null;
    error: string | null;
}

export interface IOutboxProcessor {
    processPendingMessages(): Promise<void>;
}

export interface IOutboxStore {
    save(event: IDomainEvent): Promise<void>;
    getPendingMessages(limit: number): Promise<OutboxMessage[]>;
    markAsProcessed(messageId: string): Promise<void>;
    markAsFailed(messageId: string, error: string): Promise<void>;
}
