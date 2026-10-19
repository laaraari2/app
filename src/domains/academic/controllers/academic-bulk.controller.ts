import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { academicBulkService } from '../application/services/academic-bulk.service';

export class AcademicBulkController {
  public async executeBulkOperation(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const entityType = req.params.entityType as any;
      const result = await academicBulkService.executeBulkOperation(tenantId, entityType, req.body, req.user?.id);
      res.json({ status: 'success', data: result, message: 'Bulk operation executed' });
    } catch (err) { next(err); }
  }
}

export const academicBulkController = new AcademicBulkController();
