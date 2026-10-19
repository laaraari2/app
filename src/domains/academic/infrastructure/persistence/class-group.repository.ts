import { db } from '../../../../db/store';
import { ClassGroup } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class ClassGroupRepository extends AcademicBaseRepository<ClassGroup> {
  protected getCollection(): Map<string, ClassGroup> {
    return db.classGroups;
  }

  public async findByCode(code: string, tenantId: string): Promise<ClassGroup | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(c => !c.isDeleted && c.code.toUpperCase() === code.toUpperCase()) || null;
  }

  public async findByGrade(gradeId: string, tenantId: string): Promise<ClassGroup[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(c => !c.isDeleted && c.gradeId === gradeId);
  }
}

export const classGroupRepository = new ClassGroupRepository();
