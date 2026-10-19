import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { staffService } from '../application/services/staff.service';
import { teacherService } from '../application/services/teacher.service';
import { studentProfileService } from '../application/services/student-profile.service';
import { guardianService } from '../application/services/guardian.service';
import { peopleImportExportService } from '../application/services/people-import-export.service';
import { peopleActivityService } from '../application/services/people-activity.service';

export class PeopleController {
  private getTenantId(req: AuthenticatedRequest): string {
    return req.tenantContext?.tenantId || req.user?.tenantId || '';
  }

  private getActor(req: AuthenticatedRequest) {
    return {
      userId: req.user?.id || 'system',
      userEmail: req.user?.email || 'system@eduvora.com',
    };
  }

  // --- STAFF ---
  public getStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const staffList = await staffService.listStaff(tenantId, {
        campusId: req.query.campusId as string,
        role: req.query.role as string,
        department: req.query.department as string,
        status: req.query.status as string,
        search: req.query.search as string,
      });
      res.json({ status: 'success', data: staffList });
    } catch (err) {
      next(err);
    }
  };

  public getStaffById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const staff = await staffService.getStaffById(tenantId, req.params.id);
      res.json({ status: 'success', data: staff });
    } catch (err) {
      next(err);
    }
  };

  public createStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const staff = await staffService.createStaff({ ...req.body, tenantId }, this.getActor(req));
      res.status(201).json({ status: 'success', data: staff });
    } catch (err) {
      next(err);
    }
  };

  public updateStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const updated = await staffService.updateStaff(tenantId, req.params.id, req.body, this.getActor(req));
      res.json({ status: 'success', data: updated });
    } catch (err) {
      next(err);
    }
  };

  public deleteStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      await staffService.softDeleteStaff(tenantId, req.params.id, this.getActor(req));
      res.json({ status: 'success', message: 'Staff member deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  public restoreStaff = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      await staffService.restoreStaff(tenantId, req.params.id, this.getActor(req));
      res.json({ status: 'success', message: 'Staff member restored successfully' });
    } catch (err) {
      next(err);
    }
  };

  public bulkStaffActions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const result = await staffService.bulkAction(tenantId, req.body, this.getActor(req));
      res.json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  };

  public getPayrollSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const summary = await staffService.calculatePayrollSummary(tenantId);
      res.json({ status: 'success', data: summary });
    } catch (err) {
      next(err);
    }
  };

  public getWorkCertificate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const cert = await staffService.getWorkCertificate(tenantId, req.params.id);
      res.json({ status: 'success', data: cert });
    } catch (err) {
      next(err);
    }
  };

  // --- TEACHERS ---
  public getTeachers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const teachers = await teacherService.listTeachers(tenantId, {
        subjectId: req.query.subjectId as string,
        campusId: req.query.campusId as string,
        search: req.query.search as string,
      });
      res.json({ status: 'success', data: teachers });
    } catch (err) {
      next(err);
    }
  };

  public getTeacherById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const teacher = await teacherService.getTeacherById(tenantId, req.params.id);
      res.json({ status: 'success', data: teacher });
    } catch (err) {
      next(err);
    }
  };

  public createTeacher = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const teacher = await teacherService.createTeacherProfile({ ...req.body, tenantId }, this.getActor(req));
      res.status(201).json({ status: 'success', data: teacher });
    } catch (err) {
      next(err);
    }
  };

  public updateTeacher = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const updated = await teacherService.updateTeacher(tenantId, req.params.id, req.body, this.getActor(req));
      res.json({ status: 'success', data: updated });
    } catch (err) {
      next(err);
    }
  };

  public deleteTeacher = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      await teacherService.softDeleteTeacher(tenantId, req.params.id, this.getActor(req));
      res.json({ status: 'success', message: 'Teacher profile deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  // --- STUDENTS ---
  public getStudents = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const students = await studentProfileService.listStudents(tenantId, {
        campusId: req.query.campusId as string,
        gradeLevelId: req.query.gradeLevelId as string,
        classGroupId: req.query.classGroupId as string,
        status: req.query.status as string,
        search: req.query.search as string,
      });
      res.json({ status: 'success', data: students });
    } catch (err) {
      next(err);
    }
  };

  public getStudentById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const student = await studentProfileService.getStudentById(tenantId, req.params.id);
      res.json({ status: 'success', data: student });
    } catch (err) {
      next(err);
    }
  };

  public createStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const student = await studentProfileService.createStudentProfile({ ...req.body, tenantId }, this.getActor(req));
      res.status(201).json({ status: 'success', data: student });
    } catch (err) {
      next(err);
    }
  };

  public updateStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const updated = await studentProfileService.updateStudent(tenantId, req.params.id, req.body, this.getActor(req));
      res.json({ status: 'success', data: updated });
    } catch (err) {
      next(err);
    }
  };

  public deleteStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      await studentProfileService.softDeleteStudent(tenantId, req.params.id, this.getActor(req));
      res.json({ status: 'success', message: 'Student profile deleted successfully' });
    } catch (err) {
      next(err);
    }
  };

  public restoreStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      await studentProfileService.restoreStudent(tenantId, req.params.id, this.getActor(req));
      res.json({ status: 'success', message: 'Student profile restored successfully' });
    } catch (err) {
      next(err);
    }
  };

  public bulkStudentActions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const result = await studentProfileService.bulkAction(tenantId, req.body, this.getActor(req));
      res.json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  };

  // --- GUARDIANS ---
  public getGuardians = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const guardians = await guardianService.listGuardians(tenantId, {
        search: req.query.search as string,
      });
      res.json({ status: 'success', data: guardians });
    } catch (err) {
      next(err);
    }
  };

  public getGuardianById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const guardian = await guardianService.getGuardianById(tenantId, req.params.id);
      res.json({ status: 'success', data: guardian });
    } catch (err) {
      next(err);
    }
  };

  public createGuardian = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const guardian = await guardianService.createGuardianProfile({ ...req.body, tenantId }, this.getActor(req));
      res.status(201).json({ status: 'success', data: guardian });
    } catch (err) {
      next(err);
    }
  };

  public updateGuardian = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const updated = await guardianService.updateGuardian(tenantId, req.params.id, req.body, this.getActor(req));
      res.json({ status: 'success', data: updated });
    } catch (err) {
      next(err);
    }
  };

  public linkGuardianStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const link = await guardianService.linkGuardianToStudent({ ...req.body, tenantId }, this.getActor(req));
      res.status(201).json({ status: 'success', data: link });
    } catch (err) {
      next(err);
    }
  };

  public unlinkGuardianStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const { guardianId, studentId } = req.params;
      await guardianService.unlinkGuardianFromStudent(tenantId, guardianId, studentId, this.getActor(req));
      res.json({ status: 'success', message: 'Guardian unlinked from student successfully' });
    } catch (err) {
      next(err);
    }
  };

  public getStudentGuardians = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const guardians = await guardianService.getGuardiansForStudent(tenantId, req.params.studentId);
      res.json({ status: 'success', data: guardians });
    } catch (err) {
      next(err);
    }
  };

  public getGuardianWards = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const wards = await guardianService.getWardsForGuardian(tenantId, req.params.guardianId);
      res.json({ status: 'success', data: wards });
    } catch (err) {
      next(err);
    }
  };

  // --- CSV IMPORT / EXPORT & TIMELINE ---
  public exportStaffCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const csv = await peopleImportExportService.exportStaffToCsv(tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="staff_export.csv"');
      res.send(csv);
    } catch (err) {
      next(err);
    }
  };

  public importStaffCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const { csvContent } = req.body;
      const result = await peopleImportExportService.importStaffFromCsv(tenantId, csvContent, this.getActor(req));
      res.json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  };

  public exportStudentsCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const csv = await peopleImportExportService.exportStudentsToCsv(tenantId);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="students_export.csv"');
      res.send(csv);
    } catch (err) {
      next(err);
    }
  };

  public importStudentsCsv = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const { campusId, csvContent } = req.body;
      const result = await peopleImportExportService.importStudentsFromCsv(
        tenantId,
        campusId,
        csvContent,
        this.getActor(req)
      );
      res.json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  };

  public getTimeline = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const logs = await peopleActivityService.getTimelineForTenant(tenantId, limit);
      res.json({ status: 'success', data: logs });
    } catch (err) {
      next(err);
    }
  };
}

export const peopleController = new PeopleController();
