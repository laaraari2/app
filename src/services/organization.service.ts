import { organizationRepository } from '../repositories/organization.repository';
import { tenantRepository } from '../repositories/tenant.repository';
import { Campus, Building, Floor, Room, OrganizationTree, CampusStatus, RoomType, RoomStatus } from '../types/organization';
import { NotFoundError, ConflictError } from '../errors/AppError';

export class OrganizationService {
  // --- Campuses ---
  public async getCampuses(tenantId: string): Promise<Campus[]> {
    return organizationRepository.findCampuses(tenantId);
  }

  public async getCampusById(id: string, tenantId: string): Promise<Campus> {
    const campus = await organizationRepository.findCampusById(id, tenantId);
    if (!campus) {
      throw new NotFoundError('Campus');
    }
    return campus;
  }

  public async createCampus(
    tenantId: string,
    data: {
      name: string;
      code: string;
      address?: string;
      city?: string;
      phone?: string;
      email?: string;
      principalName?: string;
      isMain?: boolean;
      status?: CampusStatus;
    }
  ): Promise<Campus> {
    const existingList = await organizationRepository.findCampuses(tenantId);
    const codeConflict = existingList.find(c => c.code.toUpperCase() === data.code.toUpperCase());
    if (codeConflict) {
      throw new ConflictError(`Campus code '${data.code}' already exists`);
    }

    const isMain = data.isMain !== undefined ? data.isMain : existingList.length === 0;

    return organizationRepository.createCampus({
      tenantId,
      name: data.name,
      code: data.code.toUpperCase(),
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
      principalName: data.principalName,
      isMain,
      status: data.status || 'ACTIVE',
    });
  }

  public async updateCampus(id: string, tenantId: string, updates: Partial<Omit<Campus, 'id' | 'tenantId' | 'createdAt'>>): Promise<Campus> {
    const updated = await organizationRepository.updateCampus(id, tenantId, updates);
    if (!updated) {
      throw new NotFoundError('Campus');
    }
    return updated;
  }

  public async deleteCampus(id: string, tenantId: string): Promise<void> {
    const success = await organizationRepository.deleteCampus(id, tenantId);
    if (!success) {
      throw new NotFoundError('Campus');
    }
  }

  // --- Buildings ---
  public async getBuildings(tenantId: string, campusId?: string): Promise<Building[]> {
    return organizationRepository.findBuildings(tenantId, campusId);
  }

  public async getBuildingById(id: string, tenantId: string): Promise<Building> {
    const building = await organizationRepository.findBuildingById(id, tenantId);
    if (!building) {
      throw new NotFoundError('Building');
    }
    return building;
  }

  public async createBuilding(
    tenantId: string,
    data: {
      campusId: string;
      name: string;
      code: string;
      totalFloors?: number;
      description?: string;
    }
  ): Promise<Building> {
    await this.getCampusById(data.campusId, tenantId); // verify campus exists

    const existingBuildings = await organizationRepository.findBuildings(tenantId, data.campusId);
    if (existingBuildings.some(b => b.code.toUpperCase() === data.code.toUpperCase())) {
      throw new ConflictError(`Building code '${data.code}' already exists in this campus`);
    }

    return organizationRepository.createBuilding({
      tenantId,
      campusId: data.campusId,
      name: data.name,
      code: data.code.toUpperCase(),
      totalFloors: data.totalFloors || 1,
      description: data.description,
    });
  }

  public async updateBuilding(id: string, tenantId: string, updates: Partial<Omit<Building, 'id' | 'tenantId' | 'createdAt'>>): Promise<Building> {
    const updated = await organizationRepository.updateBuilding(id, tenantId, updates);
    if (!updated) {
      throw new NotFoundError('Building');
    }
    return updated;
  }

  public async deleteBuilding(id: string, tenantId: string): Promise<void> {
    const success = await organizationRepository.deleteBuilding(id, tenantId);
    if (!success) {
      throw new NotFoundError('Building');
    }
  }

