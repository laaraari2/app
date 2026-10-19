import { roomRepository } from '../../infrastructure/persistence/room.repository';
import { floorRepository } from '../../infrastructure/persistence/floor.repository';
import { Room, RoomStatus, RoomType, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';

export class RoomService {
  public async getRoomById(id: string, tenantId: string): Promise<Room> {
    const room = await roomRepository.findById(id, tenantId);
    if (!room) {
      throw new NotFoundError('Room');
    }
    return room;
  }

  public async getPaginatedRooms(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Room>> {
    return roomRepository.findAllPaginated(tenantId, query);
  }

  public async createRoom(
    tenantId: string,
    data: {
      campusId: string;
      buildingId: string;
      floorId: string;
      name: string;
      code: string;
      roomType?: RoomType;
      capacity?: number;
      facilities?: string[];
      status?: RoomStatus;
      academicYearId?: string;
    },
    actorId?: string,
    actorEmail?: string
  ): Promise<Room> {
    const floor = await floorRepository.findById(data.floorId, tenantId);
    if (!floor) {
      throw new NotFoundError('Floor');
    }

    const existingCode = await roomRepository.findByCode(data.code, data.buildingId, tenantId);
    if (existingCode) {
      throw new ConflictError(`Room code '${data.code}' already exists in this building`);
    }

    const room = await roomRepository.save({
      id: crypto.randomUUID(),
      tenantId,
      campusId: data.campusId || floor.campusId,
      buildingId: data.buildingId || floor.buildingId,
      floorId: data.floorId,
      name: data.name,
      code: data.code.toUpperCase(),
      roomType: data.roomType || 'CLASSROOM',
      capacity: data.capacity || 30,
      facilities: data.facilities || [],
      status: data.status || 'AVAILABLE',
      academicYearId: data.academicYearId || floor.academicYearId,
      createdBy: actorId,
      updatedBy: actorId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ROOM_CREATED',
        resource: 'room',
        targetId: room.id,
        changes: data,
      });
    }

    return room;
  }

  public async updateRoom(
    id: string,
    tenantId: string,
    data: Partial<{
      campusId: string;
      buildingId: string;
      floorId: string;
      name: string;
      code: string;
      roomType: RoomType;
      capacity: number;
      facilities: string[];
      status: RoomStatus;
      academicYearId: string;
    }>,
    actorId?: string,
    actorEmail?: string
  ): Promise<Room> {
    const existing = await this.getRoomById(id, tenantId);

    const targetBuildingId = data.buildingId || existing.buildingId;
    if (data.floorId && data.floorId !== existing.floorId) {
      const flr = await floorRepository.findById(data.floorId, tenantId);
      if (!flr) throw new NotFoundError('Floor');
    }

    if (data.code && (data.code.toUpperCase() !== existing.code.toUpperCase() || targetBuildingId !== existing.buildingId)) {
      const conflict = await roomRepository.findByCode(data.code, targetBuildingId, tenantId);
      if (conflict) {
        throw new ConflictError(`Room code '${data.code}' already exists in this building`);
      }
    }

    const updated = await roomRepository.update(id, tenantId, {
      ...data,
      code: data.code ? data.code.toUpperCase() : existing.code,
      updatedBy: actorId,
    });

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ROOM_UPDATED',
        resource: 'room',
        targetId: id,
        changes: data,
      });
    }

    return updated!;
  }

  public async softDeleteRoom(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await roomRepository.softDelete(id, tenantId, actorId);
    if (!success) {
      throw new NotFoundError('Room');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ROOM_SOFT_DELETED',
        resource: 'room',
        targetId: id,
      });
    }
  }

  public async restoreRoom(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await roomRepository.restore(id, tenantId);
    if (!success) {
      throw new NotFoundError('Room');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ROOM_RESTORED',
        resource: 'room',
        targetId: id,
      });
    }
  }

  public async archiveRoom(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<Room> {
    const archived = await roomRepository.archive(id, tenantId);
    if (!archived) {
      throw new NotFoundError('Room');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'ROOM_ARCHIVED',
        resource: 'room',
        targetId: id,
      });
    }

    return archived;
  }
}

export const roomService = new RoomService();
