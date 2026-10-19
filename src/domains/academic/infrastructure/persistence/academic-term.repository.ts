import { db } from '../../../../db/store';
import { AcademicTerm } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class AcademicTermRepository extends AcademicBaseRepository<AcademicTerm> {
  protected getCollection(): Map<string, AcademicTerm> {
    return db.academicTerms;
  }

  public async findByCode(code: string, tenantId: string): Promise<AcademicTerm | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(t => !t.isDeleted && t.code.toUpperCase() === code.toUpperCase()) || null;
  }

  public async findByAcademicYear(academicYearId: string, tenantId: string): Promise<AcademicTerm[]> {
    const list = await this.findAll(undefined, tenantId);
    return list
      .filter(t => !t.isDeleted && t.academicYearId === academicYearId)
      .sort((a, b) => a.sequence - b.sequence);
  }
}

export const academicTermRepository = new AcademicTermRepository();
