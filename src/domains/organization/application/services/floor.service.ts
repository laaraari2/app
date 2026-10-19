import { floorRepository } from '../../infrastructure/persistence/floor.repository';
import { buildingRepository } from '../../infrastructure/persistence/building.repository';
import { Floor, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { NotFoundError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';

export class FloorService {
  public async getFloorById(id: string, tenantId: string): Promise<Floor> {
    const floor = await floorRepository.findById(id, tenantId);
    if (!floor) {
      throw new NotFoundError('Floor');
    }
    return floor;
  }

  public async getPaginatedFloors(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Floor>> {
    return floorRepository.findAllPaginated(tenantId, query);
  }

  public async createFloor(
    tenantId: string,
    data: {
      campusId: string;
      buildingId: string;
      name: string;
      floorNumber: number;
      description?: string;
      status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
      academicYearId?: string;
    },
    actorId?: string,
    actorEmail?: string
  ): Promise<Floor> {
    const building = await buildingRepository.findById(data.buildingId, tenantId);
    if (!building) {
      throw new NotFoundError('Building');
    }

    const floor = await floorRepository.save({
      id: crypto.randomUUID(),
      tenantId,
      campusId: data.campusId || building.campusId,
      buildingId: data.buildingId,
      name: data.name,
      floorNumber: data.floorNumber,
      description: data.description,
      status: data.status || 'ACTIVE',
      academicYearId: data.academicYearId || building.academicYearId,
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
        action: 'FLOOR_CREATED',
        resource: 'floor',
        targetId: floor.id,
        changes: data,
      });
    }

    return floor;
  }

  public async updateFloor(
    id: string,
    tenantId: string,
    data: Partial<{
      campusId: string;
      buildingId: string;
      name: string;
      floorNumber: number;
      description: string;
      status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
      academicYearId: string;
    }>,
    actorId?: string,
    actorEmail?: string
  ): Promise<Floor> {
    const existing = await this.getFloorById(id, tenantId);

    if (data.buildingId && data.buildingId !== existing.buildingId) {
      const bldg = await buildingRepository.findById(data.buildingId, tenantId);
      if (!bldg) throw new NotFoundError('Building');
    }

    const updated = await floorRepository.update(id, tenantId, {
      ...data,
      updatedBy: actorId,
    });

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'FLOOR_UPDATED',
        resource: 'floor',
        targetId: id,
        changes: data,
      });
    }

    return updated!;
  }

  public async softDeleteFloor(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await floorRepository.softDelete(id, tenantId, actorId);
    if (!success) {
      throw new NotFoundError('Floor');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'FLOOR_SOFT_DELETED',
        resource: 'floor',
        targetId: id,
      });
    }
  }

  public async restoreFloor(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await floorRepository.restore(id, tenantId);
    if (!success) {
      throw new NotFoundError('Floor');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'FLOOR_RESTORED',
        resource: 'floor',
        targetId: id,
      });
    }
  }

  public async archiveFloor(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<Floor> {
    const archived = await floorRepository.archive(id, tenantId);
    if (!archived) {
      throw new NotFoundError('Floor');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'FLOOR_ARCHIVED',
        resource: 'floor',
        targetId: id,
      });
    }

    return archived;
  }
}

export const floorService = new FloorService();
