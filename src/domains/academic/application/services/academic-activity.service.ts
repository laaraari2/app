import { auditService } from '../../../../services/audit.service';
import { AuditLog } from '../../../../types/auth';

export class AcademicActivityService {
  public async getEntityActivityTimeline(tenantId: string, limit: number = 50): Promise<AuditLog[]> {
    const allLogs = await auditService.getTenantAuditLogs(tenantId, limit * 2);
    return allLogs
      .filter(l =>
        l.action.startsWith('ACADEMIC_') ||
        l.action.startsWith('EDUCATIONAL_') ||
        l.action.startsWith('GRADE_') ||
        l.action.startsWith('CLASS_') ||
        l.action.startsWith('SUBJECT_') ||
        l.action.startsWith('CURRICULUM_') ||
        l.action.startsWith('TEACHING_') ||
        l.action.startsWith('TIMETABLE_') ||
        l.action.startsWith('SCHOOL_CALENDAR_')
      )
      .slice(0, limit);
  }
}

export const academicActivityService = new AcademicActivityService();
