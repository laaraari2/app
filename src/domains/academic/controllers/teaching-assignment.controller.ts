import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { teachingAssignmentService } from '../application/services/teaching-assignment.service';

export class TeachingAssignmentController {
  public async getAssignments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        classGroupId: req.query.classGroupId as string,
        subjectId: req.query.subjectId as string,
        teacherId: req.query.teacherId as string,
        academicYearId: req.query.academicYearId as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await teachingAssignmentService.getPaginatedAssignments(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getAssignmentById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const ta = await teachingAssignmentService.getAssignmentById(req.params.id, tenantId);
      res.json({ status: 'success', data: ta });
    } catch (err) { next(err); }
  }

  public async createAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const ta = await teachingAssignmentService.createAssignment(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: ta, message: 'Teaching Assignment created' });
    } catch (err) { next(err); }
  }

  public async updateAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await teachingAssignmentService.updateAssignment(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Teaching Assignment updated' });
    } catch (err) { next(err); }
  }

  public async deleteAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await teachingAssignmentService.softDeleteAssignment(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Teaching Assignment soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await teachingAssignmentService.restoreAssignment(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Teaching Assignment restored' });
    } catch (err) { next(err); }
  }

  public async archiveAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await teachingAssignmentService.archiveAssignment(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Teaching Assignment archived' });
    } catch (err) { next(err); }
  }
}

export const teachingAssignmentController = new TeachingAssignmentController();
