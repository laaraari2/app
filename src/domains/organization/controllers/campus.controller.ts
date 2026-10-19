import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { campusService } from '../application/services/campus.service';
import { createCampusSchema, updateCampusSchema, paginationQuerySchema } from '../dto/organization.dto';

export class CampusController {
  public listPaginated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const query = paginationQuerySchema.parse(req.query);
      const result = await campusService.getPaginatedCampuses(tenantId, query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const campus = await campusService.getCampusById(id, tenantId);
      res.json({ success: true, data: campus });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = createCampusSchema.parse(req.body);
      const campus = await campusService.createCampus(tenantId, validated, actorId, actorEmail);
      res.status(201).json({ success: true, data: campus, message: 'Campus created successfully' });
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

      const validated = updateCampusSchema.parse(req.body);
      const campus = await campusService.updateCampus(id, tenantId, validated, actorId, actorEmail);
      res.json({ success: true, data: campus, message: 'Campus updated successfully' });
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

      await campusService.softDeleteCampus(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Campus soft deleted successfully' });
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

      await campusService.restoreCampus(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Campus restored successfully' });
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

      const campus = await campusService.archiveCampus(id, tenantId, actorId, actorEmail);
      res.json({ success: true, data: campus, message: 'Campus archived successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export const campusController = new CampusController();
