import { academicTermRepository } from '../../infrastructure/persistence/academic-term.repository';
import { AcademicTerm, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateAcademicTermDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { DateRange } from '../../domain/value-objects/date-range.vo';
import { auditService } from '../../../../services/audit.service';

export class AcademicTermService {
  public async getPaginatedTerms(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<AcademicTerm>> {
    return academicTermRepository.findPaginated(tenantId, options);
  }

  public async getTermById(id: string, tenantId: string): Promise<AcademicTerm> {
    const term = await academicTermRepository.findById(id, tenantId);
    if (!term || term.isDeleted) {
      throw new NotFoundError('Academic Term');
    }
    return term;
  }

  public async getTermsByAcademicYear(academicYearId: string, tenantId: string): Promise<AcademicTerm[]> {
    return academicTermRepository.findByAcademicYear(academicYearId, tenantId);
  }

  public async createTerm(
    tenantId: string,
    dto: CreateAcademicTermDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<AcademicTerm> {
    const codeVo = new AcademicCode(dto.code);
    const dateRange = new DateRange(dto.startDate, dto.endDate);

    const existing = await academicTermRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Term code '${codeVo.getValue()}' already exists`);
    }

    const term = await academicTermRepository.create({
      tenantId,
      academicYearId: dto.academicYearId,
      name: dto.name,
      code: codeVo.getValue(),
      type: dto.type,
      sequence: dto.sequence,
      startDate: dateRange.getStart(),
      endDate: dateRange.getEnd(),
      weightPercentage: dto.weightPercentage,
      status: dto.status || 'UPCOMING',
      createdBy: actorId,
      isDeleted: false,
      isArchived: false,
    });

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ACADEMIC_TERM_CREATED',
        resource: 'academic_term',
        targetId: term.id,
        changes: { name: term.name, code: term.code },
      });
    }

    return term;
  }

  public async updateTerm(
    id: string,
    tenantId: string,
    updates: Partial<AcademicTerm>,
    actorId?: string,
    actorEmail?: string
  ): Promise<AcademicTerm> {
    await this.getTermById(id, tenantId);

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await academicTermRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Term code '${codeVo.getValue()}' is already taken`);
      }
      updates.code = codeVo.getValue();
    }

    if (updates.startDate && updates.endDate) {
      const dr = new DateRange(updates.startDate, updates.endDate);
      updates.startDate = dr.getStart();
      updates.endDate = dr.getEnd();
    }

    const updated = await academicTermRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) {
      throw new NotFoundError('Academic Term');
    }

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ACADEMIC_TERM_UPDATED',
        resource: 'academic_term',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteTerm(id: string, tenantId: string, actorId?: string): Promise<AcademicTerm> {
    const deleted = await academicTermRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Academic Term');
    return deleted;
  }

  public async restoreTerm(id: string, tenantId: string, actorId?: string): Promise<AcademicTerm> {
    const restored = await academicTermRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Academic Term');
    return restored;
  }

  public async archiveTerm(id: string, tenantId: string, actorId?: string): Promise<AcademicTerm> {
    const archived = await academicTermRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Academic Term');
    return archived;
  }
}

export const academicTermService = new AcademicTermService();
