import { registrationPeriodRepository } from '../../infrastructure/persistence/registration-period.repository';
import { RegistrationPeriod, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/admissions-types';
import { CreateRegistrationPeriodDto, UpdateRegistrationPeriodDto } from '../../dto/admissions.dto';
import { NotFoundError, ConflictError, ValidationError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';
import { createPeriodSchema } from '../../validators/admissions.validator';

export class RegistrationPeriodService {
  public async getPaginatedPeriods(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<RegistrationPeriod>> {
    return registrationPeriodRepository.getPaginated(tenantId, options);
  }

  public async getPeriodById(id: string, tenantId: string): Promise<RegistrationPeriod> {
    const period = await registrationPeriodRepository.findById(id, tenantId);
    if (!period || period.isDeleted) {
      throw new NotFoundError(`Registration period with ID '${id}' not found.`);
    }
    return period;
  }

  public async createPeriod(
    tenantId: string,
    dto: CreateRegistrationPeriodDto,
    userId?: string,
    userEmail?: string
  ): Promise<RegistrationPeriod> {
    const validated = createPeriodSchema.parse(dto);

    if (new Date(validated.endDate) <= new Date(validated.startDate)) {
      throw new ValidationError('Period end date must be strictly after start date.');
    }

    const existing = await registrationPeriodRepository.findByCode(validated.code, validated.campaignId, tenantId);
    if (existing) {
      throw new ConflictError(`Registration period with code '${validated.code}' already exists in this campaign.`);
    }

    const period: RegistrationPeriod = {
      id: `period_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      campaignId: validated.campaignId,
      code: validated.code,
      name: validated.name,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      targetGradeIds: validated.targetGradeIds,
      maxApplicants: validated.maxApplicants,
      status: validated.status || 'OPEN',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
    };

    const saved = await registrationPeriodRepository.save(period);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'REGISTRATION_PERIOD_CREATE',
      resource: 'admissions:period',
      resourceId: saved.id,
      details: { code: saved.code, name: saved.name },
    });

    return saved;
  }

  public async updatePeriod(
    id: string,
    tenantId: string,
    dto: UpdateRegistrationPeriodDto,
    userId?: string,
    userEmail?: string
  ): Promise<RegistrationPeriod> {
    const period = await this.getPeriodById(id, tenantId);

    if (dto.name !== undefined) period.name = dto.name;
    if (dto.startDate !== undefined) period.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) period.endDate = new Date(dto.endDate);
    if (dto.targetGradeIds !== undefined) period.targetGradeIds = dto.targetGradeIds;
    if (dto.maxApplicants !== undefined) period.maxApplicants = dto.maxApplicants;
    if (dto.status !== undefined) period.status = dto.status;

    if (period.endDate <= period.startDate) {
      throw new ValidationError('Period end date must be strictly after start date.');
    }

    period.updatedAt = new Date();
    period.updatedBy = userId;

    const updated = await registrationPeriodRepository.save(period);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'REGISTRATION_PERIOD_UPDATE',
      resource: 'admissions:period',
      resourceId: updated.id,
    });

    return updated;
  }

  public async softDeletePeriod(
    id: string,
    tenantId: string,
    userId?: string,
    userEmail?: string
  ): Promise<void> {
    const period = await this.getPeriodById(id, tenantId);
    period.isDeleted = true;
    period.deletedAt = new Date();
    period.deletedBy = userId;
    await registrationPeriodRepository.save(period);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'REGISTRATION_PERIOD_DELETE',
      resource: 'admissions:period',
      resourceId: id,
    });
  }

  public async restorePeriod(
    id: string,
    tenantId: string,
    userId?: string,
    userEmail?: string
  ): Promise<RegistrationPeriod> {
    const period = await registrationPeriodRepository.findById(id, tenantId);
    if (!period) {
      throw new NotFoundError(`Registration period with ID '${id}' not found.`);
    }

    period.isDeleted = false;
    period.deletedAt = undefined;
    period.deletedBy = undefined;
    period.updatedAt = new Date();

    const restored = await registrationPeriodRepository.save(period);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'REGISTRATION_PERIOD_RESTORE',
      resource: 'admissions:period',
      resourceId: id,
    });

    return restored;
  }
}

export const registrationPeriodService = new RegistrationPeriodService();
