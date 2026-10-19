import { db } from '../../../../db/store';
import { EducationalStage } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class EducationalStageRepository extends AcademicBaseRepository<EducationalStage> {
  protected getCollection(): Map<string, EducationalStage> {
    return db.educationalStages;
  }

  public async findByCode(code: string, tenantId: string): Promise<EducationalStage | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(s => !s.isDeleted && s.code.toUpperCase() === code.toUpperCase()) || null;
  }
}

export const educationalStageRepository = new EducationalStageRepository();
