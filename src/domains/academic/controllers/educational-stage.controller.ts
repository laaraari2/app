import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { educationalStageService } from '../application/services/educational-stage.service';

export class EducationalStageController {
  public async getStages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        status: req.query.status as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await educationalStageService.getPaginatedStages(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getStageById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const stage = await educationalStageService.getStageById(req.params.id, tenantId);
      res.json({ status: 'success', data: stage });
    } catch (err) { next(err); }
  }

  public async createStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const stage = await educationalStageService.createStage(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: stage, message: 'Educational Stage created' });
    } catch (err) { next(err); }
  }

  public async updateStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await educationalStageService.updateStage(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Educational Stage updated' });
    } catch (err) { next(err); }
  }

  public async deleteStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await educationalStageService.softDeleteStage(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Educational Stage soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await educationalStageService.restoreStage(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Educational Stage restored' });
    } catch (err) { next(err); }
  }

  public async archiveStage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await educationalStageService.archiveStage(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Educational Stage archived' });
    } catch (err) { next(err); }
  }
}

export const educationalStageController = new EducationalStageController();
