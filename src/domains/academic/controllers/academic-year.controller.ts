import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { academicYearService } from '../application/services/academic-year.service';

export class AcademicYearController {
  public async getAcademicYears(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        status: req.query.status as string,
        includeDeleted: req.query.includeDeleted === 'true',
        includeArchived: req.query.includeArchived === 'true',
      };
      const years = await academicYearService.getPaginatedAcademicYears(tenantId, options);
      res.json({ status: 'success', ...years });
    } catch (err) {
      next(err);
    }
  }

  public async getAcademicYearById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const year = await academicYearService.getAcademicYearById(req.params.id, tenantId);
      res.json({ status: 'success', data: year });
    } catch (err) {
      next(err);
    }
  }

  public async getCurrentAcademicYear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const current = await academicYearService.getCurrentAcademicYear(tenantId);
      res.json({ status: 'success', data: current });
    } catch (err) {
      next(err);
    }
  }

  public async createAcademicYear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const year = await academicYearService.createAcademicYear(
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: year, message: 'Academic Year created successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async updateAcademicYear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await academicYearService.updateAcademicYear(
        req.params.id,
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: updated, message: 'Academic Year updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async deleteAcademicYear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await academicYearService.softDeleteAcademicYear(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Academic Year moved to trash' });
    } catch (err) {
      next(err);
    }
  }

  public async restoreAcademicYear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await academicYearService.restoreAcademicYear(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Academic Year restored successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async archiveAcademicYear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await academicYearService.archiveAcademicYear(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Academic Year archived successfully' });
    } catch (err) {
      next(err);
    }
  }

  public async setCurrentAcademicYear(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await academicYearService.setCurrentAcademicYear(tenantId, req.params.id, req.user?.id);
      res.json({ status: 'success', data: updated, message: 'Current Academic Year activated' });
    } catch (err) {
      next(err);
    }
  }
}

export const academicYearController = new AcademicYearController();
