import { db } from '../../../../db/store';
import { SchoolCalendar } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class SchoolCalendarRepository extends AcademicBaseRepository<SchoolCalendar> {
  protected getCollection(): Map<string, SchoolCalendar> {
    return db.schoolCalendars;
  }

  public async findByCode(code: string, tenantId: string): Promise<SchoolCalendar | null> {
    const list = await this.findAll(undefined, tenantId);
    return list.find(c => !c.isDeleted && c.code.toUpperCase() === code.toUpperCase()) || null;
  }

  public async getDefaultCalendar(tenantId: string, academicYearId?: string): Promise<SchoolCalendar | null> {
    const list = await this.findAll(undefined, tenantId);
    let filtered = list.filter(c => !c.isDeleted);
    if (academicYearId) {
      filtered = filtered.filter(c => c.academicYearId === academicYearId);
    }
    return filtered.find(c => c.isDefault) || filtered[0] || null;
  }
}

export const schoolCalendarRepository = new SchoolCalendarRepository();
