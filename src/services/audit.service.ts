import { auditLogRepository } from '../repositories/audit-log.repository';
import { AuditLog } from '../types/auth';

export class AuditService {
  public async logAction(params: {
    tenantId: string;
    actorId: string;
    actorEmail: string;
    action: string;
    resource: string;
    targetId?: string;
    changes?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditLog> {
    try {
      return await auditLogRepository.create({
        tenantId: params.tenantId,
        actorId: params.actorId,
        actorEmail: params.actorEmail,
        action: params.action,
        resource: params.resource,
        targetId: params.targetId,
        changes: params.changes || {},
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      });
    } catch (err) {
      console.error('⚠️ [AuditLog] Failed to persist audit entry:', err);
      // Fail silently to prevent blocking critical path execution
      return {
        id: 'failed_audit',
        ...params,
        createdAt: new Date(),
      };
    }
  }

  public async log(params: {
    tenantId: string;
    userId: string;
    userEmail: string;
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
  }): Promise<AuditLog> {
    return this.logAction({
      tenantId: params.tenantId,
      actorId: params.userId,
      actorEmail: params.userEmail,
      action: params.action,
      resource: params.resource,
      targetId: params.resourceId,
      changes: params.details,
    });
  }

  public async getLogs(tenantId: string): Promise<AuditLog[]> {
    return this.getTenantAuditLogs(tenantId);
  }

  public async getTenantAuditLogs(tenantId: string, limit?: number): Promise<AuditLog[]> {
    return auditLogRepository.findAllForTenant(tenantId, limit);
  }

  public async getGlobalAuditLogs(limit?: number): Promise<AuditLog[]> {
    return auditLogRepository.findAllGlobal(limit);
  }
}

export const auditService = new AuditService();
