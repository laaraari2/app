import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { curriculumService } from '../application/services/curriculum.service';

export class CurriculumController {
  public async getCurriculums(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        gradeId: req.query.gradeId as string,
        subjectId: req.query.subjectId as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await curriculumService.getPaginatedCurriculums(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getCurriculumById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const curr = await curriculumService.getCurriculumById(req.params.id, tenantId);
      res.json({ status: 'success', data: curr });
    } catch (err) { next(err); }
  }

  public async createCurriculum(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const curr = await curriculumService.createCurriculum(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: curr, message: 'Curriculum entry created' });
    } catch (err) { next(err); }
  }

  public async updateCurriculum(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await curriculumService.updateCurriculum(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Curriculum entry updated' });
    } catch (err) { next(err); }
  }

  public async deleteCurriculum(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await curriculumService.softDeleteCurriculum(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Curriculum entry soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreCurriculum(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await curriculumService.restoreCurriculum(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Curriculum entry restored' });
    } catch (err) { next(err); }
  }

  public async archiveCurriculum(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await curriculumService.archiveCurriculum(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Curriculum entry archived' });
    } catch (err) { next(err); }
  }
}

export const curriculumController = new CurriculumController();
