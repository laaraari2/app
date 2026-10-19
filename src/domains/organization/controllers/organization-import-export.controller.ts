import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { organizationImportExportService } from '../application/services/organization-import-export.service';

export class OrganizationImportExportController {
  public importCampusesCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const csvContent = typeof req.body === 'string' ? req.body : req.body.csv || '';
      const result = await organizationImportExportService.importCampusesCsv(tenantId, csvContent, actorId, actorEmail);

      res.json({ success: true, data: result, message: 'Campus CSV import processed' });
    } catch (error) {
      next(error);
    }
  };

  public importRoomsCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const csvContent = typeof req.body === 'string' ? req.body : req.body.csv || '';
      const result = await organizationImportExportService.importRoomsCsv(tenantId, csvContent, actorId, actorEmail);

      res.json({ success: true, data: result, message: 'Rooms CSV import processed' });
    } catch (error) {
      next(error);
    }
  };

  public exportCampusesCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const csv = await organizationImportExportService.exportCampusesCsv(tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="campuses_export.csv"');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  };

  public exportRoomsCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const csv = await organizationImportExportService.exportRoomsCsv(tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="rooms_export.csv"');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  };
}

export const organizationImportExportController = new OrganizationImportExportController();
