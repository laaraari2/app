import { DomainEvent } from '../../../../lib/events/core/DomainEvent';
import { EventStatus } from '../../../../lib/events/core/EventStatus';
import { AttendanceStatus } from '../enums/AttendanceStatus';

export class AttendanceRecorded extends DomainEvent<{ registerId: string; recordsCount: number }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { registerId: string; recordsCount: number }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class AttendanceCorrected extends DomainEvent<{ recordId: string; newStatus: AttendanceStatus; reason: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { recordId: string; newStatus: AttendanceStatus; reason: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class AttendanceApproved extends DomainEvent<{ registerId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { registerId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
