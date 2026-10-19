import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InMemoryAttendanceRepository } from '../../../src/domains/attendance/infrastructure/persistence/AttendanceRepository';
import { InMemoryEventBus } from '../../../src/lib/events/bus/InMemoryEventBus';
import { RecordAttendanceUseCase, CorrectAttendanceUseCase, ApproveAttendanceUseCase } from '../../../src/domains/attendance/application/use-cases/AttendanceUseCases';
import { AttendanceStatus } from '../../../src/domains/attendance/domain/enums/AttendanceStatus';
import { StudentCreatedHandler } from '../../../src/domains/attendance/application/event-handlers/AttendanceEventHandlers';
import { StudentCreated } from '../../../tests/events/verification/VerificationEvents';

describe('Attendance Domain', () => {
    let repo: InMemoryAttendanceRepository;
    let eventBus: InMemoryEventBus;

    beforeEach(() => {
        repo = new InMemoryAttendanceRepository();
        eventBus = new InMemoryEventBus();
    });

    describe('RecordAttendanceUseCase', () => {
        it('should record attendance and publish event', async () => {
            const useCase = new RecordAttendanceUseCase(repo, eventBus);
            const publishSpy = vi.spyOn(eventBus, 'publish');

            await useCase.execute({
                tenantId: 'tenant-1',
                academicYearId: 'year-1',
                campusId: 'campus-1',
                classGroupId: 'class-1',
                teacherAssignmentId: 'assign-1',
                subjectId: 'sub-1',
                periodId: 'period-1',
                roomId: 'room-1',
                date: new Date(),
                records: [
                    { studentId: 'student-1', status: AttendanceStatus.PRESENT },
                    { studentId: 'student-2', status: AttendanceStatus.ABSENT }
                ],
                actorId: 'teacher-1'
            });

            expect(publishSpy).toHaveBeenCalledTimes(1);
            const event = publishSpy.mock.calls[0][0];
            expect(event.constructor.name).toBe('AttendanceRecorded');
            expect(event.payload.recordsCount).toBe(2);
        });

        it('should prevent duplicate attendance registers', async () => {
            const useCase = new RecordAttendanceUseCase(repo, eventBus);
            const date = new Date();

            await useCase.execute({
                tenantId: 'tenant-1',
                academicYearId: 'year-1',
                campusId: 'campus-1',
                classGroupId: 'class-1',
                teacherAssignmentId: 'assign-1',
                subjectId: 'sub-1',
                periodId: 'period-1',
                roomId: 'room-1',
                date,
                records: [],
                actorId: 'teacher-1'
            });

            await expect(useCase.execute({
                tenantId: 'tenant-1',
                academicYearId: 'year-1',
                campusId: 'campus-1',
                classGroupId: 'class-1',
                teacherAssignmentId: 'assign-1',
                subjectId: 'sub-1',
                periodId: 'period-1',
                roomId: 'room-1',
                date,
                records: [],
                actorId: 'teacher-1'
            })).rejects.toThrow('Attendance register already exists');
        });
    });

    describe('CorrectAttendanceUseCase', () => {
        it('should correct attendance and publish event', async () => {
            const recordUseCase = new RecordAttendanceUseCase(repo, eventBus);
            const correctUseCase = new CorrectAttendanceUseCase(repo, eventBus);

            await recordUseCase.execute({
                tenantId: 'tenant-1',
                academicYearId: 'year-1',
                campusId: 'campus-1',
                classGroupId: 'class-1',
                teacherAssignmentId: 'assign-1',
                subjectId: 'sub-1',
                periodId: 'period-1',
                roomId: 'room-1',
                date: new Date(),
                records: [
                    { studentId: 'student-1', status: AttendanceStatus.ABSENT }
                ],
                actorId: 'teacher-1'
            });

            // Hack to get the record ID for testing since it's an in-memory repo
            // We know it's the only one
            const allRegisters = Array.from((repo as any).registers.values());
            const recordId = (allRegisters[0] as any).records[0].id;

            const publishSpy = vi.spyOn(eventBus, 'publish');

            await correctUseCase.execute({
                tenantId: 'tenant-1',
                recordId,
                newStatus: AttendanceStatus.EXCUSED,
                reason: 'Medical note provided',
                actorId: 'admin-1'
            });

            const updatedRecord = await repo.findRecordById(recordId);
            expect(updatedRecord?.status).toBe(AttendanceStatus.EXCUSED);

            expect(publishSpy).toHaveBeenCalledTimes(1);
            expect(publishSpy.mock.calls[0][0].constructor.name).toBe('AttendanceCorrected');
        });
    });

    describe('ApproveAttendanceUseCase', () => {
        it('should approve attendance and publish event', async () => {
            const recordUseCase = new RecordAttendanceUseCase(repo, eventBus);
            const approveUseCase = new ApproveAttendanceUseCase(repo, eventBus);

            await recordUseCase.execute({
                tenantId: 'tenant-1',
                academicYearId: 'year-1',
                campusId: 'campus-1',
                classGroupId: 'class-1',
                teacherAssignmentId: 'assign-1',
                subjectId: 'sub-1',
                periodId: 'period-1',
                roomId: 'room-1',
                date: new Date(),
                records: [],
                actorId: 'teacher-1'
            });

            const allRegisters = Array.from((repo as any).registers.values());
            const registerId = (allRegisters[0] as any).id;

            const publishSpy = vi.spyOn(eventBus, 'publish');

            await approveUseCase.execute({
                tenantId: 'tenant-1',
                registerId,
                actorId: 'admin-1'
            });

            const updatedRegister = await repo.findRegisterById(registerId);
            expect(updatedRegister?.status).toBe('APPROVED');

            expect(publishSpy).toHaveBeenCalledTimes(1);
            expect(publishSpy.mock.calls[0][0].constructor.name).toBe('AttendanceApproved');
        });
    });

    describe('Event Handlers', () => {
        it('should handle StudentCreated event', async () => {
            const handler = new StudentCreatedHandler();
            const consoleSpy = vi.spyOn(console, 'log');

            const event = new StudentCreated('evt-1', 'tenant-1', 'corr-1', 'actor-1', { studentId: 'student-1', applicantId: 'app-1' });
            await handler.handle(event);

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('StudentCreated handled: student-1'));
        });
    });
});
