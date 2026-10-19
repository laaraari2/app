import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { academicActivityService } from '../application/services/academic-activity.service';

export class AcademicActivityController {
  public async getActivityTimeline(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const timeline = await academicActivityService.getEntityActivityTimeline(tenantId, limit);
      res.json({ status: 'success', data: timeline });
    } catch (err) { next(err); }
  }
}

export const academicActivityController = new AcademicActivityController();
