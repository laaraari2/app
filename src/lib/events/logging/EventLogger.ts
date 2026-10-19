import { IDomainEvent } from '../core/DomainEvent';

export interface IEventLogger {
    logPublished(event: IDomainEvent): Promise<void>;
    logProcessed(event: IDomainEvent, handlerName: string): Promise<void>;
    logFailed(event: IDomainEvent, handlerName: string, error: Error): Promise<void>;
}

export class ConsoleEventLogger implements IEventLogger {
    public async logPublished(event: IDomainEvent): Promise<void> {
        console.log(`[EVENT PUBLISHED] ${event.constructor.name} (${event.eventId})`);
    }

    public async logProcessed(event: IDomainEvent, handlerName: string): Promise<void> {
        console.log(`[EVENT PROCESSED] ${event.constructor.name} (${event.eventId}) by ${handlerName}`);
    }

    public async logFailed(event: IDomainEvent, handlerName: string, error: Error): Promise<void> {
        console.error(`[EVENT FAILED] ${event.constructor.name} (${event.eventId}) by ${handlerName}: ${error.message}`);
    }
}
