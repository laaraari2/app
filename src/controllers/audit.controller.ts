import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { auditService } from '../services/audit.service';

export async function getAuditLogsController(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const isSuperAdmin = req.user?.roles.includes('SUPER_ADMIN');
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId;

    let logs;
    if (isSuperAdmin && !req.query.tenantOnly) {
      logs = await auditService.getGlobalAuditLogs(100);
    } else if (tenantId) {
      logs = await auditService.getTenantAuditLogs(tenantId, 100);
    } else {
      logs = [];
    }

    res.status(200).json({
      status: 'success',
      data: logs,
    });
  } catch (err) {
    next(err);
  }
}