  // --- Floors ---
  public async getFloors(tenantId: string, buildingId?: string): Promise<Floor[]> {
    return organizationRepository.findFloors(tenantId, buildingId);
  }

  public async getFloorById(id: string, tenantId: string): Promise<Floor> {
    const floor = await organizationRepository.findFloorById(id, tenantId);
    if (!floor) {
      throw new NotFoundError('Floor');
    }
    return floor;
  }

  public async createFloor(
    tenantId: string,
    data: {
      buildingId: string;
      campusId: string;
      name: string;
      floorNumber: number;
      description?: string;
    }
  ): Promise<Floor> {
    await this.getBuildingById(data.buildingId, tenantId);

    return organizationRepository.createFloor({
      tenantId,
      buildingId: data.buildingId,
      campusId: data.campusId,
      name: data.name,
      floorNumber: data.floorNumber,
      description: data.description,
    });
  }

  public async updateFloor(id: string, tenantId: string, updates: Partial<Omit<Floor, 'id' | 'tenantId' | 'createdAt'>>): Promise<Floor> {
    const updated = await organizationRepository.updateFloor(id, tenantId, updates);
    if (!updated) {
      throw new NotFoundError('Floor');
    }
    return updated;
  }

  public async deleteFloor(id: string, tenantId: string): Promise<void> {
    const success = await organizationRepository.deleteFloor(id, tenantId);
    if (!success) {
      throw new NotFoundError('Floor');
    }
  }

  // --- Rooms ---
  public async getRooms(tenantId: string, filters?: { campusId?: string; buildingId?: string; floorId?: string; academicYearId?: string }): Promise<Room[]> {
    return organizationRepository.findRooms(tenantId, filters);
  }

  public async getRoomById(id: string, tenantId: string): Promise<Room> {
    const room = await organizationRepository.findRoomById(id, tenantId);
    if (!room) {
      throw new NotFoundError('Room');
    }
    return room;
  }

  public async createRoom(
    tenantId: string,
    data: {
      campusId: string;
      buildingId: string;
      floorId: string;
      name: string;
      code: string;
      roomType?: RoomType;
      capacity?: number;
      facilities?: string[];
      status?: RoomStatus;
      academicYearId?: string;
    }
  ): Promise<Room> {
    await this.getFloorById(data.floorId, tenantId);

    const existingRooms = await organizationRepository.findRooms(tenantId, { buildingId: data.buildingId });
    if (existingRooms.some(r => r.code.toUpperCase() === data.code.toUpperCase())) {
      throw new ConflictError(`Room code '${data.code}' already exists in this building`);
    }

    return organizationRepository.createRoom({
      tenantId,
      campusId: data.campusId,
      buildingId: data.buildingId,
      floorId: data.floorId,
      name: data.name,
      code: data.code.toUpperCase(),
      roomType: data.roomType || 'CLASSROOM',
      capacity: data.capacity || 30,
      facilities: data.facilities || [],
      status: data.status || 'AVAILABLE',
      academicYearId: data.academicYearId,
    });
  }

  public async updateRoom(id: string, tenantId: string, updates: Partial<Omit<Room, 'id' | 'tenantId' | 'createdAt'>>): Promise<Room> {
    const updated = await organizationRepository.updateRoom(id, tenantId, updates);
    if (!updated) {
      throw new NotFoundError('Room');
    }
    return updated;
  }

  public async deleteRoom(id: string, tenantId: string): Promise<void> {
    const success = await organizationRepository.deleteRoom(id, tenantId);
    if (!success) {
      throw new NotFoundError('Room');
    }
  }

  // --- Organization Hierarchy Tree ---
  public async getOrganizationTree(tenantId: string): Promise<OrganizationTree> {
    const tenant = await tenantRepository.findById(tenantId);
    const schoolName = tenant ? tenant.name : 'School Workspace';
    return organizationRepository.getOrganizationTree(tenantId, schoolName);
  }
}

export const organizationService = new OrganizationService();
