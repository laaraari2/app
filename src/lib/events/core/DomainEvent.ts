import { EventStatus } from './EventStatus';

export interface IDomainEvent<T = any> {
    eventId: string;
    tenantId: string;
    correlationId: string;
    timestamp: Date;
    actor: string;
    payload: T;
    status: EventStatus;
}

export abstract class DomainEvent<T = any> implements IDomainEvent<T> {
    public readonly eventId: string;
    public readonly tenantId: string;
    public readonly correlationId: string;
    public readonly timestamp: Date;
    public readonly actor: string;
    public readonly payload: T;
    public status: EventStatus;

    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: T,
        status: EventStatus = EventStatus.PENDING
    ) {
        this.eventId = eventId;
        this.tenantId = tenantId;
        this.correlationId = correlationId;
        this.timestamp = new Date();
        this.actor = actor;
        this.payload = payload;
        this.status = status;
    }
}
