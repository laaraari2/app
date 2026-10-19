import assert from 'assert';
import { academicYearService } from '../src/domains/academic/application/services/academic-year.service';
import { academicTermService } from '../src/domains/academic/application/services/academic-term.service';
import { educationalStageService } from '../src/domains/academic/application/services/educational-stage.service';
import { gradeLevelService } from '../src/domains/academic/application/services/grade-level.service';
import { classGroupService } from '../src/domains/academic/application/services/class-group.service';
import { subjectCategoryService } from '../src/domains/academic/application/services/subject-category.service';
import { subjectService } from '../src/domains/academic/application/services/subject.service';
import { curriculumService } from '../src/domains/academic/application/services/curriculum.service';
import { teachingAssignmentService } from '../src/domains/academic/application/services/teaching-assignment.service';
import { timetableService } from '../src/domains/academic/application/services/timetable.service';
import { schoolCalendarService } from '../src/domains/academic/application/services/school-calendar.service';
import { academicEventService } from '../src/domains/academic/application/services/academic-event.service';
import { ConflictError, ValidationError, AppError } from '../src/errors/AppError';
import { TimetableConflictError, AcademicDomainError } from '../src/domains/academic/domain/errors/academic-domain.error';

export async function runAcademicDomainTests() {
  console.log('\n--- RUNNING ACADEMIC DOMAIN SUITE ---');

  const tenantA = 'tenant-academic-test-a';
  const tenantB = 'tenant-academic-test-b';

  // 1. Academic Year Service & Business Rules
  console.log('  Testing Academic Year Service & Status Rules...');
  const year1 = await academicYearService.createAcademicYear(tenantA, {
    code: 'AY_2024_2025',
    name: 'Année Scolaire 2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    status: 'ACTIVE',
  });
  assert.strictEqual(year1.status, 'ACTIVE');

  // Verify only 1 ACTIVE year constraint
  const year2 = await academicYearService.createAcademicYear(tenantA, {
    code: 'AY_2025_2026',
    name: 'Année Scolaire 2025-2026',
    startDate: '2025-09-01',
    endDate: '2026-06-30',
    status: 'ACTIVE',
  });
  const updatedYear1 = await academicYearService.getAcademicYearById(year1.id, tenantA);
  assert.strictEqual(updatedYear1.status, 'INACTIVE', 'Year 1 should be set to INACTIVE when Year 2 becomes ACTIVE');

  // Date validation check
  try {
    await academicYearService.createAcademicYear(tenantA, {
      code: 'AY-INVALID',
      name: 'Invalid Year',
      startDate: '2025-06-30',
      endDate: '2024-09-01', // End before start
    });
    assert.fail('Should throw date validation error');
  } catch (err) {
    assert.ok(err instanceof AcademicDomainError || err instanceof AppError, 'Should throw error for invalid date range');
  }

  // 2. Academic Term
  console.log('  Testing Academic Term Service...');
  const term1 = await academicTermService.createTerm(tenantA, {
    academicYearId: year2.id,
    code: 'TRIM_1',
    name: 'Premier Trimestre',
    startDate: '2025-09-01',
    endDate: '2025-12-20',
    sequence: 1,
    type: 'TRIMESTER',
    weightPercentage: 33.3,
  });
  assert.strictEqual(term1.code, 'TRIM_1');

  // 3. Educational Stage & Grade Level
  console.log('  Testing Educational Stage & Grade Level Services...');
  const stageCol = await educationalStageService.createStage(tenantA, {
    code: 'COLLEGE',
    name: 'Enseignement Collégial',
    description: 'De la 1ère à la 3ème année collège',
  });

  const grade1AC = await gradeLevelService.createGradeLevel(tenantA, {
    stageId: stageCol.id,
    code: '1AC',
    name: '1ère Année Collège',
    sequence: 1,
    passingGrade: 10,
  });
  assert.strictEqual(grade1AC.stageId, stageCol.id);

  // 4. Class Group
  console.log('  Testing Class Group Service...');
  const class1AC1 = await classGroupService.createClassGroup(tenantA, {
    gradeId: grade1AC.id,
    academicYearId: year2.id,
    code: '1AC_1',
    name: '1AC Groupe 1',
    maxCapacity: 30,
  });
  assert.strictEqual(class1AC1.gradeId, grade1AC.id);

  // 5. Subject Category & Subject
  console.log('  Testing Subject Category & Subject Services...');
  const catSci = await subjectCategoryService.createCategory(tenantA, {
    code: 'SCI',
    name: 'Sciences Exactes',
    colorCode: '#10B981',
  });

  const subjMath = await subjectService.createSubject(tenantA, {
    categoryId: catSci.id,
    code: 'MATH',
    name: 'Mathématiques',
    weeklyHours: 5,
    credits: 2,
  });
  assert.strictEqual(subjMath.categoryId, catSci.id);

  // 6. Curriculum
  console.log('  Testing Curriculum Service...');
  const curr1 = await curriculumService.createCurriculum(tenantA, {
    gradeId: grade1AC.id,
    subjectId: subjMath.id,
    academicYearId: year2.id,
    weeklyHours: 5,
    coefficient: 5,
  });
  assert.strictEqual(curr1.coefficient, 5);

  // Test duplicate curriculum constraint
  try {
    await curriculumService.createCurriculum(tenantA, {
      gradeId: grade1AC.id,
      subjectId: subjMath.id,
      academicYearId: year2.id,
      weeklyHours: 5,
      coefficient: 5,
    });
    assert.fail('Should throw duplicate curriculum conflict error');
  } catch (err) {
    assert.ok(err instanceof ConflictError, 'Should throw ConflictError for duplicate curriculum entry');
  }

  // 7. Teaching Assignment
  console.log('  Testing Teaching Assignment Service...');
  const assign1 = await teachingAssignmentService.createAssignment(tenantA, {
    academicYearId: year2.id,
    classGroupId: class1AC1.id,
    subjectId: subjMath.id,
    teacherId: 'teacher-uuid-101',
    teacherName: 'Prof. Alami',
    weeklyHours: 5,
  });
  assert.strictEqual(assign1.teacherName, 'Prof. Alami');

  // 8. Timetable Engine & Conflict Detection
  console.log('  Testing Timetable Service & Conflict Engine...');
  const slot1 = await timetableService.createSlot(tenantA, {
    academicYearId: year2.id,
    campusId: 'campus-main-a',
    classGroupId: class1AC1.id,
    subjectId: subjMath.id,
    teacherId: 'teacher-uuid-101',
    roomId: 'ROOM-101',
    dayOfWeek: 'MONDAY',
    periodNumber: 1,
    startTime: '08:30',
    endTime: '09:30',
  });
  assert.strictEqual(slot1.periodNumber, 1);

  // Test conflict detection: create overlapping slot with same room/class/teacher
  try {
    await timetableService.createSlot(tenantA, {
      academicYearId: year2.id,
      campusId: 'campus-main-a',
      classGroupId: class1AC1.id, // Conflict! Same class group
      subjectId: subjMath.id,
      roomId: 'ROOM-102',
      dayOfWeek: 'MONDAY',
      periodNumber: 1, // Same period
      startTime: '08:30',
      endTime: '09:30',
    }, true);
    assert.fail('Should throw TimetableConflictError');
  } catch (err) {
    assert.ok(err instanceof TimetableConflictError, 'Should throw TimetableConflictError for class group overlap');
  }

  // 9. School Calendar & Academic Events
  console.log('  Testing School Calendar & Academic Event Services...');
  const calendar = await schoolCalendarService.createCalendar(tenantA, {
    academicYearId: year2.id,
    code: 'CAL_2025',
    name: 'Calendrier Scolaire Général 2025',
  });

  const eventHoliday = await academicEventService.createEvent(tenantA, {
    calendarId: calendar.id,
    academicYearId: year2.id,
    title: 'Vacances d\'Automne',
    eventType: 'HOLIDAY',
    startDate: '2025-10-25',
    endDate: '2025-11-02',
  });
  assert.strictEqual(eventHoliday.eventType, 'HOLIDAY');

  // 10. Tenant Isolation Check
  console.log('  Testing Tenant Isolation...');
  const resB = await subjectService.getPaginatedSubjects(tenantB, {});
  assert.strictEqual(resB.data.length, 0, 'Tenant B should not see Tenant A subjects');

  console.log('  ✅ ALL 10 ACADEMIC DOMAIN TEST SUITES PASSED CLEANLY!');
}
