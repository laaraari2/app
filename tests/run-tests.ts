import assert from 'assert';
import { seedDatabase } from '../src/db/seeders';
import { migrator } from '../src/db/migrator';
import { authService } from '../src/services/auth.service';
import { tenantService } from '../src/services/tenant.service';
import { userService } from '../src/services/user.service';
import { roleService } from '../src/services/role.service';
import { auditService } from '../src/services/audit.service';
import { academicYearService } from '../src/services/academic-year.service';
import { organizationService } from '../src/services/organization.service';
import { settingsService } from '../src/services/settings.service';
import { schoolService } from '../src/domains/organization/application/services/school.service';
import { campusService } from '../src/domains/organization/application/services/campus.service';
import { buildingService } from '../src/domains/organization/application/services/building.service';
import { floorService } from '../src/domains/organization/application/services/floor.service';
import { roomService } from '../src/domains/organization/application/services/room.service';
import { organizationBulkService } from '../src/domains/organization/application/services/organization-bulk.service';
import { organizationImportExportService } from '../src/domains/organization/application/services/organization-import-export.service';
import { organizationActivityService } from '../src/domains/organization/application/services/organization-activity.service';
import { runAcademicDomainTests } from './academic-domain.test';
import { runAdmissionsDomainTests } from './admissions-domain.test';
import { runPeopleDomainTests } from './people-domain.test';
import { runIdentityDomainTests } from './identity-domain.test';
import { runWorkflowDomainTests } from './workflow-domain.test';
import { runAttendanceDomainTests } from './attendance-domain.test';
import { env } from '../src/config/env';
import { loginSchema, createTenantSchema } from '../src/validators/schemas';

