import { IEventHandler } from '../../../src/lib/events/core/EventHandler';
import { IEventBus } from '../../../src/lib/events/core/EventBus';
import {
    SchoolCreated,
    TenantProvisioned,
    DefaultAcademicYearCreated,
    DefaultCampusCreated,
    DefaultRolesCreated,
    SchoolAdminCreated,
    WelcomeNotificationTriggered,
    FirstLoginRequired,
    SetupWizardCompleted,
    SchoolStatusChangedToActive,
    ApplicantCreated,
    DocumentsUploaded,
    ApplicationSubmitted,
    ApplicationReviewed,
    EnrollmentApproved,
    StudentCreated,
    NotificationSent,
    AuditLogRecorded,
    EmployeeCreated,
    TeacherProfileCreated,
    IdentityAccountCreated,
    TeachingAssignmentLinked
} from './VerificationEvents';
import { ApplicantAccepted, PasswordChanged, UserAccountCreated } from '../../../src/domains/workflow/events/DomainEvents';

export class MockHandlers {
    constructor(private eventBus: IEventBus) { }

    // Tenant Provisioning Workflow Handlers
    public handleSchoolCreated: IEventHandler<SchoolCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new TenantProvisioned('evt-2', event.tenantId, event.correlationId, event.actor, { schoolId: event.payload.schoolId }));
        }
    };
    public handleTenantProvisioned: IEventHandler<TenantProvisioned> = {
        handle: async (event) => {
            await this.eventBus.publish(new DefaultAcademicYearCreated('evt-3', event.tenantId, event.correlationId, event.actor, { schoolId: event.payload.schoolId, yearId: 'year-1' }));
            await this.eventBus.publish(new DefaultCampusCreated('evt-4', event.tenantId, event.correlationId, event.actor, { schoolId: event.payload.schoolId, campusId: 'campus-1' }));
        }
    };
    public handleDefaultAcademicYearCreated: IEventHandler<DefaultAcademicYearCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new DefaultRolesCreated('evt-5', event.tenantId, event.correlationId, event.actor, { schoolId: event.payload.schoolId }));
        }
    };
    public handleDefaultRolesCreated: IEventHandler<DefaultRolesCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new SchoolAdminCreated('evt-6', event.tenantId, event.correlationId, event.actor, { schoolId: event.payload.schoolId, adminId: 'admin-1' }));
        }
    };
    public handleSchoolAdminCreated: IEventHandler<SchoolAdminCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new WelcomeNotificationTriggered('evt-7', event.tenantId, event.correlationId, event.actor, { adminId: event.payload.adminId }));
            await this.eventBus.publish(new FirstLoginRequired('evt-8', event.tenantId, event.correlationId, event.actor, { adminId: event.payload.adminId }));
        }
    };
    public handleFirstLoginRequired: IEventHandler<FirstLoginRequired> = {
        handle: async (event) => {
            await this.eventBus.publish(new PasswordChanged('evt-9', event.tenantId, event.correlationId, event.actor, { userId: event.payload.adminId }));
        }
    };
    public handlePasswordChanged: IEventHandler<PasswordChanged> = {
        handle: async (event) => {
            await this.eventBus.publish(new SetupWizardCompleted('evt-10', event.tenantId, event.correlationId, event.actor, { schoolId: event.tenantId }));
        }
    };
    public handleSetupWizardCompleted: IEventHandler<SetupWizardCompleted> = {
        handle: async (event) => {
            await this.eventBus.publish(new SchoolStatusChangedToActive('evt-11', event.tenantId, event.correlationId, event.actor, { schoolId: event.payload.schoolId }));
        }
    };

    // Admission Workflow Handlers
    public handleApplicantCreated: IEventHandler<ApplicantCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new DocumentsUploaded('evt-12', event.tenantId, event.correlationId, event.actor, { applicantId: event.payload.applicantId }));
        }
    };
    public handleDocumentsUploaded: IEventHandler<DocumentsUploaded> = {
        handle: async (event) => {
            await this.eventBus.publish(new ApplicationSubmitted('evt-13', event.tenantId, event.correlationId, event.actor, { applicantId: event.payload.applicantId }));
        }
    };
    public handleApplicationSubmitted: IEventHandler<ApplicationSubmitted> = {
        handle: async (event) => {
            await this.eventBus.publish(new ApplicationReviewed('evt-14', event.tenantId, event.correlationId, event.actor, { applicantId: event.payload.applicantId }));
        }
    };
    public handleApplicationReviewed: IEventHandler<ApplicationReviewed> = {
        handle: async (event) => {
            await this.eventBus.publish(new ApplicantAccepted('evt-15', event.tenantId, event.correlationId, event.actor, { applicantId: event.payload.applicantId, programId: 'prog-1' }));
        }
    };
    public handleApplicantAccepted: IEventHandler<ApplicantAccepted> = {
        handle: async (event) => {
            await this.eventBus.publish(new EnrollmentApproved('evt-16', event.tenantId, event.correlationId, event.actor, { applicantId: event.payload.applicantId }));
        }
    };
    public handleEnrollmentApproved: IEventHandler<EnrollmentApproved> = {
        handle: async (event) => {
            await this.eventBus.publish(new StudentCreated('evt-17', event.tenantId, event.correlationId, event.actor, { studentId: 'student-1', applicantId: event.payload.applicantId }));
        }
    };
    public handleStudentCreated: IEventHandler<StudentCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new UserAccountCreated('evt-18', event.tenantId, event.correlationId, event.actor, { userId: 'user-1', email: 'student@test.com' }));
        }
    };
    public handleUserAccountCreated: IEventHandler<UserAccountCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new NotificationSent('evt-19', event.tenantId, event.correlationId, event.actor, { userId: event.payload.userId, message: 'Welcome' }));
            await this.eventBus.publish(new AuditLogRecorded('evt-20', event.tenantId, event.correlationId, event.actor, { eventId: event.eventId, action: 'UserAccountCreated' }));
        }
    };

    // Teacher Workflow Handlers
    public handleEmployeeCreated: IEventHandler<EmployeeCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new TeacherProfileCreated('evt-21', event.tenantId, event.correlationId, event.actor, { teacherId: 'teacher-1', employeeId: event.payload.employeeId }));
        }
    };
    public handleTeacherProfileCreated: IEventHandler<TeacherProfileCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new IdentityAccountCreated('evt-22', event.tenantId, event.correlationId, event.actor, { userId: 'user-2', teacherId: event.payload.teacherId }));
        }
    };
    public handleIdentityAccountCreated: IEventHandler<IdentityAccountCreated> = {
        handle: async (event) => {
            await this.eventBus.publish(new TeachingAssignmentLinked('evt-23', event.tenantId, event.correlationId, event.actor, { teacherId: event.payload.teacherId, classId: 'class-1' }));
        }
    };
    public handleTeachingAssignmentLinked: IEventHandler<TeachingAssignmentLinked> = {
        handle: async (event) => {
            await this.eventBus.publish(new NotificationSent('evt-24', event.tenantId, event.correlationId, event.actor, { userId: 'user-2', message: 'Assigned' }));
        }
    };

    public registerAll() {
        this.eventBus.subscribe('SchoolCreated', this.handleSchoolCreated);
        this.eventBus.subscribe('TenantProvisioned', this.handleTenantProvisioned);
        this.eventBus.subscribe('DefaultAcademicYearCreated', this.handleDefaultAcademicYearCreated);
        this.eventBus.subscribe('DefaultRolesCreated', this.handleDefaultRolesCreated);
        this.eventBus.subscribe('SchoolAdminCreated', this.handleSchoolAdminCreated);
        this.eventBus.subscribe('FirstLoginRequired', this.handleFirstLoginRequired);
        this.eventBus.subscribe('PasswordChanged', this.handlePasswordChanged);
        this.eventBus.subscribe('SetupWizardCompleted', this.handleSetupWizardCompleted);

        this.eventBus.subscribe('ApplicantCreated', this.handleApplicantCreated);
        this.eventBus.subscribe('DocumentsUploaded', this.handleDocumentsUploaded);
        this.eventBus.subscribe('ApplicationSubmitted', this.handleApplicationSubmitted);
        this.eventBus.subscribe('ApplicationReviewed', this.handleApplicationReviewed);
        this.eventBus.subscribe('ApplicantAccepted', this.handleApplicantAccepted);
        this.eventBus.subscribe('EnrollmentApproved', this.handleEnrollmentApproved);
        this.eventBus.subscribe('StudentCreated', this.handleStudentCreated);
        this.eventBus.subscribe('UserAccountCreated', this.handleUserAccountCreated);

        this.eventBus.subscribe('EmployeeCreated', this.handleEmployeeCreated);
        this.eventBus.subscribe('TeacherProfileCreated', this.handleTeacherProfileCreated);
        this.eventBus.subscribe('IdentityAccountCreated', this.handleIdentityAccountCreated);
        this.eventBus.subscribe('TeachingAssignmentLinked', this.handleTeachingAssignmentLinked);
    }
}
