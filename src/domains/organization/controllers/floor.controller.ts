import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { floorService } from '../application/services/floor.service';
import { createFloorSchema, updateFloorSchema, paginationQuerySchema } from '../dto/organization.dto';

export class FloorController {
  public listPaginated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const query = paginationQuerySchema.parse(req.query);
      const result = await floorService.getPaginatedFloors(tenantId, query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const floor = await floorService.getFloorById(id, tenantId);
      res.json({ success: true, data: floor });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = createFloorSchema.parse(req.body);
      const floor = await floorService.createFloor(tenantId, validated, actorId, actorEmail);
      res.status(201).json({ success: true, data: floor, message: 'Floor created successfully' });
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

      const validated = updateFloorSchema.parse(req.body);
      const floor = await floorService.updateFloor(id, tenantId, validated, actorId, actorEmail);
      res.json({ success: true, data: floor, message: 'Floor updated successfully' });
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

      await floorService.softDeleteFloor(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Floor soft deleted successfully' });
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

      await floorService.restoreFloor(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Floor restored successfully' });
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

      const floor = await floorService.archiveFloor(id, tenantId, actorId, actorEmail);
      res.json({ success: true, data: floor, message: 'Floor archived successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export const floorController = new FloorController();
