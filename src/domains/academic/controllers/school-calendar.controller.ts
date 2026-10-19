import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { schoolCalendarService } from '../application/services/school-calendar.service';

export class SchoolCalendarController {
  public async getCalendars(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        academicYearId: req.query.academicYearId as string,
        campusId: req.query.campusId as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await schoolCalendarService.getPaginatedCalendars(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getCalendarById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const cal = await schoolCalendarService.getCalendarById(req.params.id, tenantId);
      res.json({ status: 'success', data: cal });
    } catch (err) { next(err); }
  }

  public async createCalendar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const cal = await schoolCalendarService.createCalendar(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: cal, message: 'School Calendar created' });
    } catch (err) { next(err); }
  }

  public async updateCalendar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await schoolCalendarService.updateCalendar(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'School Calendar updated' });
    } catch (err) { next(err); }
  }

  public async deleteCalendar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await schoolCalendarService.softDeleteCalendar(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'School Calendar soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreCalendar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await schoolCalendarService.restoreCalendar(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'School Calendar restored' });
    } catch (err) { next(err); }
  }

  public async archiveCalendar(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await schoolCalendarService.archiveCalendar(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'School Calendar archived' });
    } catch (err) { next(err); }
  }
}

export const schoolCalendarController = new SchoolCalendarController();
