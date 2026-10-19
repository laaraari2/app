import { subjectCategoryService } from './subject-category.service';
import { subjectService } from './subject.service';
import { educationalStageService } from './educational-stage.service';
import { gradeLevelService } from './grade-level.service';
import { classGroupService } from './class-group.service';
import { academicTermService } from './academic-term.service';
import { academicEventService } from './academic-event.service';

export class AcademicImportExportService {
  // CSV Import Subjects
  public async importSubjectsCsv(
    tenantId: string,
    csvContent: string,
    actorId?: string,
    actorEmail?: string
  ): Promise<{ importedCount: number; errors: string[] }> {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return { importedCount: 0, errors: ['CSV file is empty or missing header'] };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    let importedCount = 0;
    const errors: string[] = [];

    // Ensure default subject category exists
    const catRes = await subjectCategoryService.getPaginatedCategories(tenantId, { limit: 1 });
    let categoryId = catRes.data[0]?.id;
    if (!categoryId) {
      const newCat = await subjectCategoryService.createCategory(
        tenantId,
        { code: 'GEN', name: 'Général', description: 'Catégorie par défaut' },
        actorId,
        actorEmail
      );
      categoryId = newCat.id;
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 2) continue;

      const code = cols[0];
      const name = cols[1];
      const weeklyHours = cols[2] ? parseFloat(cols[2]) : 2;
      const credits = cols[3] ? parseFloat(cols[3]) : 1;

      try {
        await subjectService.createSubject(
          tenantId,
          {
            categoryId,
            code,
            name,
            weeklyHours,
            credits,
          },
          actorId,
          actorEmail
        );
        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 1} (${code}): ${err.message}`);
      }
    }

    return { importedCount, errors };
  }

  // CSV Export Subjects
  public async exportSubjectsCsv(tenantId: string): Promise<string> {
    const res = await subjectService.getPaginatedSubjects(tenantId, { limit: 1000 });
    const header = 'code,name,categoryId,weeklyHours,credits,passesThreshold,status';
    const rows = res.data.map(s =>
      `"${s.code}","${s.name}","${s.categoryId}",${s.weeklyHours || 2},${s.credits || 1},${s.passesThreshold || 10},"${s.status}"`
    );
    return [header, ...rows].join('\n');
  }

  // CSV Export Class Groups
  public async exportClassGroupsCsv(tenantId: string): Promise<string> {
    const res = await classGroupService.getPaginatedClassGroups(tenantId, { limit: 1000 });
    const header = 'code,name,gradeId,academicYearId,campusId,maxCapacity,status';
    const rows = res.data.map(c =>
      `"${c.code}","${c.name}","${c.gradeId}","${c.academicYearId}","${c.campusId || ''}",${c.maxCapacity},"${c.status}"`
    );
    return [header, ...rows].join('\n');
  }

  // CSV Export Educational Stages & Grade Levels
  public async exportGradeLevelsCsv(tenantId: string): Promise<string> {
    const res = await gradeLevelService.getPaginatedGradeLevels(tenantId, { limit: 1000 });
    const header = 'code,name,stageId,sequence,minAge,passingGrade,status';
    const rows = res.data.map(g =>
      `"${g.code}","${g.name}","${g.stageId}",${g.sequence},${g.minAge || ''},${g.passingGrade || 10},"${g.status}"`
    );
    return [header, ...rows].join('\n');
  }
}

export const academicImportExportService = new AcademicImportExportService();
