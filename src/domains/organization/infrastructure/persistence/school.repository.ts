import { db } from '../../../../db/store';
import { School, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { SchoolAggregate } from '../../domain/entities/School';
import { ISchoolRepository } from '../../domain/repositories/ISchoolRepository';

export class SchoolRepository implements ISchoolRepository {

  public async findById(id: string, tenantId: string): Promise<School | null> {
    const school = db.schools.get(id);

    if (!school || school.tenantId !== tenantId) {
      return null;
    }

    return school;
  }

  public async findByTenantId(tenantId: string): Promise<School | null> {
    const list = Array.from(db.schools.values()).filter(
      s => s.tenantId === tenantId && !s.isDeleted
    );

    return list[0] || null;
  }

  public async save(schoolData: School): Promise<School> {
    const aggregate = new SchoolAggregate(schoolData);

    db.schools.set(aggregate.id, aggregate);

    return aggregate;
  }

  public async update(
    id: string,
    tenantId: string,
    updates: Partial<School>
  ): Promise<School | null> {

    const existing = await this.findById(id, tenantId);

    if (!existing) {
      return null;
    }

    const updated: School = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    db.schools.set(id, updated);

    return updated;
  }

  public async softDelete(
    id: string,
    tenantId: string,
    actorId?: string
  ): Promise<boolean> {

    const school = await this.findById(id, tenantId);

    if (!school) {
      return false;
    }

    const aggregate = new SchoolAggregate(school);

    aggregate.softDelete(actorId);

    db.schools.set(id, aggregate);

    return true;
  }

  public async restore(
    id: string,
    tenantId: string
  ): Promise<boolean> {

    const school = db.schools.get(id);

    if (!school || school.tenantId !== tenantId) {
      return false;
    }

    const aggregate = new SchoolAggregate(school);

    aggregate.restore();

    db.schools.set(id, aggregate);

    return true;
  }

  public async findAllPaginated(
    tenantId: string,
    query: PaginationQuery
  ): Promise<PaginatedResult<School>> {

    let items = Array.from(db.schools.values()).filter(
      s => s.tenantId === tenantId
    );

    if (!query.includeDeleted) {
      items = items.filter(s => !s.isDeleted);
    }

    if (query.search) {
      const term = query.search.toLowerCase();

      items = items.filter(
        s =>
          s.name.toLowerCase().includes(term) ||
          s.code.toLowerCase().includes(term) ||
          (s.city && s.city.toLowerCase().includes(term))
      );
    }

    if (query.status) {
      items = items.filter(s => s.status === query.status);
    }

    const sortBy = (query.sortBy as keyof School) || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

    items.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';

      if (valA < valB) return -1 * sortOrder;
      if (valA > valB) return 1 * sortOrder;

      return 0;
    });

    const page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;

    const startIndex = (page - 1) * limit;

    const data = items.slice(startIndex, startIndex + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export const schoolRepository = new SchoolRepository();
