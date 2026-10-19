import { db } from '../../../../db/store';
import { Subject } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class SubjectRepository extends AcademicBaseRepository<Subject> {
  protected getCollection(): Map<string, Subject> {
    return db.subjects;
  }

  public async findByCode(code: string, tenantId: string): Promise<Subject | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(s => !s.isDeleted && s.code.toUpperCase() === code.toUpperCase()) || null;
  }

  public async findByCategory(categoryId: string, tenantId: string): Promise<Subject[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(s => !s.isDeleted && s.categoryId === categoryId);
  }
}

export const subjectRepository = new SubjectRepository();
