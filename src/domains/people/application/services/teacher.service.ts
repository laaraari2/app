import { randomUUID } from 'crypto';
import { teacherRepository } from '../../infrastructure/persistence/teacher.repository';
import { staffService } from './staff.service';
import { TeacherProfile } from '../../domain/entities/people-types';
import { CreateTeacherProfileDto, UpdateTeacherProfileDto } from '../../dto/people.dto';
import { createTeacherProfileSchema } from '../../validators/people.validator';
import { PersonNotFoundError, PeopleDomainError } from '../../domain/errors/people-domain.error';
import { peopleActivityService } from './people-activity.service';

export class TeacherService {
  public async createTeacherProfile(
    dto: CreateTeacherProfileDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<TeacherProfile> {
    const validated = createTeacherProfileSchema.parse(dto);

    // Verify staff member exists in tenant
    const staff = await staffService.getStaffById(dto.tenantId, dto.staffMemberId);

    // Verify staff doesn't already have teacher profile
    const existingTeacher = await teacherRepository.findByStaffMemberId(dto.staffMemberId);
    if (existingTeacher) {
      throw new PeopleDomainError(
        `Staff member "${staff.firstName} ${staff.lastName}" already has an active Teacher Profile.`,
        'TEACHER_PROFILE_EXISTS'
      );
    }

    const teacher: TeacherProfile = {
      id: randomUUID(),
      tenantId: dto.tenantId,
      staffMemberId: dto.staffMemberId,
      specialization: dto.specialization,
      qualification: dto.qualification,
      subjectIds: dto.subjectIds || [],
      campusIds: dto.campusIds || (staff.campusId ? [staff.campusId] : []),
      maxWeeklyHours: dto.maxWeeklyHours || 30,
      bio: dto.bio,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await teacherRepository.create(teacher);

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId: dto.tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'CREATE_TEACHER_PROFILE',
        resource: 'TEACHER',
        resourceId: created.id,
        details: { staffMemberId: dto.staffMemberId, specialization: dto.specialization },
      });
    }

    return created;
  }

  public async getTeacherById(tenantId: string, id: string): Promise<TeacherProfile> {
    const teacher = await teacherRepository.findById(id);
    if (!teacher || teacher.tenantId !== tenantId) {
      throw new PersonNotFoundError('Teacher Profile', id);
    }
    return teacher;
  }

  public async getTeacherByStaffMemberId(staffMemberId: string): Promise<TeacherProfile | null> {
    return teacherRepository.findByStaffMemberId(staffMemberId);
  }

  public async listTeachers(
    tenantId: string,
    filters?: {
      subjectId?: string;
      campusId?: string;
      search?: string;
    }
  ): Promise<TeacherProfile[]> {
    return teacherRepository.findAllForTenant(tenantId, filters);
  }

  public async updateTeacher(
    tenantId: string,
    id: string,
    dto: UpdateTeacherProfileDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<TeacherProfile> {
    await this.getTeacherById(tenantId, id);

    const updated = await teacherRepository.update(id, dto);
    if (!updated) {
      throw new PersonNotFoundError('Teacher Profile', id);
    }

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'UPDATE_TEACHER_PROFILE',
        resource: 'TEACHER',
        resourceId: updated.id,
        details: { updates: dto },
      });
    }

    return updated;
  }

  public async softDeleteTeacher(
    tenantId: string,
    id: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<boolean> {
    await this.getTeacherById(tenantId, id);
    const success = await teacherRepository.softDelete(id);

    if (success && actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'DELETE_TEACHER_PROFILE',
        resource: 'TEACHER',
        resourceId: id,
      });
    }

    return success;
  }
}

export const teacherService = new TeacherService();
