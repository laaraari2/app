import { admissionCampaignRepository } from '../../infrastructure/persistence/admission-campaign.repository';
import { AdmissionCampaign, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/admissions-types';
import { CreateAdmissionCampaignDto, UpdateAdmissionCampaignDto } from '../../dto/admissions.dto';
import { NotFoundError, ConflictError, ValidationError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';
import { createCampaignSchema } from '../../validators/admissions.validator';

export class AdmissionCampaignService {
  public async getPaginatedCampaigns(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<AdmissionCampaign>> {
    return admissionCampaignRepository.getPaginated(tenantId, options);
  }

  public async getCampaignById(id: string, tenantId: string): Promise<AdmissionCampaign> {
    const campaign = await admissionCampaignRepository.findById(id, tenantId);
    if (!campaign || campaign.isDeleted) {
      throw new NotFoundError(`Admission campaign with ID '${id}' not found.`);
    }
    return campaign;
  }

  public async createCampaign(
    tenantId: string,
    dto: CreateAdmissionCampaignDto,
    userId?: string,
    userEmail?: string
  ): Promise<AdmissionCampaign> {
    const validated = createCampaignSchema.parse(dto);

    if (new Date(validated.endDate) <= new Date(validated.startDate)) {
      throw new ValidationError('Campaign end date must be strictly after start date.');
    }

    const existing = await admissionCampaignRepository.findByCode(validated.code, tenantId);
    if (existing) {
      throw new ConflictError(`Admission campaign with code '${validated.code}' already exists.`);
    }

    const campaign: AdmissionCampaign = {
      id: `camp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      academicYearId: validated.academicYearId,
      code: validated.code,
      name: validated.name,
      description: validated.description,
      startDate: new Date(validated.startDate),
      endDate: new Date(validated.endDate),
      status: validated.status || 'ACTIVE',
      maxCapacity: validated.maxCapacity,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
      isArchived: false,
    };

    const saved = await admissionCampaignRepository.save(campaign);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'ADMISSION_CAMPAIGN_CREATE',
      resource: 'admissions:campaign',
      resourceId: saved.id,
      details: { code: saved.code, name: saved.name },
    });

    return saved;
  }

  public async updateCampaign(
    id: string,
    tenantId: string,
    dto: UpdateAdmissionCampaignDto,
    userId?: string,
    userEmail?: string
  ): Promise<AdmissionCampaign> {
    const campaign = await this.getCampaignById(id, tenantId);

    if (dto.name !== undefined) campaign.name = dto.name;
    if (dto.description !== undefined) campaign.description = dto.description;
    if (dto.startDate !== undefined) campaign.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) campaign.endDate = new Date(dto.endDate);
    if (dto.status !== undefined) campaign.status = dto.status;
    if (dto.maxCapacity !== undefined) campaign.maxCapacity = dto.maxCapacity;

    if (campaign.endDate <= campaign.startDate) {
      throw new ValidationError('Campaign end date must be strictly after start date.');
    }

    campaign.updatedAt = new Date();
    campaign.updatedBy = userId;

    const updated = await admissionCampaignRepository.save(campaign);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'ADMISSION_CAMPAIGN_UPDATE',
      resource: 'admissions:campaign',
      resourceId: updated.id,
      details: { status: updated.status },
    });

    return updated;
  }

  public async softDeleteCampaign(
    id: string,
    tenantId: string,
    userId?: string,
    userEmail?: string
  ): Promise<void> {
    const campaign = await this.getCampaignById(id, tenantId);
    campaign.isDeleted = true;
    campaign.deletedAt = new Date();
    campaign.deletedBy = userId;
    await admissionCampaignRepository.save(campaign);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'ADMISSION_CAMPAIGN_DELETE',
      resource: 'admissions:campaign',
      resourceId: id,
    });
  }

  public async restoreCampaign(
    id: string,
    tenantId: string,
    userId?: string,
    userEmail?: string
  ): Promise<AdmissionCampaign> {
    const campaign = await admissionCampaignRepository.findById(id, tenantId);
    if (!campaign) {
      throw new NotFoundError(`Admission campaign with ID '${id}' not found.`);
    }

    campaign.isDeleted = false;
    campaign.deletedAt = undefined;
    campaign.deletedBy = undefined;
    campaign.updatedAt = new Date();

    const restored = await admissionCampaignRepository.save(campaign);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'ADMISSION_CAMPAIGN_RESTORE',
      resource: 'admissions:campaign',
      resourceId: id,
    });

    return restored;
  }
}

export const admissionCampaignService = new AdmissionCampaignService();
