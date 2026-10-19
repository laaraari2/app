import { auditService } from '../../../../services/audit.service';
import { AuditLog } from '../../../../types/auth';

export class PeopleActivityService {
  public async logActivity(params: {
    tenantId: string;
    userId: string;
    userEmail: string;
    action: string;
    resource: 'STAFF' | 'TEACHER' | 'STUDENT' | 'GUARDIAN' | 'RELATIONSHIP';
    resourceId?: string;
    details?: Record<string, any>;
  }): Promise<AuditLog> {
    return auditService.logAction({
      tenantId: params.tenantId,
      actorId: params.userId,
      actorEmail: params.userEmail,
      action: params.action,
      resource: params.resource,
      targetId: params.resourceId,
      changes: params.details,
    });
  }

  public async getTimelineForTenant(tenantId: string, limit: number = 50): Promise<AuditLog[]> {
    const allLogs = await auditService.getTenantAuditLogs(tenantId, 500);
    const peopleResources = ['STAFF', 'TEACHER', 'STUDENT', 'GUARDIAN', 'RELATIONSHIP'];
    
    return allLogs
      .filter((log) => peopleResources.includes(log.resource))
      .slice(0, limit);
  }
}

export const peopleActivityService = new PeopleActivityService();
