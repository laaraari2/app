import { AttendanceStatus } from '../enums/AttendanceStatus';

export class AttendanceRecord {
    constructor(
        public readonly id: string,
        public readonly registerId: string,
        public readonly studentId: string,
        public status: AttendanceStatus,
        public notes: string = ''
    ) { }
}

export class AttendanceHistory {
    constructor(
        public readonly id: string,
        public readonly recordId: string,
        public readonly previousStatus: AttendanceStatus,
        public readonly newStatus: AttendanceStatus,
        public readonly changedBy: string,
        public readonly changedAt: Date,
        public readonly reason: string
    ) { }
}

export class AttendanceRegister {
    constructor(
        public readonly id: string,
        public readonly tenantId: string,
        public readonly academicYearId: string,
        public readonly campusId: string,
        public readonly classGroupId: string,
        public readonly teacherAssignmentId: string,
        public readonly subjectId: string,
        public readonly periodId: string,
        public readonly roomId: string,
        public readonly date: Date,
        public status: 'PENDING' | 'SUBMITTED' | 'APPROVED' = 'PENDING',
        public records: AttendanceRecord[] = []
    ) { }

    public addRecord(record: AttendanceRecord): void {
        const existing = this.records.find(r => r.studentId === record.studentId);
        if (existing) {
            throw new Error('Duplicate attendance record for student');
        }
        this.records.push(record);
    }
}
