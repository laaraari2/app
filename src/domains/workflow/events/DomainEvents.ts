import { DomainEvent } from '../../../lib/events/core/DomainEvent';
import { EventStatus } from '../../../lib/events/core/EventStatus';

export class ApplicantAccepted extends DomainEvent<{ applicantId: string; programId: string }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { applicantId: string; programId: string }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class StudentEnrolled extends DomainEvent<{ studentId: string; courseId: string }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { studentId: string; courseId: string }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class UserAccountCreated extends DomainEvent<{ userId: string; email: string }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { userId: string; email: string }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class AcademicYearActivated extends DomainEvent<{ yearId: string; startDate: Date }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { yearId: string; startDate: Date }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class TeacherAssigned extends DomainEvent<{ teacherId: string; classId: string }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { teacherId: string; classId: string }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class InvoiceGenerated extends DomainEvent<{ invoiceId: string; amount: number }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { invoiceId: string; amount: number }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class PaymentReceived extends DomainEvent<{ paymentId: string; amount: number }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { paymentId: string; amount: number }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class AttendanceRecorded extends DomainEvent<{ studentId: string; date: Date; status: string }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { studentId: string; date: Date; status: string }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class PasswordChanged extends DomainEvent<{ userId: string }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { userId: string }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

export class RoleUpdated extends DomainEvent<{ userId: string; newRole: string }> {
    constructor(
        eventId: string,
        tenantId: string,
        correlationId: string,
        actor: string,
        payload: { userId: string; newRole: string }
    ) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
