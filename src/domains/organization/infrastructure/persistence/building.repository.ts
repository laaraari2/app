import { db } from '../../../../db/store';
import { Building, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { BuildingAggregate } from '../../domain/entities/Building';

export class BuildingRepository {
  public async findById(id: string, tenantId: string): Promise<Building | null> {
    const building = db.buildings.get(id);
    if (!building || building.tenantId !== tenantId) return null;
    return building;
  }

  public async findByCode(code: string, campusId: string, tenantId: string): Promise<Building | null> {
    const formatted = code.toUpperCase();
    const list = Array.from(db.buildings.values()).filter(
      b => b.tenantId === tenantId && b.campusId === campusId && !b.isDeleted && b.code.toUpperCase() === formatted
    );
    return list[0] || null;
  }

  public async save(buildingData: Building): Promise<Building> {
    const aggregate = new BuildingAggregate(buildingData);
    db.buildings.set(aggregate.id, aggregate);
    return aggregate;
  }

  public async update(id: string, tenantId: string, updates: Partial<Building>): Promise<Building | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated: Building = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    db.buildings.set(id, updated);
    return updated;
  }

  public async softDelete(id: string, tenantId: string, actorId?: string): Promise<boolean> {
    const building = await this.findById(id, tenantId);
    if (!building) return false;

    const aggregate = new BuildingAggregate(building);
    aggregate.softDelete(actorId);
    db.buildings.set(id, aggregate);
    return true;
  }

  public async restore(id: string, tenantId: string): Promise<boolean> {
    const building = db.buildings.get(id);
    if (!building || building.tenantId !== tenantId) return false;

    const aggregate = new BuildingAggregate(building);
    aggregate.restore();
    db.buildings.set(id, aggregate);
    return true;
  }

  public async archive(id: string, tenantId: string): Promise<Building | null> {
    const building = await this.findById(id, tenantId);
    if (!building) return null;

    const aggregate = new BuildingAggregate(building);
    aggregate.archive();
    db.buildings.set(id, aggregate);
    return aggregate;
  }

  public async findAllPaginated(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Building>> {
    let items = Array.from(db.buildings.values()).filter(b => b.tenantId === tenantId);

    if (!query.includeDeleted) {
      items = items.filter(b => !b.isDeleted);
    }

    if (query.campusId) {
      items = items.filter(b => b.campusId === query.campusId);
    }

    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        b =>
          b.name.toLowerCase().includes(term) ||
          b.code.toLowerCase().includes(term) ||
          (b.description && b.description.toLowerCase().includes(term))
      );
    }

    if (query.status) {
      items = items.filter(b => b.status === query.status);
    }

    if (query.academicYearId) {
      items = items.filter(b => b.academicYearId === query.academicYearId);
    }

    // Sorting
    const sortBy = (query.sortBy as keyof Building) || 'createdAt';
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

export const buildingRepository = new BuildingRepository();
