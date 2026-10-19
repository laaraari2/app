import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { academicImportExportService } from '../application/services/academic-import-export.service';

export class AcademicImportExportController {
  public async importSubjectsCsv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const csvContent = req.body.csv || (typeof req.body === 'string' ? req.body : '');
      const result = await academicImportExportService.importSubjectsCsv(
        tenantId,
        csvContent,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: result, message: 'CSV Import complete' });
    } catch (err) { next(err); }
  }

  public async exportSubjectsCsv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const csv = await academicImportExportService.exportSubjectsCsv(tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=subjects.csv');
      res.status(200).send(csv);
    } catch (err) { next(err); }
  }

  public async exportClassGroupsCsv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const csv = await academicImportExportService.exportClassGroupsCsv(tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=class-groups.csv');
      res.status(200).send(csv);
    } catch (err) { next(err); }
  }

  public async exportGradeLevelsCsv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const csv = await academicImportExportService.exportGradeLevelsCsv(tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=grade-levels.csv');
      res.status(200).send(csv);
    } catch (err) { next(err); }
  }
}

export const academicImportExportController = new AcademicImportExportController();
