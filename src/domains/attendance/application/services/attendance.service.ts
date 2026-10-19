import { attendanceRepository, IAttendanceRepository } from '../../infrastructure/persistence/AttendanceRepository';
import { inMemoryEventBus } from '../../../../lib/events/bus/InMemoryEventBus';
import { IEventBus } from '../../../../lib/events/core/EventBus';
import {
  RecordAttendanceUseCase,
  CorrectAttendanceUseCase,
  ApproveAttendanceUseCase,
} from '../use-cases/AttendanceUseCases';
import { AttendanceStatus } from '../../domain/enums/AttendanceStatus';
import { AttendanceRegister, AttendanceRecord, AttendanceHistory } from '../../domain/entities/AttendanceEntities';
import { NotFoundError } from '../../../../errors/AppError';

export class AttendanceService {
  private recordUseCase: RecordAttendanceUseCase;
  private correctUseCase: CorrectAttendanceUseCase;
  private approveUseCase: ApproveAttendanceUseCase;

  constructor(
    private repo: IAttendanceRepository = attendanceRepository,
    private bus: IEventBus = inMemoryEventBus
  ) {
    this.recordUseCase = new RecordAttendanceUseCase(this.repo, this.bus);
    this.correctUseCase = new CorrectAttendanceUseCase(this.repo, this.bus);
    this.approveUseCase = new ApproveAttendanceUseCase(this.repo, this.bus);
  }

  public async recordAttendance(dto: {
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
    return this.recordUseCase.execute(dto);
  }

  public async correctAttendance(dto: {
    tenantId: string;
    recordId: string;
    newStatus: AttendanceStatus;
    reason: string;
    actorId: string;
  }): Promise<void> {
    return this.correctUseCase.execute(dto);
  }

  public async approveAttendance(dto: {
    tenantId: string;
    registerId: string;
    actorId: string;
  }): Promise<void> {
    return this.approveUseCase.execute(dto);
  }

  public async getRegistersByTenant(tenantId: string): Promise<AttendanceRegister[]> {
    return this.repo.findRegistersByTenant(tenantId);
  }

  public async getRegisterById(id: string): Promise<AttendanceRegister> {
    const reg = await this.repo.findRegisterById(id);
    if (!reg) {
      throw new NotFoundError('Attendance Register');
    }
    return reg;
  }

  public async getRegistersByClass(classGroupId: string, tenantId?: string): Promise<AttendanceRegister[]> {
    return this.repo.findRegistersByClassGroup(classGroupId, tenantId);
  }

  public async getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    return this.repo.findRecordsByStudentId(studentId);
  }

  public async getRecordHistory(recordId: string): Promise<AttendanceHistory[]> {
    return this.repo.findHistoryByRecordId(recordId);
  }

  public async getAttendanceStats(tenantId: string): Promise<{
    totalRegisters: number;
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    excusedCount: number;
    lateCount: number;
    attendanceRate: number;
  }> {
    const registers = await this.repo.findRegistersByTenant(tenantId);
    let totalRecords = 0;
    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;
    let lateCount = 0;

    for (const reg of registers) {
      for (const rec of reg.records) {
        totalRecords++;
        if (rec.status === AttendanceStatus.PRESENT) presentCount++;
        else if (rec.status === AttendanceStatus.ABSENT) absentCount++;
        else if (rec.status === AttendanceStatus.EXCUSED || rec.status === AttendanceStatus.MEDICAL_LEAVE) excusedCount++;
        else if (rec.status === AttendanceStatus.LATE) lateCount++;
      }
    }

    const attendanceRate = totalRecords > 0
      ? Math.round(((presentCount + lateCount) / totalRecords) * 1000) / 10
      : 100;

    return {
      totalRegisters: registers.length,
      totalRecords,
      presentCount,
      absentCount,
      excusedCount,
      lateCount,
      attendanceRate,
    };
  }
}

export const attendanceService = new AttendanceService();
