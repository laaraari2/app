import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { classGroupService } from '../application/services/class-group.service';

export class ClassGroupController {
  public async getClassGroups(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        gradeId: req.query.gradeId as string,
        academicYearId: req.query.academicYearId as string,
        campusId: req.query.campusId as string,
        status: req.query.status as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await classGroupService.getPaginatedClassGroups(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getClassGroupById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const cg = await classGroupService.getClassGroupById(req.params.id, tenantId);
      res.json({ status: 'success', data: cg });
    } catch (err) { next(err); }
  }

  public async createClassGroup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const cg = await classGroupService.createClassGroup(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: cg, message: 'Class Group created' });
    } catch (err) { next(err); }
  }

  public async updateClassGroup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await classGroupService.updateClassGroup(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Class Group updated' });
    } catch (err) { next(err); }
  }

  public async deleteClassGroup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await classGroupService.softDeleteClassGroup(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Class Group soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreClassGroup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await classGroupService.restoreClassGroup(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Class Group restored' });
    } catch (err) { next(err); }
  }

  public async archiveClassGroup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await classGroupService.archiveClassGroup(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Class Group archived' });
    } catch (err) { next(err); }
  }
}

export const classGroupController = new ClassGroupController();
