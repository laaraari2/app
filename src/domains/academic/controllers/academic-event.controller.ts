import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { academicEventService } from '../application/services/academic-event.service';

export class AcademicEventController {
  public async getEvents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        academicYearId: req.query.academicYearId as string,
        campusId: req.query.campusId as string,
        eventType: req.query.eventType as any,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await academicEventService.getPaginatedEvents(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getEventById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const event = await academicEventService.getEventById(req.params.id, tenantId);
      res.json({ status: 'success', data: event });
    } catch (err) { next(err); }
  }

  public async createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const event = await academicEventService.createEvent(tenantId, req.body, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: event, message: 'Academic Event created' });
    } catch (err) { next(err); }
  }

  public async updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await academicEventService.updateEvent(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Academic Event updated' });
    } catch (err) { next(err); }
  }

  public async deleteEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await academicEventService.softDeleteEvent(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Academic Event soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await academicEventService.restoreEvent(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Academic Event restored' });
    } catch (err) { next(err); }
  }

  public async archiveEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await academicEventService.archiveEvent(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Academic Event archived' });
    } catch (err) { next(err); }
  }
}

export const academicEventController = new AcademicEventController();
