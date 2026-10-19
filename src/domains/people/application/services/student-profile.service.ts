import { randomUUID } from 'crypto';
import { studentProfileRepository } from '../../infrastructure/persistence/student-profile.repository';
import { StudentProfile } from '../../domain/entities/people-types';
import { CreateStudentProfileDto, UpdateStudentProfileDto, BulkActionDto } from '../../dto/people.dto';
import { createStudentProfileSchema } from '../../validators/people.validator';
import {
  DuplicateNationalIdError,
  PersonNotFoundError,
  PeopleDomainError,
} from '../../domain/errors/people-domain.error';
import { peopleActivityService } from './people-activity.service';

export class StudentProfileService {
  private static sequenceCounter = 1;

  private generateStudentNumber(): string {
    const year = new Date().getFullYear();
    const seq = String(StudentProfileService.sequenceCounter++).padStart(5, '0');
    return `STU-${year}-${seq}`;
  }

  public async createStudentProfile(
    dto: CreateStudentProfileDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<StudentProfile> {
    const validated = createStudentProfileSchema.parse(dto);

    // Check duplicate national ID
    const existingNational = await studentProfileRepository.findByNationalId(dto.tenantId, dto.nationalId);
    if (existingNational) {
      throw new DuplicateNationalIdError(dto.nationalId, 'Student Profile');
    }

    const studentNumber = dto.studentNumber || this.generateStudentNumber();

    const existingNumber = await studentProfileRepository.findByStudentNumber(dto.tenantId, studentNumber);
    if (existingNumber) {
      throw new PeopleDomainError(`Student number "${studentNumber}" already exists.`, 'DUPLICATE_STUDENT_NUMBER');
    }

    const student: StudentProfile = {
      id: randomUUID(),
      tenantId: dto.tenantId,
      campusId: dto.campusId,
      enrolledStudentId: dto.enrolledStudentId,
      studentNumber,
      firstName: dto.firstName,
      lastName: dto.lastName,
      nationalId: dto.nationalId,
      dateOfBirth: new Date(dto.dateOfBirth),
      gender: dto.gender,
      bloodGroup: dto.bloodGroup,
      medicalNotes: dto.medicalNotes,
      dietaryRestrictions: dto.dietaryRestrictions,
      educationalStageId: dto.educationalStageId,
      gradeLevelId: dto.gradeLevelId,
      classGroupId: dto.classGroupId,
      status: dto.status || 'ACTIVE',
      joinDate: new Date(dto.joinDate),
      address: dto.address,
      emergencyContact: dto.emergencyContact,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await studentProfileRepository.create(student);

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId: dto.tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'CREATE_STUDENT_PROFILE',
        resource: 'STUDENT',
        resourceId: created.id,
        details: { studentNumber: created.studentNumber, name: `${created.firstName} ${created.lastName}` },
      });
    }

    return created;
  }

  public async getStudentById(tenantId: string, id: string): Promise<StudentProfile> {
    const student = await studentProfileRepository.findById(id);
    if (!student || student.tenantId !== tenantId) {
      throw new PersonNotFoundError('Student Profile', id);
    }
    return student;
  }

  public async listStudents(
    tenantId: string,
    filters?: {
      campusId?: string;
      gradeLevelId?: string;
      classGroupId?: string;
      status?: string;
      search?: string;
    }
  ): Promise<StudentProfile[]> {
    return studentProfileRepository.findAllForTenant(tenantId, filters);
  }

  public async updateStudent(
    tenantId: string,
    id: string,
    dto: UpdateStudentProfileDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<StudentProfile> {
    const existing = await this.getStudentById(tenantId, id);

    if (dto.nationalId && dto.nationalId.toLowerCase() !== existing.nationalId.toLowerCase()) {
      const dup = await studentProfileRepository.findByNationalId(tenantId, dto.nationalId);
      if (dup && dup.id !== id) {
        throw new DuplicateNationalIdError(dto.nationalId, 'Student Profile');
      }
    }

    const updated = await studentProfileRepository.update(id, dto);
    if (!updated) {
      throw new PersonNotFoundError('Student Profile', id);
    }

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'UPDATE_STUDENT_PROFILE',
        resource: 'STUDENT',
        resourceId: updated.id,
        details: { updates: dto },
      });
    }

    return updated;
  }

  public async softDeleteStudent(
    tenantId: string,
    id: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<boolean> {
    await this.getStudentById(tenantId, id);
    const success = await studentProfileRepository.softDelete(id);

    if (success && actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'SOFT_DELETE_STUDENT',
        resource: 'STUDENT',
        resourceId: id,
      });
    }

    return success;
  }

  public async restoreStudent(
    tenantId: string,
    id: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<boolean> {
    const existing = await studentProfileRepository.findById(id);
    if (!existing || existing.tenantId !== tenantId) {
      throw new PersonNotFoundError('Student Profile', id);
    }

    const success = await studentProfileRepository.restore(id);

    if (success && actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'RESTORE_STUDENT',
        resource: 'STUDENT',
        resourceId: id,
      });
    }

    return success;
  }

  public async bulkAction(
    tenantId: string,
    dto: BulkActionDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<{ affected: number }> {
    let affected = 0;
    for (const id of dto.ids) {
      try {
        if (dto.action === 'DELETE') {
          if (await this.softDeleteStudent(tenantId, id, actor)) affected++;
        } else if (dto.action === 'RESTORE') {
          if (await this.restoreStudent(tenantId, id, actor)) affected++;
        } else if (dto.action === 'ACTIVATE') {
          await this.updateStudent(tenantId, id, { status: 'ACTIVE' }, actor);
          affected++;
        } else if (dto.action === 'SUSPEND') {
          await this.updateStudent(tenantId, id, { status: 'SUSPENDED' }, actor);
          affected++;
        }
      } catch {
        // Continue batch execution
      }
    }
    return { affected };
  }
}

export const studentProfileService = new StudentProfileService();
