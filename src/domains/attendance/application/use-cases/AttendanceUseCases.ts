import { IAttendanceRepository } from '../../infrastructure/persistence/AttendanceRepository';
import { IEventBus } from '../../../../lib/events/core/EventBus';
import { AttendanceRegister, AttendanceRecord, AttendanceHistory } from '../../domain/entities/AttendanceEntities';
import { AttendanceRecorded, AttendanceCorrected, AttendanceApproved } from '../../domain/events/AttendanceEvents';
import { AttendanceStatus } from '../../domain/enums/AttendanceStatus';

export class RecordAttendanceUseCase {
    constructor(private repo: IAttendanceRepository, private eventBus: IEventBus) { }

    public async execute(dto: {
        tenantId: string;
        academicYearId: string;
        campusId: string;
        classGroupId: string;
        teacherAssignmentId: string;
        subjectId: string;
        periodId: string;
        roomId: string;
        date: Date;
        records: { studentId: string; status: AttendanceStatus; notes?: string }[];
        actorId: string;
    }): Promise<void> {
        const existing = await this.repo.findRegisterByDetails(dto.classGroupId, dto.periodId, dto.date);
        if (existing) {
            throw new Error('Attendance register already exists for this class and period');
        }

        const registerId = `reg-${Date.now()}`;
        const register = new AttendanceRegister(
            registerId, dto.tenantId, dto.academicYearId, dto.campusId, dto.classGroupId,
            dto.teacherAssignmentId, dto.subjectId, dto.periodId, dto.roomId, dto.date
        );

        for (const rec of dto.records) {
            const record = new AttendanceRecord(`rec-${Date.now()}-${rec.studentId}`, registerId, rec.studentId, rec.status, rec.notes);
            register.addRecord(record);
        }

        register.status = 'SUBMITTED';
        await this.repo.saveRegister(register);

        await this.eventBus.publish(new AttendanceRecorded(
            `evt-${Date.now()}`, dto.tenantId, `corr-${Date.now()}`, dto.actorId,
            { registerId, recordsCount: register.records.length }
        ));
    }
}

export class CorrectAttendanceUseCase {
    constructor(private repo: IAttendanceRepository, private eventBus: IEventBus) { }

    public async execute(dto: {
        tenantId: string;
        recordId: string;
        newStatus: AttendanceStatus;
        reason: string;
        actorId: string;
    }): Promise<void> {
        const record = await this.repo.findRecordById(dto.recordId);
        if (!record) throw new Error('Record not found');

        const history = new AttendanceHistory(
            `hist-${Date.now()}`, record.id, record.status, dto.newStatus, dto.actorId, new Date(), dto.reason
        );

        record.status = dto.newStatus;

        await this.repo.saveHistory(history);
        await this.repo.saveRecord(record);

        await this.eventBus.publish(new AttendanceCorrected(
            `evt-${Date.now()}`, dto.tenantId, `corr-${Date.now()}`, dto.actorId,
            { recordId: record.id, newStatus: dto.newStatus, reason: dto.reason }
        ));
    }
}

export class ApproveAttendanceUseCase {
    constructor(private repo: IAttendanceRepository, private eventBus: IEventBus) { }

    public async execute(dto: {
        tenantId: string;
        registerId: string;
        actorId: string;
    }): Promise<void> {
        const register = await this.repo.findRegisterById(dto.registerId);
        if (!register) throw new Error('Register not found');

        register.status = 'APPROVED';
        await this.repo.saveRegister(register);

        await this.eventBus.publish(new AttendanceApproved(
            `evt-${Date.now()}`, dto.tenantId, `corr-${Date.now()}`, dto.actorId,
            { registerId: register.id }
        ));
    }
}
