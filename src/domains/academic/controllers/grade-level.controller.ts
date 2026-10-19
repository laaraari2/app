import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { gradeLevelService } from '../application/services/grade-level.service';

export class GradeLevelController {
  public async getGrades(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        stageId: req.query.stageId as string,
        status: req.query.status as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await gradeLevelService.getPaginatedGradeLevels(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getGradeById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const grade = await gradeLevelService.getGradeLevelById(req.params.id, tenantId);
      res.json({ status: 'success', data: grade });
    } catch (err) { next(err); }
  }

  public async createGrade(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const grade = await gradeLevelService.createGradeLevel(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: grade, message: 'Grade Level created' });
    } catch (err) { next(err); }
  }

  public async updateGrade(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await gradeLevelService.updateGradeLevel(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Grade Level updated' });
    } catch (err) { next(err); }
  }

  public async deleteGrade(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await gradeLevelService.softDeleteGradeLevel(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Grade Level soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreGrade(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await gradeLevelService.restoreGradeLevel(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Grade Level restored' });
    } catch (err) { next(err); }
  }

  public async archiveGrade(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await gradeLevelService.archiveGradeLevel(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Grade Level archived' });
    } catch (err) { next(err); }
  }
}

export const gradeLevelController = new GradeLevelController();
