import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { organizationActivityService } from '../application/services/organization-activity.service';

export class OrganizationActivityController {
  public getTimeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { entityType, entityId } = req.query;

      const timeline = await organizationActivityService.getEntityActivityTimeline(
        tenantId,
        entityType as any,
        entityId as string
      );

      res.json({ success: true, data: timeline });
    } catch (error) {
      next(error);
    }
  };
}

export const organizationActivityController = new OrganizationActivityController();
