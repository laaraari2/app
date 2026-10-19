import { randomUUID } from 'crypto';
import { guardianRepository } from '../../infrastructure/persistence/guardian.repository';
import { relationshipRepository } from '../../infrastructure/persistence/relationship.repository';
import { studentProfileService } from './student-profile.service';
import { GuardianProfile, PersonRelationship } from '../../domain/entities/people-types';
import {
  CreateGuardianProfileDto,
  UpdateGuardianProfileDto,
  CreateRelationshipDto,
} from '../../dto/people.dto';
import {
  createGuardianProfileSchema,
  createRelationshipSchema,
} from '../../validators/people.validator';
import {
  DuplicateNationalIdError,
  PersonNotFoundError,
  InvalidRelationshipError,
  PeopleDomainError,
} from '../../domain/errors/people-domain.error';
import { peopleActivityService } from './people-activity.service';

export class GuardianService {
  public async createGuardianProfile(
    dto: CreateGuardianProfileDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<GuardianProfile> {
    const validated = createGuardianProfileSchema.parse(dto);

    // Check duplicate national ID
    const existingNational = await guardianRepository.findByNationalId(dto.tenantId, dto.nationalId);
    if (existingNational) {
      throw new DuplicateNationalIdError(dto.nationalId, 'Guardian Profile');
    }

    const guardian: GuardianProfile = {
      id: randomUUID(),
      tenantId: dto.tenantId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      nationalId: dto.nationalId,
      occupation: dto.occupation,
      employer: dto.employer,
      address: dto.address,
      userId: dto.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await guardianRepository.create(guardian);

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId: dto.tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'CREATE_GUARDIAN_PROFILE',
        resource: 'GUARDIAN',
        resourceId: created.id,
        details: { name: `${created.firstName} ${created.lastName}`, email: created.email },
      });
    }

    return created;
  }

  public async getGuardianById(tenantId: string, id: string): Promise<GuardianProfile> {
    const guardian = await guardianRepository.findById(id);
    if (!guardian || guardian.tenantId !== tenantId) {
      throw new PersonNotFoundError('Guardian Profile', id);
    }
    return guardian;
  }

  public async listGuardians(
    tenantId: string,
    filters?: { search?: string }
  ): Promise<GuardianProfile[]> {
    return guardianRepository.findAllForTenant(tenantId, filters);
  }

  public async updateGuardian(
    tenantId: string,
    id: string,
    dto: UpdateGuardianProfileDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<GuardianProfile> {
    const existing = await this.getGuardianById(tenantId, id);

    if (dto.nationalId && dto.nationalId.toLowerCase() !== existing.nationalId.toLowerCase()) {
      const dup = await guardianRepository.findByNationalId(tenantId, dto.nationalId);
      if (dup && dup.id !== id) {
        throw new DuplicateNationalIdError(dto.nationalId, 'Guardian Profile');
      }
    }

    const updated = await guardianRepository.update(id, dto);
    if (!updated) {
      throw new PersonNotFoundError('Guardian Profile', id);
    }

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'UPDATE_GUARDIAN_PROFILE',
        resource: 'GUARDIAN',
        resourceId: updated.id,
        details: { updates: dto },
      });
    }

    return updated;
  }

  public async linkGuardianToStudent(
    dto: CreateRelationshipDto,
    actor?: { userId: string; userEmail: string }
  ): Promise<PersonRelationship> {
    const validated = createRelationshipSchema.parse(dto);

    // Verify guardian & student exist in tenant
    const guardian = await this.getGuardianById(dto.tenantId, dto.guardianId);
    const student = await studentProfileService.getStudentById(dto.tenantId, dto.studentProfileId);

    // Check existing relationship
    const existingRel = await relationshipRepository.findByGuardianAndStudent(
      dto.guardianId,
      dto.studentProfileId
    );
    if (existingRel) {
      throw new InvalidRelationshipError(
        `Guardian "${guardian.firstName}" is already linked to Student "${student.firstName}".`
      );
    }

    const relationship: PersonRelationship = {
      id: randomUUID(),
      tenantId: dto.tenantId,
      guardianId: dto.guardianId,
      studentProfileId: dto.studentProfileId,
      relationType: dto.relationType,
      isPrimaryContact: dto.isPrimaryContact ?? true,
      isEmergencyContact: dto.isEmergencyContact ?? true,
      canPickup: dto.canPickup ?? true,
      isFinancialResponsible: dto.isFinancialResponsible ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const created = await relationshipRepository.create(relationship);

    if (actor) {
      await peopleActivityService.logActivity({
        tenantId: dto.tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'LINK_GUARDIAN_STUDENT',
        resource: 'RELATIONSHIP',
        resourceId: created.id,
        details: { guardianId: dto.guardianId, studentProfileId: dto.studentProfileId, relationType: dto.relationType },
      });
    }

    return created;
  }

  public async unlinkGuardianFromStudent(
    tenantId: string,
    guardianId: string,
    studentProfileId: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<boolean> {
    const rel = await relationshipRepository.findByGuardianAndStudent(guardianId, studentProfileId);
    if (!rel || rel.tenantId !== tenantId) {
      throw new InvalidRelationshipError('Relationship link not found.');
    }

    const success = await relationshipRepository.delete(rel.id);

    if (success && actor) {
      await peopleActivityService.logActivity({
        tenantId,
        userId: actor.userId,
        userEmail: actor.userEmail,
        action: 'UNLINK_GUARDIAN_STUDENT',
        resource: 'RELATIONSHIP',
        resourceId: rel.id,
        details: { guardianId, studentProfileId },
      });
    }

    return success;
  }

  public async getGuardiansForStudent(tenantId: string, studentProfileId: string): Promise<(PersonRelationship & { guardian: GuardianProfile })[]> {
    await studentProfileService.getStudentById(tenantId, studentProfileId);
    const rels = await relationshipRepository.findByStudentId(studentProfileId);

    const result = [];
    for (const rel of rels) {
      const guardian = await guardianRepository.findById(rel.guardianId);
      if (guardian && guardian.tenantId === tenantId) {
        result.push({ ...rel, guardian });
      }
    }
    return result;
  }

  public async getWardsForGuardian(tenantId: string, guardianId: string): Promise<(PersonRelationship & { student: any })[]> {
    await this.getGuardianById(tenantId, guardianId);
    const rels = await relationshipRepository.findByGuardianId(guardianId);

    const result = [];
    for (const rel of rels) {
      const student = await studentProfileService.getStudentById(tenantId, rel.studentProfileId).catch(() => null);
      if (student && student.tenantId === tenantId) {
        result.push({ ...rel, student });
      }
    }
    return result;
  }
}

export const guardianService = new GuardianService();
