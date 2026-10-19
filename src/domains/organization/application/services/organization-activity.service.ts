import { db } from '../../../../db/store';
import { ActivityTimelineItem } from '../../../../types/organization';

export class OrganizationActivityService {
  public async getEntityActivityTimeline(
    tenantId: string,
    entityType?: 'school' | 'campus' | 'building' | 'floor' | 'room',
    entityId?: string
  ): Promise<ActivityTimelineItem[]> {
    const logs = Array.from(db.auditLogs.values()).filter(log => log.tenantId === tenantId);

    const filtered = logs.filter(log => {
      if (entityType && log.resource !== entityType) return false;
      if (entityId && log.targetId !== entityId) return false;
      return true;
    });

    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return filtered.map(log => ({
      id: log.id,
      tenantId: log.tenantId,
      entityType: log.resource as any,
      entityId: log.targetId || 'unknown',
      action: log.action,
      actorId: log.actorId,
      actorEmail: log.actorEmail,
      changes: log.changes,
      timestamp: new Date(log.timestamp),
    }));
  }
}

export const organizationActivityService = new OrganizationActivityService();
