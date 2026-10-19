import { db } from '../../../../db/store';
import { SubjectCategory } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class SubjectCategoryRepository extends AcademicBaseRepository<SubjectCategory> {
  protected getCollection(): Map<string, SubjectCategory> {
    return db.subjectCategories;
  }

  public async findByCode(code: string, tenantId: string): Promise<SubjectCategory | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(sc => !sc.isDeleted && sc.code.toUpperCase() === code.toUpperCase()) || null;
  }
}

export const subjectCategoryRepository = new SubjectCategoryRepository();
