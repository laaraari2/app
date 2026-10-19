import { schoolCalendarRepository } from '../../infrastructure/persistence/school-calendar.repository';
import { SchoolCalendar, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateSchoolCalendarDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { auditService } from '../../../../services/audit.service';

export class SchoolCalendarService {
  public async getPaginatedCalendars(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<SchoolCalendar>> {
    return schoolCalendarRepository.findPaginated(tenantId, options);
  }

  public async getCalendarById(id: string, tenantId: string): Promise<SchoolCalendar> {
    const cal = await schoolCalendarRepository.findById(id, tenantId);
    if (!cal || cal.isDeleted) {
      throw new NotFoundError('School Calendar');
    }
    return cal;
  }

  public async createCalendar(
    tenantId: string,
    dto: CreateSchoolCalendarDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<SchoolCalendar> {
    const codeVo = new AcademicCode(dto.code);

    const existing = await schoolCalendarRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Calendar code '${codeVo.getValue()}' already exists`);
    }

    const calendar = await schoolCalendarRepository.create({
      tenantId,
      academicYearId: dto.academicYearId,
      campusId: dto.campusId,
      name: dto.name,
      code: codeVo.getValue(),
      description: dto.description,
      timeZone: dto.timeZone || 'Africa/Casablanca',
      workingDays: dto.workingDays || ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      dailyStartTime: dto.dailyStartTime || '08:00',
      dailyEndTime: dto.dailyEndTime || '17:00',
      isDefault: dto.isDefault || false,
      createdBy: actorId,
      isDeleted: false,
      isArchived: false,
    });

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SCHOOL_CALENDAR_CREATED',
        resource: 'school_calendar',
        targetId: calendar.id,
        changes: { name: calendar.name, code: calendar.code },
      });
    }

    return calendar;
  }

  public async updateCalendar(
    id: string,
    tenantId: string,
    updates: Partial<SchoolCalendar>,
    actorId?: string,
    actorEmail?: string
  ): Promise<SchoolCalendar> {
    await this.getCalendarById(id, tenantId);

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await schoolCalendarRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Calendar code '${codeVo.getValue()}' is already taken`);
      }
      updates.code = codeVo.getValue();
    }

    const updated = await schoolCalendarRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('School Calendar');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SCHOOL_CALENDAR_UPDATED',
        resource: 'school_calendar',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteCalendar(id: string, tenantId: string, actorId?: string): Promise<SchoolCalendar> {
    const deleted = await schoolCalendarRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('School Calendar');
    return deleted;
  }

  public async restoreCalendar(id: string, tenantId: string, actorId?: string): Promise<SchoolCalendar> {
    const restored = await schoolCalendarRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('School Calendar');
    return restored;
  }

  public async archiveCalendar(id: string, tenantId: string, actorId?: string): Promise<SchoolCalendar> {
    const archived = await schoolCalendarRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('School Calendar');
    return archived;
  }
}

export const schoolCalendarService = new SchoolCalendarService();
