import { applicantService } from './applicant.service';
import { applicantRepository } from '../../infrastructure/persistence/applicant.repository';
import { CreateApplicantDto } from '../../dto/admissions.dto';
import { auditService } from '../../../../services/audit.service';

export class AdmissionsImportExportService {
  public async importApplicantsCsv(
    tenantId: string,
    csvContent: string,
    campaignId: string,
    periodId: string,
    academicYearId: string,
    targetGradeId: string,
    userId?: string,
    userEmail?: string
  ): Promise<{ importedCount: number; errors: string[] }> {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) {
      return { importedCount: 0, errors: ['CSV file is empty or missing header.'] };
    }

    const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows = lines.slice(1);

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const line = rows[i];
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const rowData: Record<string, string> = {};
      header.forEach((col, idx) => {
        rowData[col] = values[idx] || '';
      });

      try {
        const dto: CreateApplicantDto = {
          campaignId,
          periodId,
          academicYearId,
          targetGradeId,
          firstName: rowData.firstName || rowData['Prénom'] || 'Inconnu',
          lastName: rowData.lastName || rowData['Nom'] || 'Inconnu',
          dateOfBirth: rowData.dateOfBirth || rowData['Date de Naissance'] || '2015-01-01',
          gender: (rowData.gender?.toUpperCase() as any) || 'MALE',
          nationality: rowData.nationality || rowData['Nationalité'] || 'Marocaine',
          nationalId: rowData.nationalId || rowData['CIN'],
          email: rowData.email || rowData['Email'],
          phone: rowData.phone || rowData['Téléphone'],
          currentSchool: rowData.currentSchool || rowData['Ancienne École'],
          guardians: [
            {
              relation: 'GUARDIAN',
              fullName: rowData.guardianName || rowData['Tuteur'] || 'Tuteur Légal',
              phone: rowData.guardianPhone || rowData['Tél Tuteur'] || '0600000000',
              email: rowData.guardianEmail,
              isPrimary: true,
            },
          ],
        };

        await applicantService.createApplicant(tenantId, dto, userId, userEmail);
        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 2}: ${err.message || 'Validation error'}`);
      }
    }

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANTS_CSV_IMPORT',
      resource: 'admissions:import',
      resourceId: campaignId,
      details: { importedCount, errorCount: errors.length },
    });

    return { importedCount, errors };
  }

  public async exportApplicantsCsv(tenantId: string, campaignId?: string): Promise<string> {
    const res = await applicantRepository.getPaginated(tenantId, {
      campaignId,
      limit: 10000,
    });

    const headers = [
      'applicationNumber',
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'nationality',
      'nationalId',
      'email',
      'phone',
      'status',
      'submittedAt',
    ];

    const rows = res.data.map(a => [
      a.applicationNumber,
      `"${a.firstName}"`,
      `"${a.lastName}"`,
      a.dateOfBirth ? new Date(a.dateOfBirth).toISOString().split('T')[0] : '',
      a.gender,
      `"${a.nationality}"`,
      a.nationalId || '',
      a.email || '',
      a.phone || '',
      a.status,
      a.submittedAt ? new Date(a.submittedAt).toISOString() : '',
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export const admissionsImportExportService = new AdmissionsImportExportService();
