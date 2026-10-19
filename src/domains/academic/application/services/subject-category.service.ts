import { subjectCategoryRepository } from '../../infrastructure/persistence/subject-category.repository';
import { SubjectCategory, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateSubjectCategoryDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { auditService } from '../../../../services/audit.service';

export class SubjectCategoryService {
  public async getPaginatedCategories(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<SubjectCategory>> {
    return subjectCategoryRepository.findPaginated(tenantId, options);
  }

  public async getCategoryById(id: string, tenantId: string): Promise<SubjectCategory> {
    const cat = await subjectCategoryRepository.findById(id, tenantId);
    if (!cat || cat.isDeleted) {
      throw new NotFoundError('Subject Category');
    }
    return cat;
  }

  public async createCategory(
    tenantId: string,
    dto: CreateSubjectCategoryDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<SubjectCategory> {
    const codeVo = new AcademicCode(dto.code);

    const existing = await subjectCategoryRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Subject Category code '${codeVo.getValue()}' already exists`);
    }

    const cat = await subjectCategoryRepository.create({
      tenantId,
      code: codeVo.getValue(),
      name: dto.name,
      description: dto.description,
      colorCode: dto.colorCode || '#3B82F6',
      createdBy: actorId,
      isDeleted: false,
      isArchived: false,
    });

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SUBJECT_CATEGORY_CREATED',
        resource: 'subject_category',
        targetId: cat.id,
        changes: { name: cat.name, code: cat.code },
      });
    }

    return cat;
  }

  public async updateCategory(
    id: string,
    tenantId: string,
    updates: Partial<SubjectCategory>,
    actorId?: string,
    actorEmail?: string
  ): Promise<SubjectCategory> {
    await this.getCategoryById(id, tenantId);

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await subjectCategoryRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Subject category code '${codeVo.getValue()}' is already taken`);
      }
      updates.code = codeVo.getValue();
    }

    const updated = await subjectCategoryRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Subject Category');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SUBJECT_CATEGORY_UPDATED',
        resource: 'subject_category',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteCategory(id: string, tenantId: string, actorId?: string): Promise<SubjectCategory> {
    const deleted = await subjectCategoryRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Subject Category');
    return deleted;
  }

  public async restoreCategory(id: string, tenantId: string, actorId?: string): Promise<SubjectCategory> {
    const restored = await subjectCategoryRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Subject Category');
    return restored;
  }

  public async archiveCategory(id: string, tenantId: string, actorId?: string): Promise<SubjectCategory> {
    const archived = await subjectCategoryRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Subject Category');
    return archived;
  }
}

export const subjectCategoryService = new SubjectCategoryService();
