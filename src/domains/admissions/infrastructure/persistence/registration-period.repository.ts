import { db } from '../../../../db/store';
import { RegistrationPeriod, PaginationAndFilterOptions, PaginatedResult } from '../../domain/entities/admissions-types';

export class RegistrationPeriodRepository {
  public async findById(id: string, tenantId: string): Promise<RegistrationPeriod | null> {
    const period = db.registrationPeriods.get(id);
    if (!period || period.tenantId !== tenantId) return null;
    return period;
  }

  public async findByCode(code: string, campaignId: string, tenantId: string): Promise<RegistrationPeriod | null> {
    for (const period of db.registrationPeriods.values()) {
      if (
        period.tenantId === tenantId &&
        period.campaignId === campaignId &&
        period.code.toUpperCase() === code.toUpperCase() &&
        !period.isDeleted
      ) {
        return period;
      }
    }
    return null;
  }

  public async save(period: RegistrationPeriod): Promise<RegistrationPeriod> {
    db.registrationPeriods.set(period.id, period);
    return period;
  }

  public async getPaginated(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<RegistrationPeriod>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const search = options.search?.toLowerCase().trim();

    let items = Array.from(db.registrationPeriods.values()).filter(p => p.tenantId === tenantId);

    if (!options.includeDeleted) {
      items = items.filter(p => !p.isDeleted);
    }

    if (options.campaignId) {
      items = items.filter(p => p.campaignId === options.campaignId);
    }

    if (options.status) {
      items = items.filter(p => p.status === options.status);
    }

    if (search) {
      items = items.filter(
        p => p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search)
      );
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;

    return {
      data: items.slice(startIndex, startIndex + limit),
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export const registrationPeriodRepository = new RegistrationPeriodRepository();
