import { DomainEvent } from '../../../src/lib/events/core/DomainEvent';
import { EventStatus } from '../../../src/lib/events/core/EventStatus';

// Tenant Provisioning Workflow Events
export class SchoolCreated extends DomainEvent<{ schoolId: string; name: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string; name: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class TenantProvisioned extends DomainEvent<{ schoolId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class DefaultAcademicYearCreated extends DomainEvent<{ schoolId: string; yearId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string; yearId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class DefaultCampusCreated extends DomainEvent<{ schoolId: string; campusId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string; campusId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class DefaultRolesCreated extends DomainEvent<{ schoolId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class SchoolAdminCreated extends DomainEvent<{ schoolId: string; adminId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string; adminId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class WelcomeNotificationTriggered extends DomainEvent<{ adminId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { adminId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class FirstLoginRequired extends DomainEvent<{ adminId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { adminId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class SetupWizardCompleted extends DomainEvent<{ schoolId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class SchoolStatusChangedToActive extends DomainEvent<{ schoolId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { schoolId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

// Admission Workflow Events
export class ApplicantCreated extends DomainEvent<{ applicantId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { applicantId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class DocumentsUploaded extends DomainEvent<{ applicantId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { applicantId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class ApplicationSubmitted extends DomainEvent<{ applicantId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { applicantId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class ApplicationReviewed extends DomainEvent<{ applicantId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { applicantId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class EnrollmentApproved extends DomainEvent<{ applicantId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { applicantId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class StudentCreated extends DomainEvent<{ studentId: string; applicantId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { studentId: string; applicantId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class NotificationSent extends DomainEvent<{ userId: string; message: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { userId: string; message: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class AuditLogRecorded extends DomainEvent<{ eventId: string; action: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { eventId: string; action: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}

// Teacher Workflow Events
export class EmployeeCreated extends DomainEvent<{ employeeId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { employeeId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class TeacherProfileCreated extends DomainEvent<{ teacherId: string; employeeId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { teacherId: string; employeeId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class IdentityAccountCreated extends DomainEvent<{ userId: string; teacherId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { userId: string; teacherId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
export class TeachingAssignmentLinked extends DomainEvent<{ teacherId: string; classId: string }> {
    constructor(eventId: string, tenantId: string, correlationId: string, actor: string, payload: { teacherId: string; classId: string }) {
        super(eventId, tenantId, correlationId, actor, payload, EventStatus.PENDING);
    }
}
