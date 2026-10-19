import { buildingRepository } from '../../infrastructure/persistence/building.repository';
import { campusRepository } from '../../infrastructure/persistence/campus.repository';
import { Building, CampusStatus, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';

export class BuildingService {
  public async getBuildingById(id: string, tenantId: string): Promise<Building> {
    const building = await buildingRepository.findById(id, tenantId);
    if (!building) {
      throw new NotFoundError('Building');
    }
    return building;
  }

  public async getPaginatedBuildings(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Building>> {
    return buildingRepository.findAllPaginated(tenantId, query);
  }

  public async createBuilding(
    tenantId: string,
    data: {
      campusId: string;
      name: string;
      code: string;
      totalFloors?: number;
      description?: string;
      status?: CampusStatus;
      academicYearId?: string;
    },
    actorId?: string,
    actorEmail?: string
  ): Promise<Building> {
    const campus = await campusRepository.findById(data.campusId, tenantId);
    if (!campus) {
      throw new NotFoundError('Campus');
    }

    const existingCode = await buildingRepository.findByCode(data.code, data.campusId, tenantId);
    if (existingCode) {
      throw new ConflictError(`Building code '${data.code}' already exists in this campus`);
    }

    const building = await buildingRepository.save({
      id: crypto.randomUUID(),
      tenantId,
      campusId: data.campusId,
      name: data.name,
      code: data.code.toUpperCase(),
      totalFloors: data.totalFloors || 1,
      description: data.description,
      status: data.status || 'ACTIVE',
      academicYearId: data.academicYearId || campus.academicYearId,
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
        action: 'BUILDING_CREATED',
        resource: 'building',
        targetId: building.id,
        changes: data,
      });
    }

    return building;
  }

  public async updateBuilding(
    id: string,
    tenantId: string,
    data: Partial<{
      campusId: string;
      name: string;
      code: string;
      totalFloors: number;
      description: string;
      status: CampusStatus;
      academicYearId: string;
    }>,
    actorId?: string,
    actorEmail?: string
  ): Promise<Building> {
    const existing = await this.getBuildingById(id, tenantId);

    const targetCampusId = data.campusId || existing.campusId;
    if (data.campusId && data.campusId !== existing.campusId) {
      const campus = await campusRepository.findById(data.campusId, tenantId);
      if (!campus) throw new NotFoundError('Campus');
    }

    if (data.code && (data.code.toUpperCase() !== existing.code.toUpperCase() || targetCampusId !== existing.campusId)) {
      const conflict = await buildingRepository.findByCode(data.code, targetCampusId, tenantId);
      if (conflict) {
        throw new ConflictError(`Building code '${data.code}' already exists in this campus`);
      }
    }

    const updated = await buildingRepository.update(id, tenantId, {
      ...data,
      code: data.code ? data.code.toUpperCase() : existing.code,
      updatedBy: actorId,
    });

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'BUILDING_UPDATED',
        resource: 'building',
        targetId: id,
        changes: data,
      });
    }

    return updated!;
  }

  public async softDeleteBuilding(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await buildingRepository.softDelete(id, tenantId, actorId);
    if (!success) {
      throw new NotFoundError('Building');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'BUILDING_SOFT_DELETED',
        resource: 'building',
        targetId: id,
      });
    }
  }

  public async restoreBuilding(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await buildingRepository.restore(id, tenantId);
    if (!success) {
      throw new NotFoundError('Building');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'BUILDING_RESTORED',
        resource: 'building',
        targetId: id,
      });
    }
  }

  public async archiveBuilding(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<Building> {
    const archived = await buildingRepository.archive(id, tenantId);
    if (!archived) {
      throw new NotFoundError('Building');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'BUILDING_ARCHIVED',
        resource: 'building',
        targetId: id,
      });
    }

    return archived;
  }
}

export const buildingService = new BuildingService();
