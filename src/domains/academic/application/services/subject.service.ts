import { subjectRepository } from '../../infrastructure/persistence/subject.repository';
import { subjectCategoryRepository } from '../../infrastructure/persistence/subject-category.repository';
import { Subject, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateSubjectDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { auditService } from '../../../../services/audit.service';

export class SubjectService {
  public async getPaginatedSubjects(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<Subject>> {
    return subjectRepository.findPaginated(tenantId, options);
  }

  public async getSubjectById(id: string, tenantId: string): Promise<Subject> {
    const subject = await subjectRepository.findById(id, tenantId);
    if (!subject || subject.isDeleted) {
      throw new NotFoundError('Subject');
    }
    return subject;
  }

  public async getSubjectsByCategory(categoryId: string, tenantId: string): Promise<Subject[]> {
    return subjectRepository.findByCategory(categoryId, tenantId);
  }

  public async createSubject(
    tenantId: string,
    dto: CreateSubjectDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<Subject> {
    const category = await subjectCategoryRepository.findById(dto.categoryId, tenantId);
    if (!category || category.isDeleted) {
      throw new NotFoundError('Subject Category');
    }

    const codeVo = new AcademicCode(dto.code);
    const existing = await subjectRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Subject code '${codeVo.getValue()}' already exists`);
    }

    const subject = await subjectRepository.create({
      tenantId,
      categoryId: dto.categoryId,
      code: codeVo.getValue(),
      name: dto.name,
      description: dto.description,
      credits: dto.credits || 1,
      weeklyHours: dto.weeklyHours || 2,
      passesThreshold: dto.passesThreshold || 10,
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
        action: 'SUBJECT_CREATED',
        resource: 'subject',
        targetId: subject.id,
        changes: { name: subject.name, code: subject.code, categoryId: subject.categoryId },
      });
    }

    return subject;
  }

  public async updateSubject(
    id: string,
    tenantId: string,
    updates: Partial<Subject>,
    actorId?: string,
    actorEmail?: string
  ): Promise<Subject> {
    await this.getSubjectById(id, tenantId);

    if (updates.categoryId) {
      const category = await subjectCategoryRepository.findById(updates.categoryId, tenantId);
      if (!category || category.isDeleted) throw new NotFoundError('Subject Category');
    }

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await subjectRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Subject code '${codeVo.getValue()}' is already taken`);
      }
      updates.code = codeVo.getValue();
    }

    const updated = await subjectRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Subject');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SUBJECT_UPDATED',
        resource: 'subject',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteSubject(id: string, tenantId: string, actorId?: string): Promise<Subject> {
    const deleted = await subjectRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Subject');
    return deleted;
  }

  public async restoreSubject(id: string, tenantId: string, actorId?: string): Promise<Subject> {
    const restored = await subjectRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Subject');
    return restored;
  }

  public async archiveSubject(id: string, tenantId: string, actorId?: string): Promise<Subject> {
    const archived = await subjectRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Subject');
    return archived;
  }
}

export const subjectService = new SubjectService();
