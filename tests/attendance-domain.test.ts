import assert from 'assert';
import { attendanceService } from '../src/domains/attendance/application/services/attendance.service';
import { attendanceRepository } from '../src/domains/attendance/infrastructure/persistence/AttendanceRepository';
import { AttendanceStatus } from '../src/domains/attendance/domain/enums/AttendanceStatus';
import { inMemoryEventBus } from '../src/lib/events/bus/InMemoryEventBus';

export async function runAttendanceDomainTests() {
  console.log('🧪 Starting Attendance Domain Verification Tests...');

  const tenantId = `tenant-attendance-${Date.now()}`;
  const academicYearId = 'ay-2025-2026';
  const campusId = 'campus-main';
  const classGroupId = 'class-tc-1';
  const teacherAssignmentId = 'assign-prof-01';
  const subjectId = 'subj-math';
  const periodId = 'period-1';
  const roomId = 'room-101';
  const today = new Date();

  // --- 1. Record Attendance ---
  console.log('1. Testing Record Attendance Use Case & Event Publishing...');
  let eventFired = false;
  inMemoryEventBus.subscribe('AttendanceRecorded', {
    handle: async () => {
      eventFired = true;
    },
  });

  await attendanceService.recordAttendance({
    tenantId,
    academicYearId,
    campusId,
    classGroupId,
    teacherAssignmentId,
    subjectId,
    periodId,
    roomId,
    date: today,
    records: [
      { studentId: 'student-001', status: AttendanceStatus.PRESENT },
      { studentId: 'student-002', status: AttendanceStatus.ABSENT, notes: 'Non justifié' },
      { studentId: 'student-003', status: AttendanceStatus.LATE, notes: '15 min late' },
    ],
    actorId: 'teacher-user-1',
  });

  const registers = await attendanceService.getRegistersByTenant(tenantId);
  assert.strictEqual(registers.length, 1, 'Should have exactly 1 register');
  assert.strictEqual(registers[0].status, 'SUBMITTED', 'Register status should be SUBMITTED');
  assert.strictEqual(registers[0].records.length, 3, 'Should have 3 records');
  assert.ok(eventFired, 'AttendanceRecorded event should be published');
  console.log('  ✓ Attendance recorded and AttendanceRecorded event published.');

  // --- 2. Prevent Duplicate Register ---
  console.log('2. Testing Duplicate Attendance Prevention...');
  try {
    await attendanceService.recordAttendance({
      tenantId,
      academicYearId,
      campusId,
      classGroupId,
      teacherAssignmentId,
      subjectId,
      periodId,
      roomId,
      date: today,
      records: [{ studentId: 'student-001', status: AttendanceStatus.PRESENT }],
      actorId: 'teacher-user-1',
    });
    assert.fail('Should prevent duplicate attendance register');
  } catch (err: any) {
    assert.ok(err.message.includes('already exists'), 'Error message should indicate already exists');
    console.log('  ✓ Duplicate attendance register for same class/period/date prevented cleanly.');
  }

  // --- 3. Correct Attendance Record ---
  console.log('3. Testing Correct Attendance Record & History Audit Trail...');
  let correctedEventFired = false;
  inMemoryEventBus.subscribe('AttendanceCorrected', {
    handle: async () => {
      correctedEventFired = true;
    },
  });

  const targetRecord = registers[0].records.find((r) => r.studentId === 'student-002');
  assert.ok(targetRecord, 'Record for student-002 must exist');

  await attendanceService.correctAttendance({
    tenantId,
    recordId: targetRecord.id,
    newStatus: AttendanceStatus.EXCUSED,
    reason: 'Certificat médical fourni par le tuteur',
    actorId: 'admin-surveillant-1',
  });

  const updatedRecord = await attendanceRepository.findRecordById(targetRecord.id);
  assert.strictEqual(updatedRecord?.status, AttendanceStatus.EXCUSED, 'Status should be updated to EXCUSED');

  const history = await attendanceService.getRecordHistory(targetRecord.id);
  assert.strictEqual(history.length, 1, 'Should have 1 history record');
  assert.strictEqual(history[0].previousStatus, AttendanceStatus.ABSENT);
  assert.strictEqual(history[0].newStatus, AttendanceStatus.EXCUSED);
  assert.strictEqual(history[0].reason, 'Certificat médical fourni par le tuteur');
  assert.ok(correctedEventFired, 'AttendanceCorrected event should be published');
  console.log('  ✓ Attendance corrected with immutable audit history and event publication.');

  // --- 4. Approve Attendance Register ---
  console.log('4. Testing Approve Attendance Register...');
  let approvedEventFired = false;
  inMemoryEventBus.subscribe('AttendanceApproved', {
    handle: async () => {
      approvedEventFired = true;
    },
  });

  await attendanceService.approveAttendance({
    tenantId,
    registerId: registers[0].id,
    actorId: 'directeur-pedagogique',
  });

  const approvedRegister = await attendanceService.getRegisterById(registers[0].id);
  assert.strictEqual(approvedRegister.status, 'APPROVED', 'Register should be approved');
  assert.ok(approvedEventFired, 'AttendanceApproved event should be published');
  console.log('  ✓ Attendance register approved successfully.');

  // --- 5. Attendance Statistics & Rate Calculation ---
  console.log('5. Testing Attendance Aggregation Stats & Rate Calculation...');
  const stats = await attendanceService.getAttendanceStats(tenantId);
  assert.strictEqual(stats.totalRegisters, 1);
  assert.strictEqual(stats.totalRecords, 3);
  assert.strictEqual(stats.presentCount, 1);
  assert.strictEqual(stats.excusedCount, 1);
  assert.strictEqual(stats.lateCount, 1);
  assert.strictEqual(stats.absentCount, 0);
  assert.ok(stats.attendanceRate > 0, 'Attendance rate should be computed');
  console.log(`  ✓ Aggregation stats computed cleanly (Attendance rate: ${stats.attendanceRate}%).`);

  console.log('✅ ALL ATTENDANCE DOMAIN TESTS PASSED SUCCESSFULLY!\n');
}
