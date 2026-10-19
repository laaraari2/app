import { academicYearRepository } from '../../infrastructure/persistence/academic-year.repository';
import { academicTermRepository } from '../../infrastructure/persistence/academic-term.repository';
import { educationalStageRepository } from '../../infrastructure/persistence/educational-stage.repository';
import { gradeLevelRepository } from '../../infrastructure/persistence/grade-level.repository';
import { classGroupRepository } from '../../infrastructure/persistence/class-group.repository';
import { subjectCategoryRepository } from '../../infrastructure/persistence/subject-category.repository';
import { subjectRepository } from '../../infrastructure/persistence/subject.repository';
import { curriculumRepository } from '../../infrastructure/persistence/curriculum.repository';
import { teachingAssignmentRepository } from '../../infrastructure/persistence/teaching-assignment.repository';
import { timetableSlotRepository } from '../../infrastructure/persistence/timetable-slot.repository';
import { schoolCalendarRepository } from '../../infrastructure/persistence/school-calendar.repository';
import { academicEventRepository } from '../../infrastructure/persistence/academic-event.repository';

export type AcademicEntityType =
  | 'academic_year'
  | 'academic_term'
  | 'educational_stage'
  | 'grade_level'
  | 'class_group'
  | 'subject_category'
  | 'subject'
  | 'curriculum'
  | 'teaching_assignment'
  | 'timetable_slot'
  | 'school_calendar'
  | 'academic_event';

export type BulkAction = 'delete' | 'restore' | 'archive';

export interface BulkOperationResult {
  successCount: number;
  failedCount: number;
  errors: string[];
}

export class AcademicBulkService {
  private getRepository(entityType: AcademicEntityType): any {
    switch (entityType) {
      case 'academic_year': return academicYearRepository;
      case 'academic_term': return academicTermRepository;
      case 'educational_stage': return educationalStageRepository;
      case 'grade_level': return gradeLevelRepository;
      case 'class_group': return classGroupRepository;
      case 'subject_category': return subjectCategoryRepository;
      case 'subject': return subjectRepository;
      case 'curriculum': return curriculumRepository;
      case 'teaching_assignment': return teachingAssignmentRepository;
      case 'timetable_slot': return timetableSlotRepository;
      case 'school_calendar': return schoolCalendarRepository;
      case 'academic_event': return academicEventRepository;
      default: throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  public async executeBulkOperation(
    tenantId: string,
    entityType: AcademicEntityType,
    payload: { ids: string[]; action: BulkAction },
    actorId?: string
  ): Promise<BulkOperationResult> {
    const repo = this.getRepository(entityType);
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const id of payload.ids) {
      try {
        if (payload.action === 'delete') {
          const ok = await repo.softDelete(id, tenantId, actorId);
          if (ok) successCount++;
          else { failedCount++; errors.push(`Entity ${id} not found`); }
        } else if (payload.action === 'restore') {
          const ok = await repo.restore(id, tenantId, actorId);
          if (ok) successCount++;
          else { failedCount++; errors.push(`Entity ${id} not found`); }
        } else if (payload.action === 'archive') {
          const ok = await repo.archive(id, tenantId, actorId);
          if (ok) successCount++;
          else { failedCount++; errors.push(`Entity ${id} not found`); }
        }
      } catch (err: any) {
        failedCount++;
        errors.push(`Failed on ${id}: ${err.message}`);
      }
    }

    return { successCount, failedCount, errors };
  }
}

export const academicBulkService = new AcademicBulkService();
