import { db } from '../../../../db/store';
import { Floor, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { FloorAggregate } from '../../domain/entities/Floor';

export class FloorRepository {
  public async findById(id: string, tenantId: string): Promise<Floor | null> {
    const floor = db.floors.get(id);
    if (!floor || floor.tenantId !== tenantId) return null;
    return floor;
  }

  public async save(floorData: Floor): Promise<Floor> {
    const aggregate = new FloorAggregate(floorData);
    db.floors.set(aggregate.id, aggregate);
    return aggregate;
  }

  public async update(id: string, tenantId: string, updates: Partial<Floor>): Promise<Floor | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated: Floor = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    db.floors.set(id, updated);
    return updated;
  }

  public async softDelete(id: string, tenantId: string, actorId?: string): Promise<boolean> {
    const floor = await this.findById(id, tenantId);
    if (!floor) return false;

    const aggregate = new FloorAggregate(floor);
    aggregate.softDelete(actorId);
    db.floors.set(id, aggregate);
    return true;
  }

  public async restore(id: string, tenantId: string): Promise<boolean> {
    const floor = db.floors.get(id);
    if (!floor || floor.tenantId !== tenantId) return false;

    const aggregate = new FloorAggregate(floor);
    aggregate.restore();
    db.floors.set(id, aggregate);
    return true;
  }

  public async archive(id: string, tenantId: string): Promise<Floor | null> {
    const floor = await this.findById(id, tenantId);
    if (!floor) return null;

    const aggregate = new FloorAggregate(floor);
    aggregate.archive();
    db.floors.set(id, aggregate);
    return aggregate;
  }

  public async findAllPaginated(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Floor>> {
    let items = Array.from(db.floors.values()).filter(f => f.tenantId === tenantId);

    if (!query.includeDeleted) {
      items = items.filter(f => !f.isDeleted);
    }

    if (query.campusId) {
      items = items.filter(f => f.campusId === query.campusId);
    }

    if (query.buildingId) {
      items = items.filter(f => f.buildingId === query.buildingId);
    }

    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        f =>
          f.name.toLowerCase().includes(term) ||
          f.floorNumber.toString().includes(term) ||
          (f.description && f.description.toLowerCase().includes(term))
      );
    }

    if (query.status) {
      items = items.filter(f => f.status === query.status);
    }

    if (query.academicYearId) {
      items = items.filter(f => f.academicYearId === query.academicYearId);
    }

    // Sorting
    const sortBy = (query.sortBy as keyof Floor) || 'floorNumber';
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
    items.sort((a, b) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
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

export const floorRepository = new FloorRepository();
