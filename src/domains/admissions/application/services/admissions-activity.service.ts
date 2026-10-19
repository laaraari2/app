import { auditService } from '../../../../services/audit.service';
import { AuditLog } from '../../../../types/auth';

export class AdmissionsActivityService {
  public async getEntityActivityTimeline(tenantId: string, resourceId?: string): Promise<AuditLog[]> {
    const logs = await auditService.getLogs(tenantId);
    return logs.filter(log => {
      const isAdmissions =
        log.resource.startsWith('admissions:') ||
        log.action.startsWith('ADMISSION_') ||
        log.action.startsWith('APPLICANT_') ||
        log.action.startsWith('REGISTRATION_PERIOD_') ||
        log.action.startsWith('WAITING_LIST_');

      if (!isAdmissions) return false;
      if (resourceId) {
        return log.targetId === resourceId || log.resource === resourceId;
      }
      return true;
    });
  }
}

export const admissionsActivityService = new AdmissionsActivityService();
