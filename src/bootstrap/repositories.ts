import { container } from "./container";

// Organization
import { SchoolRepository } from "../domains/organization/infrastructure/persistence/school.repository";
import { CampusRepository } from "../domains/organization/infrastructure/persistence/campus.repository";
import { BuildingRepository } from "../domains/organization/infrastructure/persistence/building.repository";
import { FloorRepository } from "../domains/organization/infrastructure/persistence/floor.repository";
import { RoomRepository } from "../domains/organization/infrastructure/persistence/room.repository";

// Identity
import { UserRepository } from "../domains/identity/infrastructure/persistence/user.repository";
import { RoleRepository } from "../domains/identity/infrastructure/persistence/role.repository";
import { TenantRepository } from "../domains/identity/infrastructure/persistence/tenant.repository";

// People
import { StaffRepository } from "../domains/people/infrastructure/persistence/staff.repository";
import { TeacherRepository } from "../domains/people/infrastructure/persistence/teacher.repository";
import { StudentProfileRepository } from "../domains/people/infrastructure/persistence/student-profile.repository";
import { GuardianRepository } from "../domains/people/infrastructure/persistence/guardian.repository";
import { RelationshipRepository } from "../domains/people/infrastructure/persistence/relationship.repository";

// System
import { AuditLogRepository } from "../domains/system/infrastructure/persistence/audit-log.repository";

// Workflow
import { WorkflowRepository } from "../domains/workflow/infrastructure/persistence/workflow.repository";
import { OutboxRepository } from "../domains/workflow/infrastructure/persistence/outbox.repository";

// Attendance
import { InMemoryAttendanceRepository } from "../domains/attendance/infrastructure/persistence/AttendanceRepository";

export function registerRepositories() {

    // Organization
    container.registerSingleton("SchoolRepository", () => new SchoolRepository());
    container.registerSingleton("CampusRepository", () => new CampusRepository());
    container.registerSingleton("BuildingRepository", () => new BuildingRepository());
    container.registerSingleton("FloorRepository", () => new FloorRepository());
    container.registerSingleton("RoomRepository", () => new RoomRepository());

    // Identity
    container.registerSingleton("UserRepository", () => new UserRepository());
    container.registerSingleton("RoleRepository", () => new RoleRepository());
    container.registerSingleton("TenantRepository", () => new TenantRepository());

    // People
    container.registerSingleton("StaffRepository", () => new StaffRepository());
    container.registerSingleton("TeacherRepository", () => new TeacherRepository());
    container.registerSingleton("StudentProfileRepository", () => new StudentProfileRepository());
    container.registerSingleton("GuardianRepository", () => new GuardianRepository());
    container.registerSingleton("RelationshipRepository", () => new RelationshipRepository());

    // System
    container.registerSingleton("AuditLogRepository", () => new AuditLogRepository());

    // Workflow
    container.registerSingleton("WorkflowRepository", () => new WorkflowRepository());
    container.registerSingleton("OutboxRepository", () => new OutboxRepository());

    // Attendance
    container.registerSingleton("AttendanceRepository", () => new InMemoryAttendanceRepository());

}
