import { db } from '../../../../db/store';
import { AcademicYear } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class AcademicYearRepository extends AcademicBaseRepository<AcademicYear> {
  protected getCollection(): Map<string, AcademicYear> {
    return db.academicYears;
  }

  public async findByCode(code: string, tenantId: string): Promise<AcademicYear | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(a => !a.isDeleted && a.code.toUpperCase() === code.toUpperCase()) || null;
  }

  public async getCurrentAcademicYear(tenantId: string): Promise<AcademicYear | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(a => !a.isDeleted && a.isCurrent) || list.find(a => !a.isDeleted) || null;
  }

  public async setCurrentAcademicYear(tenantId: string, id: string): Promise<AcademicYear | null> {
    const list = await this.findAll(undefined, tenantId);
    let targetYear: AcademicYear | null = null;

    for (const ay of list) {
      if (ay.id === id) {
        ay.isCurrent = true;
        ay.status = 'ACTIVE';
        ay.updatedAt = new Date();
        targetYear = ay;
      } else {
        if (ay.isCurrent) ay.isCurrent = false;
        if (ay.status === 'ACTIVE') ay.status = 'INACTIVE';
        ay.updatedAt = new Date();
      }
      db.academicYears.set(ay.id, ay);
    }

    return targetYear;
  }
}

export const academicYearRepository = new AcademicYearRepository();
