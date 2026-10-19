import { db } from '../../../../db/store';
import { GradeLevel } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class GradeLevelRepository extends AcademicBaseRepository<GradeLevel> {
  protected getCollection(): Map<string, GradeLevel> {
    return db.gradeLevels;
  }

  public async findByCode(code: string, tenantId: string): Promise<GradeLevel | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(g => !g.isDeleted && g.code.toUpperCase() === code.toUpperCase()) || null;
  }

  public async findByStage(stageId: string, tenantId: string): Promise<GradeLevel[]> {
    const list = await this.findAll(undefined, tenantId);
    return list
      .filter(g => !g.isDeleted && g.stageId === stageId)
      .sort((a, b) => a.sequence - b.sequence);
  }
}

export const gradeLevelRepository = new GradeLevelRepository();
