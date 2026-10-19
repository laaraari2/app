import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { timetableService } from '../application/services/timetable.service';

export class TimetableController {
  public async getSlots(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const options = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        classGroupId: req.query.classGroupId as string,
        academicYearId: req.query.academicYearId as string,
        campusId: req.query.campusId as string,
        teacherId: req.query.teacherId as string,
        includeDeleted: req.query.includeDeleted === 'true',
      };
      const result = await timetableService.getPaginatedSlots(tenantId, options);
      res.json({ status: 'success', ...result });
    } catch (err) { next(err); }
  }

  public async getSlotById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const slot = await timetableService.getSlotById(req.params.id, tenantId);
      res.json({ status: 'success', data: slot });
    } catch (err) { next(err); }
  }

  public async detectConflicts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const filter = {
        classGroupId: req.query.classGroupId as string,
        roomId: req.query.roomId as string,
        teacherId: req.query.teacherId as string,
        academicYearId: req.query.academicYearId as string,
      };
      const conflicts = await timetableService.detectConflicts(tenantId, filter);
      res.json({ status: 'success', data: conflicts, count: conflicts.length });
    } catch (err) { next(err); }
  }

  public async createSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const enforceNoConflicts = req.query.enforceConflicts !== 'false';
      const slot = await timetableService.createSlot(tenantId, req.body, enforceNoConflicts, req.user?.id, req.user?.email);
      res.status(201).json({ status: 'success', data: slot, message: 'Timetable Slot created' });
    } catch (err) { next(err); }
  }

  public async updateSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const updated = await timetableService.updateSlot(req.params.id, tenantId, req.body, req.user?.id, req.user?.email);
      res.json({ status: 'success', data: updated, message: 'Timetable Slot updated' });
    } catch (err) { next(err); }
  }

  public async deleteSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await timetableService.softDeleteSlot(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', message: 'Timetable Slot soft deleted' });
    } catch (err) { next(err); }
  }

  public async restoreSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const restored = await timetableService.restoreSlot(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: restored, message: 'Timetable Slot restored' });
    } catch (err) { next(err); }
  }

  public async archiveSlot(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const archived = await timetableService.archiveSlot(req.params.id, tenantId, req.user?.id);
      res.json({ status: 'success', data: archived, message: 'Timetable Slot archived' });
    } catch (err) { next(err); }
  }
}

export const timetableController = new TimetableController();
