import {
  AttendanceRegister,
  AttendanceRecord,
  AttendanceHistory,
} from '../../domain/entities/AttendanceEntities';

export interface IAttendanceRepository {
  saveRegister(register: AttendanceRegister): Promise<void>;
  findRegisterById(id: string): Promise<AttendanceRegister | null>;
  findRegisterByDetails(classGroupId: string, periodId: string, date: Date): Promise<AttendanceRegister | null>;
  saveRecord(record: AttendanceRecord): Promise<void>;
  findRecordById(id: string): Promise<AttendanceRecord | null>;
  saveHistory(history: AttendanceHistory): Promise<void>;
  findRegistersByTenant(tenantId: string): Promise<AttendanceRegister[]>;
  findRegistersByClassGroup(classGroupId: string, tenantId?: string): Promise<AttendanceRegister[]>;
  findRecordsByStudentId(studentId: string): Promise<AttendanceRecord[]>;
  findHistoryByRecordId(recordId: string): Promise<AttendanceHistory[]>;
}

export class InMemoryAttendanceRepository implements IAttendanceRepository {
  private registers: Map<string, AttendanceRegister> = new Map();
  private records: Map<string, AttendanceRecord> = new Map();
  private history: Map<string, AttendanceHistory[]> = new Map();

  public async saveRegister(register: AttendanceRegister): Promise<void> {
    this.registers.set(register.id, register);
    for (const record of register.records) {
      this.records.set(record.id, record);
    }
  }

  public async findRegisterById(id: string): Promise<AttendanceRegister | null> {
    return this.registers.get(id) || null;
  }

  public async findRegisterByDetails(
    classGroupId: string,
    periodId: string,
    date: Date
  ): Promise<AttendanceRegister | null> {
    const targetDay = new Date(date).toDateString();
    for (const register of this.registers.values()) {
      const regDay = new Date(register.date).toDateString();
      if (
        register.classGroupId === classGroupId &&
        register.periodId === periodId &&
        regDay === targetDay
      ) {
        return register;
      }
    }
    return null;
  }

  public async saveRecord(record: AttendanceRecord): Promise<void> {
    this.records.set(record.id, record);
    // Also update record inside parent register if present
    const register = this.registers.get(record.registerId);
    if (register) {
      const idx = register.records.findIndex((r) => r.id === record.id);
      if (idx !== -1) {
        register.records[idx] = record;
      }
    }
  }

  public async findRecordById(id: string): Promise<AttendanceRecord | null> {
    return this.records.get(id) || null;
  }

  public async saveHistory(history: AttendanceHistory): Promise<void> {
    const list = this.history.get(history.recordId) || [];
    list.push(history);
    this.history.set(history.recordId, list);
  }

  public async findRegistersByTenant(tenantId: string): Promise<AttendanceRegister[]> {
    return Array.from(this.registers.values()).filter((r) => r.tenantId === tenantId);
  }

  public async findRegistersByClassGroup(
    classGroupId: string,
    tenantId?: string
  ): Promise<AttendanceRegister[]> {
    return Array.from(this.registers.values()).filter(
      (r) => r.classGroupId === classGroupId && (!tenantId || r.tenantId === tenantId)
    );
  }

  public async findRecordsByStudentId(studentId: string): Promise<AttendanceRecord[]> {
    return Array.from(this.records.values()).filter((r) => r.studentId === studentId);
  }

  public async findHistoryByRecordId(recordId: string): Promise<AttendanceHistory[]> {
    return this.history.get(recordId) || [];
  }
}

export const attendanceRepository = new InMemoryAttendanceRepository();
