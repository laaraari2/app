import { db } from '../../../../db/store';
import { AdmissionCampaign, PaginationAndFilterOptions, PaginatedResult } from '../../domain/entities/admissions-types';

export class AdmissionCampaignRepository {
  public async findById(id: string, tenantId: string): Promise<AdmissionCampaign | null> {
    const campaign = db.admissionCampaigns.get(id);
    if (!campaign || campaign.tenantId !== tenantId) return null;
    return campaign;
  }

  public async findByCode(code: string, tenantId: string): Promise<AdmissionCampaign | null> {
    for (const campaign of db.admissionCampaigns.values()) {
      if (campaign.tenantId === tenantId && campaign.code.toUpperCase() === code.toUpperCase() && !campaign.isDeleted) {
        return campaign;
      }
    }
    return null;
  }

  public async save(campaign: AdmissionCampaign): Promise<AdmissionCampaign> {
    db.admissionCampaigns.set(campaign.id, campaign);
    return campaign;
  }

  public async getPaginated(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<AdmissionCampaign>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const search = options.search?.toLowerCase().trim();

    let items = Array.from(db.admissionCampaigns.values()).filter(c => c.tenantId === tenantId);

    if (!options.includeDeleted) {
      items = items.filter(c => !c.isDeleted);
    }
    if (!options.includeArchived) {
      items = items.filter(c => !c.isArchived);
    }

    if (options.academicYearId) {
      items = items.filter(c => c.academicYearId === options.academicYearId);
    }

    if (options.status) {
      items = items.filter(c => c.status === options.status);
    }

    if (search) {
      items = items.filter(
        c => c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search)
      );
    }

    // Sort
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = items.slice(startIndex, startIndex + limit);

    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export const admissionCampaignRepository = new AdmissionCampaignRepository();
