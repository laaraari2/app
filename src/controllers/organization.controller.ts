import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { organizationService } from '../services/organization.service';

export class OrganizationController {
  // Hierarchy Tree View
  public async getOrganizationTree(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const tree = await organizationService.getOrganizationTree(tenantId);
    res.json({ success: true, data: tree });
  }

  // --- Campuses ---
  public async getCampuses(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const campuses = await organizationService.getCampuses(tenantId);
    res.json({ success: true, data: campuses });
  }

  public async getCampusById(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const campus = await organizationService.getCampusById(req.params.id, tenantId);
    res.json({ success: true, data: campus });
  }

  public async createCampus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const campus = await organizationService.createCampus(tenantId, req.body);
    res.status(201).json({ success: true, data: campus, message: 'Campus created successfully' });
  }

  public async updateCampus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const campus = await organizationService.updateCampus(req.params.id, tenantId, req.body);
    res.json({ success: true, data: campus, message: 'Campus updated successfully' });
  }

  public async deleteCampus(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    await organizationService.deleteCampus(req.params.id, tenantId);
    res.json({ success: true, message: 'Campus deleted successfully' });
  }

  // --- Buildings ---
  public async getBuildings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const campusId = req.query.campusId as string;
    const buildings = await organizationService.getBuildings(tenantId, campusId);
    res.json({ success: true, data: buildings });
  }

  public async createBuilding(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const building = await organizationService.createBuilding(tenantId, req.body);
    res.status(201).json({ success: true, data: building, message: 'Building created successfully' });
  }

  public async updateBuilding(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const building = await organizationService.updateBuilding(req.params.id, tenantId, req.body);
    res.json({ success: true, data: building, message: 'Building updated successfully' });
  }

  public async deleteBuilding(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    await organizationService.deleteBuilding(req.params.id, tenantId);
    res.json({ success: true, message: 'Building deleted successfully' });
  }

  // --- Floors ---
  public async getFloors(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const buildingId = req.query.buildingId as string;
    const floors = await organizationService.getFloors(tenantId, buildingId);
    res.json({ success: true, data: floors });
  }

  public async createFloor(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const floor = await organizationService.createFloor(tenantId, req.body);
    res.status(201).json({ success: true, data: floor, message: 'Floor created successfully' });
  }

  public async updateFloor(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const floor = await organizationService.updateFloor(req.params.id, tenantId, req.body);
    res.json({ success: true, data: floor, message: 'Floor updated successfully' });
  }

  public async deleteFloor(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    await organizationService.deleteFloor(req.params.id, tenantId);
    res.json({ success: true, message: 'Floor deleted successfully' });
  }

  // --- Rooms ---
  public async getRooms(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const filters = {
      campusId: req.query.campusId as string,
      buildingId: req.query.buildingId as string,
      floorId: req.query.floorId as string,
      academicYearId: req.query.academicYearId as string,
    };
    const rooms = await organizationService.getRooms(tenantId, filters);
    res.json({ success: true, data: rooms });
  }

  public async createRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const room = await organizationService.createRoom(tenantId, req.body);
    res.status(201).json({ success: true, data: room, message: 'Room created successfully' });
  }

  public async updateRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    const room = await organizationService.updateRoom(req.params.id, tenantId, req.body);
    res.json({ success: true, data: room, message: 'Room updated successfully' });
  }

  public async deleteRoom(req: AuthenticatedRequest, res: Response): Promise<void> {
    const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
    await organizationService.deleteRoom(req.params.id, tenantId);
    res.json({ success: true, message: 'Room deleted successfully' });
  }
}

export const organizationController = new OrganizationController();
