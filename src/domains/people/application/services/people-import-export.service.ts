import { staffService } from './staff.service';
import { studentProfileService } from './student-profile.service';
import { guardianService } from './guardian.service';
import { StaffRole, EmploymentType, StaffStatus, StudentProfileStatus } from '../../domain/entities/people-types';

export class PeopleImportExportService {
  public async exportStaffToCsv(tenantId: string): Promise<string> {
    const staffList = await staffService.listStaff(tenantId);
    const headers = [
      'Employee ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'National ID',
      'Gender',
      'Date of Birth',
      'Job Title',
      'Department',
      'Role',
      'Employment Type',
      'Status',
      'Join Date',
    ];

    const rows = staffList.map((s) => [
      s.employeeId,
      `"${s.firstName.replace(/"/g, '""')}"`,
      `"${s.lastName.replace(/"/g, '""')}"`,
      s.email,
      s.phone,
      s.nationalId,
      s.gender,
      s.dateOfBirth instanceof Date ? s.dateOfBirth.toISOString().split('T')[0] : String(s.dateOfBirth),
      `"${s.jobTitle.replace(/"/g, '""')}"`,
      `"${s.department.replace(/"/g, '""')}"`,
      s.staffRole,
      s.employmentType,
      s.status,
      s.joinDate instanceof Date ? s.joinDate.toISOString().split('T')[0] : String(s.joinDate),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public async importStaffFromCsv(
    tenantId: string,
    csvContent: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<{ importedCount: number; errors: string[] }> {
    const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      return { importedCount: 0, errors: ['CSV file is empty or missing headers'] };
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());

      if (cols.length < 11) {
        errors.push(`Row ${i + 1}: Invalid column count`);
        continue;
      }

      const [
        firstName,
        lastName,
        email,
        phone,
        nationalId,
        genderStr,
        dobStr,
        jobTitle,
        department,
        roleStr,
        empTypeStr,
      ] = cols;

      try {
        await staffService.createStaff(
          {
            tenantId,
            firstName,
            lastName,
            email,
            phone,
            nationalId,
            gender: (genderStr.toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE') as 'MALE' | 'FEMALE',
            dateOfBirth: dobStr,
            jobTitle,
            department,
            staffRole: (roleStr.toUpperCase() as StaffRole) || 'TEACHER',
            employmentType: (empTypeStr.toUpperCase() as EmploymentType) || 'FULL_TIME',
            joinDate: new Date(),
          },
          actor
        );
        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    return { importedCount, errors };
  }

  public async exportStudentsToCsv(tenantId: string): Promise<string> {
    const studentList = await studentProfileService.listStudents(tenantId);
    const headers = [
      'Student Number',
      'First Name',
      'Last Name',
      'National ID',
      'Gender',
      'Date of Birth',
      'Blood Group',
      'Medical Notes',
      'Status',
      'Join Date',
    ];

    const rows = studentList.map((s) => [
      s.studentNumber,
      `"${s.firstName.replace(/"/g, '""')}"`,
      `"${s.lastName.replace(/"/g, '""')}"`,
      s.nationalId,
      s.gender,
      s.dateOfBirth instanceof Date ? s.dateOfBirth.toISOString().split('T')[0] : String(s.dateOfBirth),
      s.bloodGroup || '',
      `"${(s.medicalNotes || '').replace(/"/g, '""')}"`,
      s.status,
      s.joinDate instanceof Date ? s.joinDate.toISOString().split('T')[0] : String(s.joinDate),
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  public async importStudentsFromCsv(
    tenantId: string,
    campusId: string,
    csvContent: string,
    actor?: { userId: string; userEmail: string }
  ): Promise<{ importedCount: number; errors: string[] }> {
    const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      return { importedCount: 0, errors: ['CSV file is empty or missing headers'] };
    }

    let importedCount = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());

      if (cols.length < 5) {
        errors.push(`Row ${i + 1}: Invalid column count`);
        continue;
      }

      const [firstName, lastName, nationalId, genderStr, dobStr] = cols;

      try {
        await studentProfileService.createStudentProfile(
          {
            tenantId,
            campusId,
            firstName,
            lastName,
            nationalId,
            gender: (genderStr.toUpperCase() === 'FEMALE' ? 'FEMALE' : 'MALE') as 'MALE' | 'FEMALE',
            dateOfBirth: dobStr,
            joinDate: new Date(),
          },
          actor
        );
        importedCount++;
      } catch (err: any) {
        errors.push(`Row ${i + 1}: ${err.message}`);
      }
    }

    return { importedCount, errors };
  }
}

export const peopleImportExportService = new PeopleImportExportService();
