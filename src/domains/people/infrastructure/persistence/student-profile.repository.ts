import { db } from '../../../../db/store';
import { StudentProfile } from '../../domain/entities/people-types';

export class StudentProfileRepository {
  public async create(student: StudentProfile): Promise<StudentProfile> {
    db.studentProfiles.set(student.id, student);
    return student;
  }

  public async findById(id: string): Promise<StudentProfile | null> {
    const student = db.studentProfiles.get(id);
    if (!student || student.isDeleted) return null;
    return student;
  }

  public async findByStudentNumber(tenantId: string, studentNumber: string): Promise<StudentProfile | null> {
    for (const student of db.studentProfiles.values()) {
      if (
        student.tenantId === tenantId &&
        student.studentNumber.toLowerCase() === studentNumber.toLowerCase() &&
        !student.isDeleted
      ) {
        return student;
      }
    }
    return null;
  }

  public async findByNationalId(tenantId: string, nationalId: string): Promise<StudentProfile | null> {
    for (const student of db.studentProfiles.values()) {
      if (
        student.tenantId === tenantId &&
        student.nationalId.toLowerCase() === nationalId.toLowerCase() &&
        !student.isDeleted
      ) {
        return student;
      }
    }
    return null;
  }

  public async findByEnrolledStudentId(enrolledStudentId: string): Promise<StudentProfile | null> {
    for (const student of db.studentProfiles.values()) {
      if (student.enrolledStudentId === enrolledStudentId && !student.isDeleted) {
        return student;
      }
    }
    return null;
  }

  public async findAllForTenant(
    tenantId: string,
    filters?: {
      campusId?: string;
      gradeLevelId?: string;
      classGroupId?: string;
      status?: string;
      search?: string;
    }
  ): Promise<StudentProfile[]> {
    let result: StudentProfile[] = [];
    for (const student of db.studentProfiles.values()) {
      if (student.tenantId !== tenantId || student.isDeleted) continue;

      if (filters?.campusId && student.campusId !== filters.campusId) continue;
      if (filters?.gradeLevelId && student.gradeLevelId !== filters.gradeLevelId) continue;
      if (filters?.classGroupId && student.classGroupId !== filters.classGroupId) continue;
      if (filters?.status && student.status !== filters.status) continue;

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesName =
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(query);
        const matchesNum = student.studentNumber.toLowerCase().includes(query);
        const matchesNational = student.nationalId.toLowerCase().includes(query);
        if (!matchesName && !matchesNum && !matchesNational) continue;
      }

      result.push(student);
    }
    return result;
  }

  public async update(id: string, updates: Partial<StudentProfile>): Promise<StudentProfile | null> {
    const existing = db.studentProfiles.get(id);
    if (!existing || existing.isDeleted) return null;

    const updated: StudentProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    db.studentProfiles.set(id, updated);
    return updated;
  }

  public async softDelete(id: string): Promise<boolean> {
    const existing = db.studentProfiles.get(id);
    if (!existing || existing.isDeleted) return false;

    existing.isDeleted = true;
    existing.deletedAt = new Date();
    existing.updatedAt = new Date();
    db.studentProfiles.set(id, existing);
    return true;
  }

  public async restore(id: string): Promise<boolean> {
    const existing = db.studentProfiles.get(id);
    if (!existing || !existing.isDeleted) return false;

    existing.isDeleted = false;
    existing.deletedAt = undefined;
    existing.updatedAt = new Date();
    db.studentProfiles.set(id, existing);
    return true;
  }
}

export const studentProfileRepository = new StudentProfileRepository();
