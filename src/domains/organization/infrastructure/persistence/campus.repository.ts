import { db } from '../../../../db/store';
import { Campus, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { CampusAggregate } from '../../domain/entities/Campus';

export class CampusRepository {
  public async findById(id: string, tenantId: string): Promise<Campus | null> {
    const campus = db.campuses.get(id);
    if (!campus || campus.tenantId !== tenantId) return null;
    return campus;
  }

  public async findByCode(code: string, tenantId: string): Promise<Campus | null> {
    const formatted = code.toUpperCase();
    const list = Array.from(db.campuses.values()).filter(
      c => c.tenantId === tenantId && !c.isDeleted && c.code.toUpperCase() === formatted
    );
    return list[0] || null;
  }

  public async save(campusData: Campus): Promise<Campus> {
    const aggregate = new CampusAggregate(campusData);
    db.campuses.set(aggregate.id, aggregate);
    return aggregate;
  }

  public async update(id: string, tenantId: string, updates: Partial<Campus>): Promise<Campus | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated: Campus = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    db.campuses.set(id, updated);
    return updated;
  }

  public async softDelete(id: string, tenantId: string, actorId?: string): Promise<boolean> {
    const campus = await this.findById(id, tenantId);
    if (!campus) return false;

    const aggregate = new CampusAggregate(campus);
    aggregate.softDelete(actorId);
    db.campuses.set(id, aggregate);
    return true;
  }

  public async restore(id: string, tenantId: string): Promise<boolean> {
    const campus = db.campuses.get(id);
    if (!campus || campus.tenantId !== tenantId) return false;

    const aggregate = new CampusAggregate(campus);
    aggregate.restore();
    db.campuses.set(id, aggregate);
    return true;
  }

  public async archive(id: string, tenantId: string): Promise<Campus | null> {
    const campus = await this.findById(id, tenantId);
    if (!campus) return null;

    const aggregate = new CampusAggregate(campus);
    aggregate.archive();
    db.campuses.set(id, aggregate);
    return aggregate;
  }

  public async findAllPaginated(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Campus>> {
    let items = Array.from(db.campuses.values()).filter(c => c.tenantId === tenantId);

    if (!query.includeDeleted) {
      items = items.filter(c => !c.isDeleted);
    }

    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        c =>
          c.name.toLowerCase().includes(term) ||
          c.code.toLowerCase().includes(term) ||
          (c.city && c.city.toLowerCase().includes(term)) ||
          (c.principalName && c.principalName.toLowerCase().includes(term))
      );
    }

    if (query.status) {
      items = items.filter(c => c.status === query.status);
    }

    if (query.academicYearId) {
      items = items.filter(c => c.academicYearId === query.academicYearId);
    }

    // Sorting
    const sortBy = (query.sortBy as keyof Campus) || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    items.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;
      return 0;
    });

    // Pagination
    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const data = items.slice(startIndex, startIndex + limit);

    return { data, total, page, limit, totalPages };
  }
}

export const campusRepository = new CampusRepository();
