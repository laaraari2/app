import { academicYearRepository } from '../../infrastructure/persistence/academic-year.repository';
import { AcademicYear, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { DateRange } from '../../domain/value-objects/date-range.vo';

export class AcademicYearService {
  public async getPaginatedAcademicYears(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<AcademicYear>> {
    return academicYearRepository.findPaginated(tenantId, options);
  }

  public async getAcademicYears(tenantId: string): Promise<AcademicYear[]> {
    const res = await academicYearRepository.findPaginated(tenantId, { limit: 1000 });
    return res.data;
  }

  public async getAcademicYearById(id: string, tenantId: string): Promise<AcademicYear> {
    const ay = await academicYearRepository.findById(id, tenantId);
    if (!ay || ay.isDeleted) {
      throw new NotFoundError('Academic Year');
    }
    return ay;
  }

  public async getCurrentAcademicYear(tenantId: string): Promise<AcademicYear> {
    const current = await academicYearRepository.getCurrentAcademicYear(tenantId);
    if (!current) {
      throw new NotFoundError('Current Academic Year');
    }
    return current;
  }

  public async createAcademicYear(
    tenantId: string,
    data: {
      name: string;
      code: string;
      startDate: string | Date;
      endDate: string | Date;
      isCurrent?: boolean;
      status?: 'UPCOMING' | 'ACTIVE' | 'ARCHIVED' | 'CLOSED';
    },
    actorId?: string,
    actorEmail?: string
  ): Promise<AcademicYear> {
    const codeVo = new AcademicCode(data.code);
    const dateRangeVo = new DateRange(data.startDate, data.endDate);

    const existing = await academicYearRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Academic year code '${codeVo.getValue()}' already exists`);
    }

    const ay = await academicYearRepository.create({
      tenantId,
      name: data.name,
      code: codeVo.getValue(),
      startDate: dateRangeVo.getStart(),
      endDate: dateRangeVo.getEnd(),
      isCurrent: data.isCurrent || false,
      status: data.status || 'UPCOMING',
      settings: {},
      createdBy: actorId,
      isDeleted: false,
      isArchived: false,
    });

    if (data.isCurrent || data.status === 'ACTIVE') {
      await academicYearRepository.setCurrentAcademicYear(tenantId, ay.id);
    }

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ACADEMIC_YEAR_CREATED',
        resource: 'academic_year',
        targetId: ay.id,
        changes: { name: ay.name, code: ay.code },
      });
    }

    return ay;
  }

  public async updateAcademicYear(
    id: string,
    tenantId: string,
    updates: Partial<AcademicYear>,
    actorId?: string,
    actorEmail?: string
  ): Promise<AcademicYear> {
    await this.getAcademicYearById(id, tenantId);

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await academicYearRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Academic year code '${codeVo.getValue()}' is already used`);
      }
      updates.code = codeVo.getValue();
    }

    if (updates.startDate && updates.endDate) {
      const dr = new DateRange(updates.startDate, updates.endDate);
      updates.startDate = dr.getStart();
      updates.endDate = dr.getEnd();
    }

    const updated = await academicYearRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) {
      throw new NotFoundError('Academic Year');
    }

    if (updates.isCurrent) {
      await academicYearRepository.setCurrentAcademicYear(tenantId, id);
    }

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ACADEMIC_YEAR_UPDATED',
        resource: 'academic_year',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteAcademicYear(id: string, tenantId: string, actorId?: string): Promise<AcademicYear> {
    const deleted = await academicYearRepository.softDelete(id, tenantId, actorId);
    if (!deleted) {
      throw new NotFoundError('Academic Year');
    }
    return deleted;
  }

  public async restoreAcademicYear(id: string, tenantId: string, actorId?: string): Promise<AcademicYear> {
    const restored = await academicYearRepository.restore(id, tenantId, actorId);
    if (!restored) {
      throw new NotFoundError('Academic Year');
    }
    return restored;
  }

  public async archiveAcademicYear(id: string, tenantId: string, actorId?: string): Promise<AcademicYear> {
    const archived = await academicYearRepository.archive(id, tenantId, actorId);
    if (!archived) {
      throw new NotFoundError('Academic Year');
    }
    return archived;
  }

  public async setCurrentAcademicYear(tenantId: string, id: string, actorId?: string): Promise<AcademicYear> {
    const updated = await academicYearRepository.setCurrentAcademicYear(tenantId, id);
    if (!updated) {
      throw new NotFoundError('Academic Year');
    }
    return updated;
  }
}

export const academicYearService = new AcademicYearService();
