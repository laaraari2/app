import { db } from '../src/db/store';
import { staffService } from '../src/domains/people/application/services/staff.service';
import { teacherService } from '../src/domains/people/application/services/teacher.service';
import { studentProfileService } from '../src/domains/people/application/services/student-profile.service';
import { guardianService } from '../src/domains/people/application/services/guardian.service';
import { peopleImportExportService } from '../src/domains/people/application/services/people-import-export.service';
import { peopleActivityService } from '../src/domains/people/application/services/people-activity.service';
import {
  DuplicateNationalIdError,
  PersonNotFoundError,
  InvalidRelationshipError,
} from '../src/domains/people/domain/errors/people-domain.error';

export async function runPeopleDomainTests(): Promise<void> {
  console.log('🧪 Starting People Domain Verification Tests...\n');

  const tenantA = 'tenant-people-alpha';
  const tenantB = 'tenant-people-beta';
  const campusA = 'campus-main-a';
  const actor = { userId: 'admin-user-1', userEmail: 'admin@school.com' };

  // 1. Staff CRUD & Auto Employee ID
  console.log('1. Testing Staff Member CRUD & Auto Employee ID...');
  const staff1 = await staffService.createStaff(
    {
      tenantId: tenantA,
      campusId: campusA,
      firstName: 'Sarah',
      lastName: 'Connor',
      email: 'sarah.connor@school.com',
      phone: '+155501923',
      nationalId: 'NAT-STAFF-001',
      gender: 'FEMALE',
      dateOfBirth: '1985-05-15',
      jobTitle: 'Senior Mathematics Teacher',
      department: 'Academic',
      staffRole: 'TEACHER',
      employmentType: 'FULL_TIME',
      joinDate: '2023-09-01',
      salary: 65000,
    },
    actor
  );

  if (!staff1.employeeId.startsWith('EMP-')) {
    throw new Error(`Expected auto-generated employeeId to start with EMP-, got ${staff1.employeeId}`);
  }
  console.log(`  ✓ Staff created successfully. Employee ID: ${staff1.employeeId}`);

  // Test duplicate national ID prevention
  try {
    await staffService.createStaff({
      tenantId: tenantA,
      firstName: 'Duplicate',
      lastName: 'User',
      email: 'dup@school.com',
      phone: '+155500000',
      nationalId: 'NAT-STAFF-001',
      gender: 'MALE',
      dateOfBirth: '1990-01-01',
      jobTitle: 'Assistant',
      department: 'Admin',
      staffRole: 'SECRETARY',
      employmentType: 'FULL_TIME',
      joinDate: '2024-01-01',
    });
    throw new Error('Should have failed with DuplicateNationalIdError');
  } catch (err: any) {
    if (!(err instanceof DuplicateNationalIdError)) throw err;
    console.log('  ✓ Duplicate National ID correctly blocked for Staff.');
  }

  // 2. Teacher Profile Creation & Linkage
  console.log('2. Testing Teacher Profile Creation & Subject Links...');
  const teacherProfile = await teacherService.createTeacherProfile(
    {
      tenantId: tenantA,
      staffMemberId: staff1.id,
      specialization: 'Advanced Calculus & Algebra',
      qualification: 'M.Sc in Mathematics',
      subjectIds: ['sub-math-101', 'sub-math-202'],
      maxWeeklyHours: 25,
      bio: 'Experienced math educator with 10 years experience.',
    },
    actor
  );

  if (teacherProfile.staffMemberId !== staff1.id) {
    throw new Error('Teacher profile staffMemberId mismatch');
  }
  console.log(`  ✓ Teacher profile created for Staff ID ${staff1.employeeId}`);

  // 3. Student Profile CRUD & Auto Student Number
  console.log('3. Testing Student Profile CRUD & Auto Student Number...');
  const student1 = await studentProfileService.createStudentProfile(
    {
      tenantId: tenantA,
      campusId: campusA,
      firstName: 'John',
      lastName: 'Doe',
      nationalId: 'NAT-STUD-101',
      gender: 'MALE',
      dateOfBirth: '2010-08-20',
      bloodGroup: 'O+',
      medicalNotes: 'No known allergies',
      status: 'ACTIVE',
      joinDate: '2024-09-01',
    },
    actor
  );

  if (!student1.studentNumber.startsWith('STU-')) {
    throw new Error(`Expected studentNumber to start with STU-, got ${student1.studentNumber}`);
  }
  console.log(`  ✓ Student profile created. Student Number: ${student1.studentNumber}`);

  // 4. Guardian Profile & Relationship Link
  console.log('4. Testing Guardian Profile & Relationship Linking...');
  const guardian1 = await guardianService.createGuardianProfile(
    {
      tenantId: tenantA,
      firstName: 'Robert',
      lastName: 'Doe',
      email: 'robert.doe@gmail.com',
      phone: '+155599887',
      nationalId: 'NAT-GUARD-201',
      occupation: 'Software Engineer',
      employer: 'TechCorp',
    },
    actor
  );

  const rel1 = await guardianService.linkGuardianToStudent(
    {
      tenantId: tenantA,
      guardianId: guardian1.id,
      studentProfileId: student1.id,
      relationType: 'FATHER',
      isPrimaryContact: true,
      isEmergencyContact: true,
      canPickup: true,
      isFinancialResponsible: true,
    },
    actor
  );

  if (!rel1.id) throw new Error('Failed to create relationship');
  console.log('  ✓ Guardian linked to Student successfully.');

  // Verify ward lookup
  const wards = await guardianService.getWardsForGuardian(tenantA, guardian1.id);
  if (wards.length !== 1 || wards[0].student.id !== student1.id) {
    throw new Error('Failed to fetch wards for guardian');
  }
  console.log(`  ✓ Guardian wards lookup verified (${wards.length} ward found).`);

  // Verify guardian lookup for student
  const guardians = await guardianService.getGuardiansForStudent(tenantA, student1.id);
  if (guardians.length !== 1 || guardians[0].guardian.id !== guardian1.id) {
    throw new Error('Failed to fetch guardians for student');
  }
  console.log(`  ✓ Student guardians lookup verified (${guardians.length} guardian found).`);

  // Prevent duplicate linking
  try {
    await guardianService.linkGuardianToStudent({
      tenantId: tenantA,
      guardianId: guardian1.id,
      studentProfileId: student1.id,
      relationType: 'FATHER',
    });
    throw new Error('Should have thrown InvalidRelationshipError');
  } catch (err: any) {
    if (!(err instanceof InvalidRelationshipError)) throw err;
    console.log('  ✓ Duplicate relationship link prevented.');
  }

  // 5. CSV Export and Import
  console.log('5. Testing CSV Export and Import Services...');
  const staffCsv = await peopleImportExportService.exportStaffToCsv(tenantA);
  if (!staffCsv.includes('sarah.connor@school.com')) {
    throw new Error('Exported Staff CSV missing expected staff record');
  }
  console.log('  ✓ Staff CSV export verified.');

  const importCsvData = `First Name,Last Name,Email,Phone,National ID,Gender,Date of Birth,Job Title,Department,Role,Employment Type
James,Bond,james.bond@school.com,+155500700,NAT-STAFF-007,MALE,1980-11-11,Security Officer,Operations,OTHER,FULL_TIME`;

  const importResult = await peopleImportExportService.importStaffFromCsv(tenantA, importCsvData, actor);
  if (importResult.importedCount !== 1) {
    throw new Error(`Expected 1 imported staff member, got ${importResult.importedCount}`);
  }
  console.log('  ✓ Staff CSV import verified (1 staff imported).');

  // 6. Tenant Isolation
  console.log('6. Testing Tenant Isolation...');
  const betaStaff = await staffService.listStaff(tenantB);
  if (betaStaff.length !== 0) {
    throw new Error('Tenant isolation breach: Beta tenant saw Alpha tenant staff');
  }

  try {
    await staffService.getStaffById(tenantB, staff1.id);
    throw new Error('Should have thrown PersonNotFoundError due to tenant mismatch');
  } catch (err: any) {
    if (!(err instanceof PersonNotFoundError)) throw err;
    console.log('  ✓ Tenant isolation strictly enforced.');
  }

  // 7. Activity Timeline Logs
  console.log('7. Testing Activity Timeline Audit Trail...');
  const timeline = await peopleActivityService.getTimelineForTenant(tenantA);
  if (timeline.length === 0) {
    throw new Error('People domain activity timeline is empty');
  }
  console.log(`  ✓ Activity timeline verified (${timeline.length} logs recorded).`);

  console.log('✅ ALL PEOPLE DOMAIN VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
}
