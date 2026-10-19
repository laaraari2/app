import { db } from '../../../../db/store';
import { Room, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { RoomAggregate } from '../../domain/entities/Room';

export class RoomRepository {
  public async findById(id: string, tenantId: string): Promise<Room | null> {
    const room = db.rooms.get(id);
    if (!room || room.tenantId !== tenantId) return null;
    return room;
  }

  public async findByCode(code: string, buildingId: string, tenantId: string): Promise<Room | null> {
    const formatted = code.toUpperCase();
    const list = Array.from(db.rooms.values()).filter(
      r => r.tenantId === tenantId && r.buildingId === buildingId && !r.isDeleted && r.code.toUpperCase() === formatted
    );
    return list[0] || null;
  }

  public async save(roomData: Room): Promise<Room> {
    const aggregate = new RoomAggregate(roomData);
    db.rooms.set(aggregate.id, aggregate);
    return aggregate;
  }

  public async update(id: string, tenantId: string, updates: Partial<Room>): Promise<Room | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated: Room = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    db.rooms.set(id, updated);
    return updated;
  }

  public async softDelete(id: string, tenantId: string, actorId?: string): Promise<boolean> {
    const room = await this.findById(id, tenantId);
    if (!room) return false;

    const aggregate = new RoomAggregate(room);
    aggregate.softDelete(actorId);
    db.rooms.set(id, aggregate);
    return true;
  }

  public async restore(id: string, tenantId: string): Promise<boolean> {
    const room = db.rooms.get(id);
    if (!room || room.tenantId !== tenantId) return false;

    const aggregate = new RoomAggregate(room);
    aggregate.restore();
    db.rooms.set(id, aggregate);
    return true;
  }

  public async archive(id: string, tenantId: string): Promise<Room | null> {
    const room = await this.findById(id, tenantId);
    if (!room) return null;

    const aggregate = new RoomAggregate(room);
    aggregate.archive();
    db.rooms.set(id, aggregate);
    return aggregate;
  }

  public async findAllPaginated(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Room>> {
    let items = Array.from(db.rooms.values()).filter(r => r.tenantId === tenantId);

    if (!query.includeDeleted) {
      items = items.filter(r => !r.isDeleted);
    }

    if (query.campusId) {
      items = items.filter(r => r.campusId === query.campusId);
    }

    if (query.buildingId) {
      items = items.filter(r => r.buildingId === query.buildingId);
    }

    if (query.floorId) {
      items = items.filter(r => r.floorId === query.floorId);
    }

    if (query.roomType) {
      items = items.filter(r => r.roomType === query.roomType);
    }

    if (query.search) {
      const term = query.search.toLowerCase();
      items = items.filter(
        r =>
          r.name.toLowerCase().includes(term) ||
          r.code.toLowerCase().includes(term) ||
          r.facilities.some(f => f.toLowerCase().includes(term))
      );
    }

    if (query.status) {
      items = items.filter(r => r.status === query.status);
    }

    if (query.academicYearId) {
      items = items.filter(r => r.academicYearId === query.academicYearId);
    }

    // Sorting
    const sortBy = (query.sortBy as keyof Room) || 'name';
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

export const roomRepository = new RoomRepository();
