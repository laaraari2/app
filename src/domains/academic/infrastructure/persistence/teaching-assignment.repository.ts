import { db } from '../../../../db/store';
import { TeachingAssignment } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class TeachingAssignmentRepository extends AcademicBaseRepository<TeachingAssignment> {
  protected getCollection(): Map<string, TeachingAssignment> {
    return db.teachingAssignments;
  }

  public async findAssignments(
    tenantId: string,
    filter: { teacherId?: string; classGroupId?: string; subjectId?: string; academicYearId?: string }
  ): Promise<TeachingAssignment[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(ta => {
      if (ta.isDeleted) return false;
      if (filter.teacherId && ta.teacherId !== filter.teacherId) return false;
      if (filter.classGroupId && ta.classGroupId !== filter.classGroupId) return false;
      if (filter.subjectId && ta.subjectId !== filter.subjectId) return false;
      if (filter.academicYearId && ta.academicYearId !== filter.academicYearId) return false;
      return true;
    });
  }
}

export const teachingAssignmentRepository = new TeachingAssignmentRepository();
