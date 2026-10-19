import { db } from '../../../../db/store';
import { AcademicEvent, EventType } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class AcademicEventRepository extends AcademicBaseRepository<AcademicEvent> {
  protected getCollection(): Map<string, AcademicEvent> {
    return db.academicEvents;
  }

  public async findEventsByYear(academicYearId: string, tenantId: string): Promise<AcademicEvent[]> {
    const list = await this.findAll(undefined, tenantId);
    return list
      .filter(e => !e.isDeleted && (e.academicYearId === academicYearId || e.isGlobal))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  public async findEventsByType(eventType: EventType, tenantId: string): Promise<AcademicEvent[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(e => !e.isDeleted && e.eventType === eventType);
  }
}

export const academicEventRepository = new AcademicEventRepository();
