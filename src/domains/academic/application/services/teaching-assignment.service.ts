import { teachingAssignmentRepository } from '../../infrastructure/persistence/teaching-assignment.repository';
import { classGroupRepository } from '../../infrastructure/persistence/class-group.repository';
import { subjectRepository } from '../../infrastructure/persistence/subject.repository';
import { academicYearRepository } from '../../infrastructure/persistence/academic-year.repository';
import { TeachingAssignment, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateTeachingAssignmentDto } from '../../dto/academic.dto';
import { NotFoundError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';

export class TeachingAssignmentService {
  public async getPaginatedAssignments(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<TeachingAssignment>> {
    return teachingAssignmentRepository.findPaginated(tenantId, options);
  }

  public async getAssignmentById(id: string, tenantId: string): Promise<TeachingAssignment> {
    const ta = await teachingAssignmentRepository.findById(id, tenantId);
    if (!ta || ta.isDeleted) {
      throw new NotFoundError('Teaching Assignment');
    }
    return ta;
  }

  public async createAssignment(
    tenantId: string,
    dto: CreateTeachingAssignmentDto,
    actorId?: string,
    actorEmail?: string
  ): Promise<TeachingAssignment> {
    const classGroup = await classGroupRepository.findById(dto.classGroupId, tenantId);
    if (!classGroup || classGroup.isDeleted) throw new NotFoundError('Class Group');

    const subject = await subjectRepository.findById(dto.subjectId, tenantId);
    if (!subject || subject.isDeleted) throw new NotFoundError('Subject');

    const ay = await academicYearRepository.findById(dto.academicYearId, tenantId);
    if (!ay || ay.isDeleted) throw new NotFoundError('Academic Year');

    const ta = await teachingAssignmentRepository.create({
      tenantId,
      academicYearId: dto.academicYearId,
      classGroupId: dto.classGroupId,
      subjectId: dto.subjectId,
      teacherId: dto.teacherId,
      teacherName: dto.teacherName || `Teacher (${dto.teacherId})`,
      termId: dto.termId,
      weeklyHours: dto.weeklyHours,
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
        action: 'TEACHING_ASSIGNMENT_CREATED',
        resource: 'teaching_assignment',
        targetId: ta.id,
        changes: { classGroupId: ta.classGroupId, subjectId: ta.subjectId, teacherId: ta.teacherId },
      });
    }

    return ta;
  }

  public async updateAssignment(
    id: string,
    tenantId: string,
    updates: Partial<TeachingAssignment>,
    actorId?: string,
    actorEmail?: string
  ): Promise<TeachingAssignment> {
    await this.getAssignmentById(id, tenantId);

    const updated = await teachingAssignmentRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Teaching Assignment');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'TEACHING_ASSIGNMENT_UPDATED',
        resource: 'teaching_assignment',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteAssignment(id: string, tenantId: string, actorId?: string): Promise<TeachingAssignment> {
    const deleted = await teachingAssignmentRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Teaching Assignment');
    return deleted;
  }

  public async restoreAssignment(id: string, tenantId: string, actorId?: string): Promise<TeachingAssignment> {
    const restored = await teachingAssignmentRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Teaching Assignment');
    return restored;
  }

  public async archiveAssignment(id: string, tenantId: string, actorId?: string): Promise<TeachingAssignment> {
    const archived = await teachingAssignmentRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Teaching Assignment');
    return archived;
  }
}

export const teachingAssignmentService = new TeachingAssignmentService();
