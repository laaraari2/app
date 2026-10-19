import { educationalStageRepository } from '../../infrastructure/persistence/educational-stage.repository';
import { EducationalStage, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateEducationalStageDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { auditService } from '../../../../services/audit.service';

export class EducationalStageService {
  public async getPaginatedStages(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<EducationalStage>> {
    return educationalStageRepository.findPaginated(tenantId, options);
  }

  public async getStageById(id: string, tenantId: string): Promise<EducationalStage> {
    const stage = await educationalStageRepository.findById(id, tenantId);
    if (!stage || stage.isDeleted) {
      throw new NotFoundError('Educational Stage');
    }
    return stage;
  }

  public async createStage(
    tenantId: string,
    dto: CreateEducationalStageDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<EducationalStage> {
    const codeVo = new AcademicCode(dto.code);

    const existing = await educationalStageRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Educational Stage code '${codeVo.getValue()}' already exists`);
    }

    const stage = await educationalStageRepository.create({
      tenantId,
      code: codeVo.getValue(),
      name: dto.name,
      description: dto.description,
      minAge: dto.minAge,
      maxAge: dto.maxAge,
      displayOrder: dto.displayOrder || 1,
      status: 'ACTIVE',
      createdBy: actorId,
      isDeleted: false,
      isArchived: false,
    });

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'EDUCATIONAL_STAGE_CREATED',
        resource: 'educational_stage',
        targetId: stage.id,
        changes: { name: stage.name, code: stage.code },
      });
    }

    return stage;
  }

  public async updateStage(
    id: string,
    tenantId: string,
    updates: Partial<EducationalStage>,
    actorId?: string,
    actorEmail?: string
  ): Promise<EducationalStage> {
    await this.getStageById(id, tenantId);

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await educationalStageRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Stage code '${codeVo.getValue()}' is already used`);
      }
      updates.code = codeVo.getValue();
    }

    const updated = await educationalStageRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Educational Stage');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'EDUCATIONAL_STAGE_UPDATED',
        resource: 'educational_stage',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteStage(id: string, tenantId: string, actorId?: string): Promise<EducationalStage> {
    const deleted = await educationalStageRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Educational Stage');
    return deleted;
  }

  public async restoreStage(id: string, tenantId: string, actorId?: string): Promise<EducationalStage> {
    const restored = await educationalStageRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Educational Stage');
    return restored;
  }

  public async archiveStage(id: string, tenantId: string, actorId?: string): Promise<EducationalStage> {
    const archived = await educationalStageRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Educational Stage');
    return archived;
  }
}

export const educationalStageService = new EducationalStageService();
