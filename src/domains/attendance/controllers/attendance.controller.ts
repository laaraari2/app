import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { attendanceService } from '../application/services/attendance.service';

export class AttendanceController {
  private getTenantId(req: AuthenticatedRequest): string {
    return req.tenantContext?.tenantId || req.user?.tenantId || '';
  }

  private getActorId(req: AuthenticatedRequest): string {
    return req.user?.id || 'system';
  }

  public recordAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const actorId = this.getActorId(req);

      await attendanceService.recordAttendance({
        ...req.body,
        tenantId,
        date: new Date(req.body.date),
        actorId,
      });

      res.status(201).json({
        status: 'success',
        message: 'Attendance register recorded successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  public correctAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const actorId = this.getActorId(req);

      await attendanceService.correctAttendance({
        ...req.body,
        tenantId,
        actorId,
      });

      res.json({
        status: 'success',
        message: 'Attendance record status corrected successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  public approveRegister = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const actorId = this.getActorId(req);

      await attendanceService.approveAttendance({
        tenantId,
        registerId: req.params.registerId || req.body.registerId,
        actorId,
      });

      res.json({
        status: 'success',
        message: 'Attendance register approved successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  public getRegisters = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const classGroupId = req.query.classGroupId as string;

      let registers;
      if (classGroupId) {
        registers = await attendanceService.getRegistersByClass(classGroupId, tenantId);
      } else {
        registers = await attendanceService.getRegistersByTenant(tenantId);
      }

      res.json({ status: 'success', data: registers });
    } catch (err) {
      next(err);
    }
  };

  public getRegisterById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const register = await attendanceService.getRegisterById(req.params.id);
      res.json({ status: 'success', data: register });
    } catch (err) {
      next(err);
    }
  };

  public getStudentAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const records = await attendanceService.getStudentAttendance(req.params.studentId);
      res.json({ status: 'success', data: records });
    } catch (err) {
      next(err);
    }
  };

  public getRecordHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const history = await attendanceService.getRecordHistory(req.params.recordId);
      res.json({ status: 'success', data: history });
    } catch (err) {
      next(err);
    }
  };

  public getStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = this.getTenantId(req);
      const stats = await attendanceService.getAttendanceStats(tenantId);
      res.json({ status: 'success', data: stats });
    } catch (err) {
      next(err);
    }
  };
}

export const attendanceController = new AttendanceController();
