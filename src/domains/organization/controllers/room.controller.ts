import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { roomService } from '../application/services/room.service';
import { createRoomSchema, updateRoomSchema, paginationQuerySchema } from '../dto/organization.dto';

export class RoomController {
  public listPaginated = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const query = paginationQuerySchema.parse(req.query);
      const result = await roomService.getPaginatedRooms(tenantId, query);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const room = await roomService.getRoomById(id, tenantId);
      res.json({ success: true, data: room });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = createRoomSchema.parse(req.body);
      const room = await roomService.createRoom(tenantId, validated, actorId, actorEmail);
      res.status(201).json({ success: true, data: room, message: 'Room created successfully' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const validated = updateRoomSchema.parse(req.body);
      const room = await roomService.updateRoom(id, tenantId, validated, actorId, actorEmail);
      res.json({ success: true, data: room, message: 'Room updated successfully' });
    } catch (error) {
      next(error);
    }
  };

  public softDelete = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      await roomService.softDeleteRoom(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Room soft deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  public restore = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      await roomService.restoreRoom(id, tenantId, actorId, actorEmail);
      res.json({ success: true, message: 'Room restored successfully' });
    } catch (error) {
      next(error);
    }
  };

  public archive = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { id } = req.params;
      const actorId = req.user?.id;
      const actorEmail = req.user?.email;

      const room = await roomService.archiveRoom(id, tenantId, actorId, actorEmail);
      res.json({ success: true, data: room, message: 'Room archived successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export const roomController = new RoomController();
