import { curriculumRepository } from '../../infrastructure/persistence/curriculum.repository';
import { gradeLevelRepository } from '../../infrastructure/persistence/grade-level.repository';
import { subjectRepository } from '../../infrastructure/persistence/subject.repository';
import { Curriculum, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateCurriculumDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';

export class CurriculumService {
  public async getPaginatedCurriculums(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<Curriculum>> {
    return curriculumRepository.findPaginated(tenantId, options);
  }

  public async getCurriculumById(id: string, tenantId: string): Promise<Curriculum> {
    const curr = await curriculumRepository.findById(id, tenantId);
    if (!curr || curr.isDeleted) {
      throw new NotFoundError('Curriculum entry');
    }
    return curr;
  }

  public async getCurriculumByGrade(gradeId: string, tenantId: string): Promise<Curriculum[]> {
    return curriculumRepository.findByGrade(gradeId, tenantId);
  }

  public async createCurriculum(
    tenantId: string,
    dto: CreateCurriculumDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<Curriculum> {
    const grade = await gradeLevelRepository.findById(dto.gradeId, tenantId);
    if (!grade || grade.isDeleted) throw new NotFoundError('Grade Level');

    const subject = await subjectRepository.findById(dto.subjectId, tenantId);
    if (!subject || subject.isDeleted) throw new NotFoundError('Subject');

    const existing = await curriculumRepository.findByGradeAndSubject(dto.gradeId, dto.subjectId, tenantId);
    if (existing) {
      throw new ConflictError(`Curriculum for grade '${grade.name}' and subject '${subject.name}' already exists`);
    }

    const curriculum = await curriculumRepository.create({
      tenantId,
      gradeId: dto.gradeId,
      subjectId: dto.subjectId,
      academicYearId: dto.academicYearId,
      weeklyHours: dto.weeklyHours,
      coefficient: dto.coefficient,
      evaluationType: dto.evaluationType || 'EXAM',
      learningObjectives: dto.learningObjectives || [],
      syllabusUrl: dto.syllabusUrl,
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
        action: 'CURRICULUM_CREATED',
        resource: 'curriculum',
        targetId: curriculum.id,
        changes: { gradeId: curriculum.gradeId, subjectId: curriculum.subjectId, coefficient: curriculum.coefficient },
      });
    }

    return curriculum;
  }

  public async updateCurriculum(
    id: string,
    tenantId: string,
    updates: Partial<Curriculum>,
    actorId?: string,
    actorEmail?: string
  ): Promise<Curriculum> {
    await this.getCurriculumById(id, tenantId);

    const updated = await curriculumRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Curriculum entry');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'CURRICULUM_UPDATED',
        resource: 'curriculum',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteCurriculum(id: string, tenantId: string, actorId?: string): Promise<Curriculum> {
    const deleted = await curriculumRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Curriculum entry');
    return deleted;
  }

  public async restoreCurriculum(id: string, tenantId: string, actorId?: string): Promise<Curriculum> {
    const restored = await curriculumRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Curriculum entry');
    return restored;
  }

  public async archiveCurriculum(id: string, tenantId: string, actorId?: string): Promise<Curriculum> {
    const archived = await curriculumRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Curriculum entry');
    return archived;
  }
}

export const curriculumService = new CurriculumService();
