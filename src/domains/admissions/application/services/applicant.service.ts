import { applicantRepository } from '../../infrastructure/persistence/applicant.repository';
import { Applicant, PaginatedResult, PaginationAndFilterOptions, ApplicantStatus, GuardianInfo } from '../../domain/entities/admissions-types';
import { CreateApplicantDto, UpdateApplicantDto, BulkApplicantActionDto } from '../../dto/admissions.dto';
import { NotFoundError, ConflictError, ValidationError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';
import { admissionsNotificationService } from './admissions-notification.service';
import { createApplicantSchema } from '../../validators/admissions.validator';
import { ApplicantStatusValueObject } from '../../domain/value-objects/applicant-status.vo';
import { GuardianInfoValueObject } from '../../domain/value-objects/guardian-info.vo';

export class ApplicantService {
  public async getPaginatedApplicants(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<Applicant>> {
    return applicantRepository.getPaginated(tenantId, options);
  }

  public async getApplicantById(id: string, tenantId: string): Promise<Applicant> {
    const applicant = await applicantRepository.findById(id, tenantId);
    if (!applicant || applicant.isDeleted) {
      throw new NotFoundError(`Applicant with ID '${id}' not found.`);
    }
    return applicant;
  }

  public async createApplicant(
    tenantId: string,
    dto: CreateApplicantDto,
    userId?: string,
    userEmail?: string
  ): Promise<Applicant> {
    const validated = createApplicantSchema.parse(dto);

    // Validate Parent/Guardian information via Value Object
    const validatedGuardians: GuardianInfo[] = GuardianInfoValueObject.validateList(
      validated.guardians.map(g => ({
        ...g,
        id: `guard_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      }))
    );

    // Generate unique application number e.g. APP-2025-00001
    const seq = await applicantRepository.getNextApplicationSequence(tenantId, validated.academicYearId);
    const yearPart = new Date().getFullYear().toString();
    const appNum = `APP-${yearPart}-${String(seq).padStart(5, '0')}`;

    const applicant: Applicant = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      campaignId: validated.campaignId,
      periodId: validated.periodId,
      academicYearId: validated.academicYearId,
      targetGradeId: validated.targetGradeId,
      applicationNumber: appNum,
      firstName: validated.firstName.trim(),
      lastName: validated.lastName.trim(),
      dateOfBirth: new Date(validated.dateOfBirth),
      gender: validated.gender,
      nationality: validated.nationality.trim(),
      nationalId: validated.nationalId?.trim(),
      email: validated.email?.trim(),
      phone: validated.phone?.trim(),
      currentSchool: validated.currentSchool?.trim(),
      status: 'SUBMITTED', // Default upon creation
      guardians: validatedGuardians,
      notes: validated.notes,
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
    };

    const saved = await applicantRepository.save(applicant);

    // Audit log
    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_CREATE',
      resource: 'admissions:applicant',
      resourceId: saved.id,
      details: { applicationNumber: saved.applicationNumber, candidate: `${saved.firstName} ${saved.lastName}` },
    });

    // Send Notification
    const primaryGuardian = saved.guardians.find(g => g.isPrimary) || saved.guardians[0];
    await admissionsNotificationService.emitNotification(
      tenantId,
      'APPLICATION_SUBMITTED',
      'Candidature reçue avec succès',
      `Votre candidature pour ${saved.firstName} ${saved.lastName} sous le N° ${saved.applicationNumber} a bien été enregistrée.`,
      primaryGuardian?.email || saved.email,
      primaryGuardian?.phone || saved.phone,
      { applicantId: saved.id, applicationNumber: saved.applicationNumber }
    );

    return saved;
  }

  public async updateApplicant(
    id: string,
    tenantId: string,
    dto: UpdateApplicantDto,
    userId?: string,
    userEmail?: string
  ): Promise<Applicant> {
    const applicant = await this.getApplicantById(id, tenantId);

    if (dto.status && dto.status !== applicant.status) {
      await this.changeApplicantStatus(id, tenantId, dto.status, userId, userEmail);
    }

    if (dto.firstName !== undefined) applicant.firstName = dto.firstName.trim();
    if (dto.lastName !== undefined) applicant.lastName = dto.lastName.trim();
    if (dto.dateOfBirth !== undefined) applicant.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.gender !== undefined) applicant.gender = dto.gender;
    if (dto.nationality !== undefined) applicant.nationality = dto.nationality.trim();
    if (dto.nationalId !== undefined) applicant.nationalId = dto.nationalId.trim();
    if (dto.email !== undefined) applicant.email = dto.email.trim();
    if (dto.phone !== undefined) applicant.phone = dto.phone.trim();
    if (dto.currentSchool !== undefined) applicant.currentSchool = dto.currentSchool.trim();
    if (dto.targetGradeId !== undefined) applicant.targetGradeId = dto.targetGradeId;
    if (dto.notes !== undefined) applicant.notes = dto.notes;

    if (dto.guardians !== undefined) {
      applicant.guardians = GuardianInfoValueObject.validateList(dto.guardians);
    }

    applicant.updatedAt = new Date();
    applicant.updatedBy = userId;

    const updated = await applicantRepository.save(applicant);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_UPDATE',
      resource: 'admissions:applicant',
      resourceId: updated.id,
    });

    return updated;
  }

  public async changeApplicantStatus(
    id: string,
    tenantId: string,
    targetStatus: ApplicantStatus,
    userId?: string,
    userEmail?: string
  ): Promise<Applicant> {
    const applicant = await this.getApplicantById(id, tenantId);

    const statusVo = new ApplicantStatusValueObject(applicant.status);
    statusVo.validateTransition(targetStatus);

    const oldStatus = applicant.status;
    applicant.status = targetStatus;
    applicant.updatedAt = new Date();
    applicant.updatedBy = userId;

    const saved = await applicantRepository.save(applicant);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_STATUS_CHANGE',
      resource: 'admissions:applicant',
      resourceId: id,
      details: { from: oldStatus, to: targetStatus },
    });

    return saved;
  }

  public async softDeleteApplicant(
    id: string,
    tenantId: string,
    userId?: string,
    userEmail?: string
  ): Promise<void> {
    const applicant = await this.getApplicantById(id, tenantId);
    applicant.isDeleted = true;
    applicant.deletedAt = new Date();
    applicant.deletedBy = userId;
    await applicantRepository.save(applicant);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_DELETE',
      resource: 'admissions:applicant',
      resourceId: id,
    });
  }

  public async restoreApplicant(
    id: string,
    tenantId: string,
    userId?: string,
    userEmail?: string
  ): Promise<Applicant> {
    const applicant = await applicantRepository.findById(id, tenantId);
    if (!applicant) {
      throw new NotFoundError(`Applicant with ID '${id}' not found.`);
    }

    applicant.isDeleted = false;
    applicant.deletedAt = undefined;
    applicant.deletedBy = undefined;
    applicant.updatedAt = new Date();

    const restored = await applicantRepository.save(applicant);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_RESTORE',
      resource: 'admissions:applicant',
      resourceId: id,
    });

    return restored;
  }

  public async executeBulkAction(
    tenantId: string,
    dto: BulkApplicantActionDto,
    userId?: string,
    userEmail?: string
  ): Promise<{ successCount: number; failedCount: number }> {
    let successCount = 0;
    let failedCount = 0;

    for (const id of dto.ids) {
      try {
        if (dto.action === 'delete') {
          await this.softDeleteApplicant(id, tenantId, userId, userEmail);
        } else if (dto.action === 'restore') {
          await this.restoreApplicant(id, tenantId, userId, userEmail);
        } else if (dto.action === 'update_status' && dto.targetStatus) {
          await this.changeApplicantStatus(id, tenantId, dto.targetStatus, userId, userEmail);
        }
        successCount++;
      } catch (err) {
        failedCount++;
      }
    }

    return { successCount, failedCount };
  }
}

export const applicantService = new ApplicantService();
