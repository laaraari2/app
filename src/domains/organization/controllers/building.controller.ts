import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { buildingService } from '../application/services/building.service';
import { createBuildingSchema, updateBuildingSchema, paginationQuerySchema } from '../dto/organization.dto';

export class BuildingController {
  public listPaginated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const query = paginationQuerySchema.parse(req.query);
      const result = await buildingService.getPaginatedBuildings(tenantId, query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const building = await buildingService.getBuildingById(id, tenantId);
      res.json({ success: true, data: building });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = createBuildingSchema.parse(req.body);
      const building = await buildingService.createBuilding(tenantId, validated, actorId, actorEmail);
      res.status(201).json({ success: true, data: building, message: 'Building created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = updateBuildingSchema.parse(req.body);
      const building = await buildingService.updateBuilding(id, tenantId, validated, actorId, actorEmail);
      res.json({ success: true, data: building, message: 'Building updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public softDelete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      await buildingService.softDeleteBuilding(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Building soft deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public restore = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      await buildingService.restoreBuilding(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Building restored successfully' });
    } catch (error) {
      next(error);
    }
  };

  public archive = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const building = await buildingService.archiveBuilding(id, tenantId, actorId, actorEmail);
      res.json({ success: true, data: building, message: 'Building archived successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export const buildingController = new BuildingController();
