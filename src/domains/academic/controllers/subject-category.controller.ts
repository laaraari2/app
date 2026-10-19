import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { subjectCategoryService } from '../application/services/subject-category.service';

export class SubjectCategoryController {
  public async getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await subjectCategoryService.getPaginatedCategories(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getCategoryById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const cat = await subjectCategoryService.getCategoryById(req.params.id, tenantId);
      res.json({ status: 'success', data: cat });
    } catch (err) { next(err); }
  }

  public async createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const cat = await subjectCategoryService.createCategory(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: cat, message: 'Subject Category created' });
    } catch (err) { next(err); }
  }

  public async updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await subjectCategoryService.updateCategory(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Subject Category updated' });
    } catch (err) { next(err); }
  }

  public async deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await subjectCategoryService.softDeleteCategory(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Subject Category soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await subjectCategoryService.restoreCategory(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Subject Category restored' });
    } catch (err) { next(err); }
  }

  public async archiveCategory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await subjectCategoryService.archiveCategory(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Subject Category archived' });
    } catch (err) { next(err); }
  }
}

export const subjectCategoryController = new SubjectCategoryController();
