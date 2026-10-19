import { academicEventRepository } from '../../infrastructure/persistence/academic-event.repository';
import { AcademicEvent, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateAcademicEventDto } from '../../dto/academic.dto';
import { NotFoundError } from '../../../../errors/AppError';
import { DateRange } from '../../domain/value-objects/date-range.vo';
import { auditService } from '../../../../services/audit.service';

export class AcademicEventService {
  public async getPaginatedEvents(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<AcademicEvent>> {
    return academicEventRepository.findPaginated(tenantId, options);
  }

  public async getEventById(id: string, tenantId: string): Promise<AcademicEvent> {
    const event = await academicEventRepository.findById(id, tenantId);
    if (!event || event.isDeleted) {
      throw new NotFoundError('Academic Event');
    }
    return event;
  }

  public async getEventsByAcademicYear(academicYearId: string, tenantId: string): Promise<AcademicEvent[]> {
    return academicEventRepository.findEventsByYear(academicYearId, tenantId);
  }

  public async createEvent(
    tenantId: string,
    dto: CreateAcademicEventDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<AcademicEvent> {
    const dateRange = new DateRange(dto.startDate, dto.endDate);

    const event = await academicEventRepository.create({
      tenantId,
      calendarId: dto.calendarId,
      academicYearId: dto.academicYearId,
      campusId: dto.campusId,
      title: dto.title,
      eventType: dto.eventType,
      startDate: dateRange.getStart(),
      endDate: dateRange.getEnd(),
      description: dto.description,
      affectsAttendance: dto.affectsAttendance ?? (dto.eventType === 'HOLIDAY' || dto.eventType === 'NATIONAL_HOLIDAY'),
      isGlobal: dto.isGlobal ?? false,
      createdBy: actorId,
      isDeleted: false,
      isArchived: false,
    });

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ACADEMIC_EVENT_CREATED',
        resource: 'academic_event',
        targetId: event.id,
        changes: { title: event.title, eventType: event.eventType },
      });
    }

    return event;
  }

  public async updateEvent(
    id: string,
    tenantId: string,
    updates: Partial<AcademicEvent>,
    actorId?: string,
    actorEmail?: string
  ): Promise<AcademicEvent> {
    await this.getEventById(id, tenantId);

    if (updates.startDate && updates.endDate) {
      const dr = new DateRange(updates.startDate, updates.endDate);
      updates.startDate = dr.getStart();
      updates.endDate = dr.getEnd();
    }

    const updated = await academicEventRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Academic Event');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ACADEMIC_EVENT_UPDATED',
        resource: 'academic_event',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteEvent(id: string, tenantId: string, actorId?: string): Promise<AcademicEvent> {
    const deleted = await academicEventRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Academic Event');
    return deleted;
  }

  public async restoreEvent(id: string, tenantId: string, actorId?: string): Promise<AcademicEvent> {
    const restored = await academicEventRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Academic Event');
    return restored;
  }

  public async archiveEvent(id: string, tenantId: string, actorId?: string): Promise<AcademicEvent> {
    const archived = await academicEventRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Academic Event');
    return archived;
  }
}

export const academicEventService = new AcademicEventService();
