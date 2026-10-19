import { db } from '../../../../db/store';
import { Curriculum } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class CurriculumRepository extends AcademicBaseRepository<Curriculum> {
  protected getCollection(): Map<string, Curriculum> {
    return db.curriculums;
  }

  public async findByGradeAndSubject(gradeId: string, subjectId: string, tenantId: string): Promise<Curriculum | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(c => !c.isDeleted && c.gradeId === gradeId && c.subjectId === subjectId) || null;
  }

  public async findByGrade(gradeId: string, tenantId: string): Promise<Curriculum[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(c => !c.isDeleted && c.gradeId === gradeId);
  }
}

export const curriculumRepository = new CurriculumRepository();
