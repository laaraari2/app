import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { organizationBulkService } from '../application/services/organization-bulk.service';
import { bulkOperationSchema } from '../dto/organization.dto';

export class OrganizationBulkController {
  public executeBulk = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { entityType } = req.params; // campus | building | floor | room
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = bulkOperationSchema.parse(req.body);
      const result = await organizationBulkService.executeBulkOperation(
        tenantId,
        entityType as any,
        validated,
        actorId,
        actorEmail
      );

      res.json({ success: true, data: result, message: 'Bulk operation completed' });
    } catch (error) {
      next(error);
    }
  };
}

export const organizationBulkController = new OrganizationBulkController();
