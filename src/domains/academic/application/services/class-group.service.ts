import { classGroupRepository } from '../../infrastructure/persistence/class-group.repository';
import { gradeLevelRepository } from '../../infrastructure/persistence/grade-level.repository';
import { academicYearRepository } from '../../infrastructure/persistence/academic-year.repository';
import { ClassGroup, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateClassGroupDto } from '../../dto/academic.dto';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { AcademicCode } from '../../domain/value-objects/academic-code.vo';
import { auditService } from '../../../../services/audit.service';

export class ClassGroupService {
  public async getPaginatedClassGroups(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<ClassGroup>> {
    return classGroupRepository.findPaginated(tenantId, options);
  }

  public async getClassGroupById(id: string, tenantId: string): Promise<ClassGroup> {
    const cg = await classGroupRepository.findById(id, tenantId);
    if (!cg || cg.isDeleted) {
      throw new NotFoundError('Class Group');
    }
    return cg;
  }

  public async getClassGroupsByGrade(gradeId: string, tenantId: string): Promise<ClassGroup[]> {
    return classGroupRepository.findByGrade(gradeId, tenantId);
  }

  public async createClassGroup(
    tenantId: string,
    dto: CreateClassGroupDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<ClassGroup> {
    // Validate Grade Level
    const grade = await gradeLevelRepository.findById(dto.gradeId, tenantId);
    if (!grade || grade.isDeleted) {
      throw new NotFoundError('Grade Level');
    }

    // Validate Academic Year
    const ay = await academicYearRepository.findById(dto.academicYearId, tenantId);
    if (!ay || ay.isDeleted) {
      throw new NotFoundError('Academic Year');
    }

    const codeVo = new AcademicCode(dto.code);
    const existing = await classGroupRepository.findByCode(codeVo.getValue(), tenantId);
    if (existing) {
      throw new ConflictError(`Class Group code '${codeVo.getValue()}' already exists`);
    }

    const classGroup = await classGroupRepository.create({
      tenantId,
      gradeId: dto.gradeId,
      academicYearId: dto.academicYearId,
      campusId: dto.campusId,
      code: codeVo.getValue(),
      name: dto.name,
      roomAssignmentId: dto.roomAssignmentId,
      maxCapacity: dto.maxCapacity,
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
        action: 'CLASS_GROUP_CREATED',
        resource: 'class_group',
        targetId: classGroup.id,
        changes: { name: classGroup.name, code: classGroup.code, gradeId: classGroup.gradeId },
      });
    }

    return classGroup;
  }

  public async updateClassGroup(
    id: string,
    tenantId: string,
    updates: Partial<ClassGroup>,
    actorId?: string,
    actorEmail?: string
  ): Promise<ClassGroup> {
    await this.getClassGroupById(id, tenantId);

    if (updates.gradeId) {
      const grade = await gradeLevelRepository.findById(updates.gradeId, tenantId);
      if (!grade || grade.isDeleted) throw new NotFoundError('Grade Level');
    }

    if (updates.code) {
      const codeVo = new AcademicCode(updates.code);
      const existing = await classGroupRepository.findByCode(codeVo.getValue(), tenantId);
      if (existing && existing.id !== id) {
        throw new ConflictError(`Class Group code '${codeVo.getValue()}' is already taken`);
      }
      updates.code = codeVo.getValue();
    }

    const updated = await classGroupRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Class Group');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'CLASS_GROUP_UPDATED',
        resource: 'class_group',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteClassGroup(id: string, tenantId: string, actorId?: string): Promise<ClassGroup> {
    const deleted = await classGroupRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Class Group');
    return deleted;
  }

  public async restoreClassGroup(id: string, tenantId: string, actorId?: string): Promise<ClassGroup> {
    const restored = await classGroupRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Class Group');
    return restored;
  }

  public async archiveClassGroup(id: string, tenantId: string, actorId?: string): Promise<ClassGroup> {
    const archived = await classGroupRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Class Group');
    return archived;
  }
}

export const classGroupService = new ClassGroupService();