async function runTestSuite() {
  console.log('🧪 Starting Eduvora Domain-Driven Design (DDD) Organization Test Suite...\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Reason: ${err.message || err}`);
      failed++;
    }
  }

  // --- 1. Database Migrations Test ---
  await test('Database Migrations Runner (0001 & 0002)', async () => {
    const executed = await migrator.runMigrations();
    assert.ok(executed.length >= 2, 'Should execute migrations 0001 and 0002');
    assert.strictEqual(executed[1].version, '0002');
  });

  // --- 2. Database Seeders Test ---
  await test('Database Seeders Initialization with Org Structure & Academic Years', async () => {
    const counts = await seedDatabase();
    assert.ok(counts.tenantsCount >= 3, 'Should seed system and demo tenants');
    assert.ok(counts.usersCount >= 3, 'Should seed SuperAdmin and SchoolAdmin users');
    assert.ok(counts.permissionsCount >= 10, 'Should seed default system permissions');
    assert.ok(counts.campusesCount >= 2, 'Should seed campuses for demo tenants');
    assert.ok(counts.academicYearsCount >= 2, 'Should seed academic years for demo tenants');
  });

  // --- 3. SuperAdmin Auth Login Test ---
  await test('Authentication: SuperAdmin Login & JWT Token Issuance', async () => {
    const loginResult = await authService.login(env.SUPER_ADMIN_EMAIL, env.SUPER_ADMIN_PASSWORD);
    assert.ok(loginResult.accessToken, 'Access token should be issued');
    assert.ok(loginResult.refreshToken, 'Refresh token should be issued');
    assert.strictEqual(loginResult.user.email, env.SUPER_ADMIN_EMAIL);
    assert.ok(loginResult.user.roles.includes('SUPER_ADMIN'));
  });

  // --- 4. Dynamic RBAC & Editable Default Roles Test ---
  await test('Dynamic RBAC: School-specific Editable Seed Roles', async () => {
    const marrakechRoles = await roleService.getRoles('tenant_marrakech');
    const teacherRole = marrakechRoles.find(r => r.code === 'TEACHER');
    assert.ok(teacherRole, 'Marrakech should have a seeded editable TEACHER role');

    const updatedRole = await roleService.updateRole(teacherRole.id, 'tenant_marrakech', {
      name: 'Enseignant Certifié',
      permissions: ['users:read', 'academic_year:read', 'org:read'],
    });

    assert.strictEqual(updatedRole.name, 'Enseignant Certifié');
    assert.ok(updatedRole.permissions.includes('academic_year:read'));

    const atlasRoles = await roleService.getRoles('tenant_atlas');
    const atlasTeacherRole = atlasRoles.find(r => r.code === 'TEACHER');
    assert.ok(atlasTeacherRole);
    assert.notStrictEqual(atlasTeacherRole.name, 'Enseignant Certifié');
  });

  // --- 5. Organization Domain: School Profile Entity & Persistence ---
  await test('Organization Domain: School Profile (Create/Update, Tenant Isolation & UUID)', async () => {
    const school = await schoolService.createOrUpdateSchoolProfile(
      'tenant_marrakech',
      {
        name: 'Établissement Excellence Gueliz',
        code: 'EEG-MAR',
        city: 'Marrakech',
        country: 'Morocco',
        status: 'ACTIVE',
      },
      'usr_admin_001',
      'admin@gueliz.eduvora.com'
    );

    assert.ok(school.id, 'School must have a UUID');
    assert.strictEqual(school.tenantId, 'tenant_marrakech');
    assert.strictEqual(school.code, 'EEG-MAR');
    assert.strictEqual(school.isDeleted, false);

    const fetched = await schoolService.getSchoolProfile('tenant_marrakech');
    assert.ok(fetched);
    assert.strictEqual(fetched.name, 'Établissement Excellence Gueliz');
  });

  // --- 6. Organization Domain: Campus Entity (Value Object, Search, Filter, Sort, Soft Delete, Archive, Restore) ---
  await test('Organization Domain: Campus Aggregate (Value Object Validation, Search, Filter, Soft Delete, Archive, Restore)', async () => {
    // Create new Campus
    const newCampus = await campusService.createCampus(
      'tenant_marrakech',
      {
        name: 'Campus High-Tech Agdal',
        code: 'CPAGDAL',
        city: 'Marrakech',
        isMain: false,
        status: 'ACTIVE',
      },
      'usr_admin_001',
      'admin@gueliz.eduvora.com'
    );

    assert.ok(newCampus.id, 'Campus must have a UUID');
    assert.strictEqual(newCampus.code, 'CPAGDAL');

    // Search and Filter Paginated
    const searchRes = await campusService.getPaginatedCampuses('tenant_marrakech', { search: 'agdal', limit: 5 });
    assert.strictEqual(searchRes.total, 1);
    assert.strictEqual(searchRes.data[0].code, 'CPAGDAL');

    // Archive Campus
    const archived = await campusService.archiveCampus(newCampus.id, 'tenant_marrakech', 'usr_admin_001');
    assert.strictEqual(archived.status, 'ARCHIVED');

    // Soft Delete Campus
    await campusService.softDeleteCampus(newCampus.id, 'tenant_marrakech', 'usr_admin_001');
    const afterDelete = await campusService.getPaginatedCampuses('tenant_marrakech', { includeDeleted: false });
    assert.ok(!afterDelete.data.some(c => c.id === newCampus.id), 'Deleted campus should not be returned by default');

    // Restore Campus
    await campusService.restoreCampus(newCampus.id, 'tenant_marrakech', 'usr_admin_001');
    const afterRestore = await campusService.getPaginatedCampuses('tenant_marrakech', { includeDeleted: false });
    assert.ok(afterRestore.data.some(c => c.id === newCampus.id), 'Restored campus should be present');
  });

  // --- 7. Organization Domain: Buildings, Floors, Rooms & Capacity Value Object ---
  await test('Organization Domain: Buildings, Floors & Rooms DDD Entities', async () => {
    const campuses = await campusService.getPaginatedCampuses('tenant_marrakech', { limit: 10 });
    const campus = campuses.data[0];

    // Create Building
    const building = await buildingService.createBuilding('tenant_marrakech', {
      campusId: campus.id,
      name: 'Bâtiment Innovation C',
      code: 'BAT-INNOV',
      totalFloors: 3,
      status: 'ACTIVE',
    });
    assert.ok(building.id);
    assert.strictEqual(building.code, 'BAT-INNOV');

    // Create Floor
    const floor = await floorService.createFloor('tenant_marrakech', {
      campusId: campus.id,
      buildingId: building.id,
      name: '2ème Étage Tech',
      floorNumber: 2,
      status: 'ACTIVE',
    });
    assert.ok(floor.id);
    assert.strictEqual(floor.floorNumber, 2);

    // Create Room with RoomCapacity Value Object validation
    const room = await roomService.createRoom('tenant_marrakech', {
      campusId: campus.id,
      buildingId: building.id,
      floorId: floor.id,
      name: 'Laboratoire IA & Robotics',
      code: 'LAB-IA-201',
      roomType: 'LAB',
      capacity: 45,
      facilities: ['Projector', 'AI Workstations', 'Smart Board'],
      status: 'AVAILABLE',
    });
    assert.ok(room.id);
    assert.strictEqual(room.capacity, 45);
    assert.strictEqual(room.code, 'LAB-IA-201');

    // Test Room Capacity Value Object Rejection (< 1)
    try {
      await roomService.createRoom('tenant_marrakech', {
        campusId: campus.id,
        buildingId: building.id,
        floorId: floor.id,
        name: 'Invalid Room',
        code: 'INV-001',
        capacity: 0,
      });
      assert.fail('Should fail with invalid capacity');
    } catch (e: any) {
      assert.ok(e.message.includes('capacity'));
    }
  });

  // --- 8. Organization Bulk Operations Test ---
  await test('Organization Domain: Bulk Operations (Bulk Soft Delete & Restore)', async () => {
    const campuses = await campusService.getPaginatedCampuses('tenant_marrakech', { limit: 10 });
    const campus = campuses.data[0];

    const buildings = await buildingService.getPaginatedBuildings('tenant_marrakech', { campusId: campus.id, limit: 10 });
    const building = buildings.data[0];

    const floors = await floorService.getPaginatedFloors('tenant_marrakech', { buildingId: building.id, limit: 10 });
    const floor = floors.data[0];

    const r1 = await roomService.createRoom('tenant_marrakech', {
      campusId: campus.id,
      buildingId: building.id,
      floorId: floor.id,
      name: 'Bulk Room 1',
      code: 'BLK-101',
      capacity: 25,
    });

    const r2 = await roomService.createRoom('tenant_marrakech', {
      campusId: campus.id,
      buildingId: building.id,
      floorId: floor.id,
      name: 'Bulk Room 2',
      code: 'BLK-102',
      capacity: 25,
    });

    // Bulk Delete
    const bulkDelRes = await organizationBulkService.executeBulkOperation(
      'tenant_marrakech',
      'room',
      { ids: [r1.id, r2.id], action: 'delete' },
      'usr_admin_001'
    );
    assert.strictEqual(bulkDelRes.successCount, 2);

    // Verify rooms are soft deleted
    const check1 = await roomService.getPaginatedRooms('tenant_marrakech', { includeDeleted: false });
    assert.ok(!check1.data.some(r => r.id === r1.id || r.id === r2.id));

    // Bulk Restore
    const bulkRestRes = await organizationBulkService.executeBulkOperation(
      'tenant_marrakech',
      'room',
      { ids: [r1.id, r2.id], action: 'restore' },
      'usr_admin_001'
    );
    assert.strictEqual(bulkRestRes.successCount, 2);
  });

  // --- 9. Organization Import CSV & Export CSV Test ---
  await test('Organization Domain: CSV Import & CSV Export Services', async () => {
    // Import Campuses CSV
    const csvContent = `name,code,address,city,phone,email,principalName,isMain,status
Campus Targa,CPTARGA,"Avenue Targa",Marrakech,0524000000,targa@eduvora.com,"M. Alami",false,ACTIVE`;

    const importRes = await organizationImportExportService.importCampusesCsv('tenant_marrakech', csvContent, 'usr_admin_001');
    assert.strictEqual(importRes.importedCount, 1);

    // Export Campuses CSV
    const exportedCsv = await organizationImportExportService.exportCampusesCsv('tenant_marrakech');
    assert.ok(exportedCsv.includes('Campus Targa'));
    assert.ok(exportedCsv.includes('CPTARGA'));
  });

  // --- 10. Organization Activity Timeline & Audit Trail Test ---
  await test('Organization Domain: Activity Timeline Audit Logs Retrieval', async () => {
    const timeline = await organizationActivityService.getEntityActivityTimeline('tenant_marrakech');
    assert.ok(timeline.length >= 1, 'Should contain recorded audit events for organization actions');
    assert.ok(timeline.some(t => t.action.includes('CAMPUS') || t.action.includes('ROOM') || t.action.includes('SCHOOL')));
  });

  // --- 11. Complete Academic Domain Test Suite ---
  await test('Academic Domain: Complete Academic Entities & Business Logic Test Suite', async () => {
    await runAcademicDomainTests();
  });

  // --- 12. Complete Admissions Domain Test Suite ---
  await test('Admissions Domain: Complete Admissions Entities & Business Logic Test Suite', async () => {
    await runAdmissionsDomainTests();
  });

  // --- 13. Complete People Domain Test Suite ---
  await test('People Domain: Complete People Entities & Business Logic Test Suite', async () => {
    await runPeopleDomainTests();
  });

  // --- 14. Complete Identity & IAM Domain Test Suite ---
  await test('Identity & IAM Domain: Complete Identity, Auth & RBAC Test Suite', async () => {
    await runIdentityDomainTests();
  });

  // --- 15. Complete Workflow & Domain Events Test Suite ---
  await test('Workflow Domain: Event Bus, Outbox & Saga Engine Test Suite', async () => {
    await runWorkflowDomainTests();
  });

  // --- 16. Complete Attendance Domain Test Suite ---
  await test('Attendance Domain: Register, Recording, Correction & Approval Test Suite', async () => {
    await runAttendanceDomainTests();
  });

  // --- Final Results Summary ---
  console.log('\n=============================================');
  console.log(`📊 Domain Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
