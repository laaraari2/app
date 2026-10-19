import { gradeLevelRepository } from '../../infrastructure/persistence/grade-level.repository';
import { educationalStageRepository } from '../../infrastructure/persistence/educational-stage.repository';
import { GradeLevel, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateGradeLevelDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { auditService } from '../../../../services/audit.service';

export class GradeLevelService {
  public async getPaginatedGradeLevels(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<GradeLevel>> {
    return gradeLevelRepository.findPaginated(tenantId, options);
  }

  public async getGradeLevelById(id: string, tenantId: string): Promise<GradeLevel> {
    const grade = await gradeLevelRepository.findById(id, tenantId);
    if (!grade || grade.isDeleted) {
      throw new NotFoundError('Grade Level');
    }
    return grade;
  }

  public async getGradesByStage(stageId: string, tenantId: string): Promise<GradeLevel[]> {
    return gradeLevelRepository.findByStage(stageId, tenantId);
  }

  public async createGradeLevel(
    tenantId: string,
    dto: CreateGradeLevelDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<GradeLevel> {
    // Validate Stage belongs to tenant
    const stage = await educationalStageRepository.findById(dto.stageId, tenantId);
    if (!stage || stage.isDeleted) {
      throw new NotFoundError('Educational Stage');
    }

    const codeVo = new AcademicCode(dto.code);
    const existing = await gradeLevelRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Grade Level code '${codeVo.getValue()}' already exists`);
    }

    const grade = await gradeLevelRepository.create({
      tenantId,
      stageId: dto.stageId,
      code: codeVo.getValue(),
      name: dto.name,
      sequence: dto.sequence,
      minAge: dto.minAge,
      passingGrade: dto.passingGrade,
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
        action: 'GRADE_LEVEL_CREATED',
        resource: 'grade_level',
        targetId: grade.id,
        changes: { name: grade.name, code: grade.code, stageId: grade.stageId },
      });
    }

    return grade;
  }

  public async updateGradeLevel(
    id: string,
    tenantId: string,
    updates: Partial<GradeLevel>,
    actorId?: string,
    actorEmail?: string
  ): Promise<GradeLevel> {
    await this.getGradeLevelById(id, tenantId);

    if (updates.stageId) {
      const stage = await educationalStageRepository.findById(updates.stageId, tenantId);
      if (!stage || stage.isDeleted) {
        throw new NotFoundError('Educational Stage');
      }
    }

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await gradeLevelRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Grade level code '${codeVo.getValue()}' is already used`);
      }
      updates.code = codeVo.getValue();
    }

    const updated = await gradeLevelRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Grade Level');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'GRADE_LEVEL_UPDATED',
        resource: 'grade_level',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteGradeLevel(id: string, tenantId: string, actorId?: string): Promise<GradeLevel> {
    const deleted = await gradeLevelRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Grade Level');
    return deleted;
  }

  public async restoreGradeLevel(id: string, tenantId: string, actorId?: string): Promise<GradeLevel> {
    const restored = await gradeLevelRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Grade Level');
    return restored;
  }

  public async archiveGradeLevel(id: string, tenantId: string, actorId?: string): Promise<GradeLevel> {
    const archived = await gradeLevelRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Grade Level');
    return archived;
  }
}

export const gradeLevelService = new GradeLevelService();
