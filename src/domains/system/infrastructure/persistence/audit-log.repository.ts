import { db } from '../../../../db/store';
import { AuditLog } from '../../../../types/auth';

export class AuditLogRepository {
  public async create(data: Omit<AuditLog, 'id' | 'createdAt'> & { id?: string }): Promise<AuditLog> {
    const id = data.id || `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const audit: AuditLog = {
      ...data,
      id,
      createdAt: new Date(),
    };
    db.auditLogs.set(id, audit);
    return audit;
  }

  public async findAllForTenant(tenantId: string, limit: number = 100): Promise<AuditLog[]> {
    const logs = Array.from(db.auditLogs.values());
    return logs
      .filter(l => l.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  public async findAllGlobal(limit: number = 100): Promise<AuditLog[]> {
    const logs = Array.from(db.auditLogs.values());
    return logs
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const auditLogRepository = new AuditLogRepository();
