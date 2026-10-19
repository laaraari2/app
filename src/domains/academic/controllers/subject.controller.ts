import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { subjectService } from '../application/services/subject.service';

export class SubjectController {
  public async getSubjects(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        status: req.query.status as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await subjectService.getPaginatedSubjects(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getSubjectById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const subject = await subjectService.getSubjectById(req.params.id, tenantId);
      res.json({ status: 'success', data: subject });
    } catch (err) { next(err); }
  }

  public async createSubject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const subject = await subjectService.createSubject(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: subject, message: 'Subject created' });
    } catch (err) { next(err); }
  }

  public async updateSubject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await subjectService.updateSubject(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Subject updated' });
    } catch (err) { next(err); }
  }

  public async deleteSubject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await subjectService.softDeleteSubject(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Subject soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreSubject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await subjectService.restoreSubject(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Subject restored' });
    } catch (err) { next(err); }
  }

  public async archiveSubject(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await subjectService.archiveSubject(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Subject archived' });
    } catch (err) { next(err); }
  }
}

export const subjectController = new SubjectController();
