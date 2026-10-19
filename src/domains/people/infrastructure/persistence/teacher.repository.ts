import { db } from '../../../../db/store';
import { TeacherProfile } from '../../domain/entities/people-types';

export class TeacherRepository {
  public async create(teacher: TeacherProfile): Promise<TeacherProfile> {
    db.teacherProfiles.set(teacher.id, teacher);
    return teacher;
  }

  public async findById(id: string): Promise<TeacherProfile | null> {
    const teacher = db.teacherProfiles.get(id);
    if (!teacher || teacher.isDeleted) return null;
    return teacher;
  }

  public async findByStaffMemberId(staffMemberId: string): Promise<TeacherProfile | null> {
    for (const teacher of db.teacherProfiles.values()) {
      if (teacher.staffMemberId === staffMemberId && !teacher.isDeleted) {
        return teacher;
      }
    }
    return null;
  }

  public async findAllForTenant(
    tenantId: string,
    filters?: {
      subjectId?: string;
      campusId?: string;
      search?: string;
    }
  ): Promise<TeacherProfile[]> {
    let result: TeacherProfile[] = [];
    for (const teacher of db.teacherProfiles.values()) {
      if (teacher.tenantId !== tenantId || teacher.isDeleted) continue;

      if (filters?.subjectId && !teacher.subjectIds.includes(filters.subjectId)) continue;
      if (filters?.campusId && !teacher.campusIds.includes(filters.campusId)) continue;

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesSpec = teacher.specialization.toLowerCase().includes(query);
        const matchesQual = teacher.qualification.toLowerCase().includes(query);
        if (!matchesSpec && !matchesQual) continue;
      }

      result.push(teacher);
    }
    return result;
  }

  public async update(id: string, updates: Partial<TeacherProfile>): Promise<TeacherProfile | null> {
    const existing = db.teacherProfiles.get(id);
    if (!existing || existing.isDeleted) return null;

    const updated: TeacherProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    db.teacherProfiles.set(id, updated);
    return updated;
  }

  public async softDelete(id: string): Promise<boolean> {
    const existing = db.teacherProfiles.get(id);
    if (!existing || existing.isDeleted) return false;

    existing.isDeleted = true;
    existing.updatedAt = new Date();
    db.teacherProfiles.set(id, existing);
    return true;
  }
}

export const teacherRepository = new TeacherRepository();
