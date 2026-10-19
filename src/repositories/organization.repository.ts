import { db } from '../db/store';
import { Campus, Building, Floor, Room, OrganizationTree, School, CampusStatus, RoomType, RoomStatus } from '../types/organization';

export class OrganizationRepository {
  // --- School ---
  public async findSchoolByTenant(tenantId: string): Promise<School | null> {
    const list = Array.from(db.schools.values()).filter(s => s.tenantId === tenantId && !s.isDeleted);
    return list[0] || null;
  }

  // --- Campuses ---
  public async findCampuses(tenantId: string): Promise<Campus[]> {
    return Array.from(db.campuses.values()).filter(c => c.tenantId === tenantId && !c.isDeleted);
  }

  public async findCampusById(id: string, tenantId: string): Promise<Campus | null> {
    const campus = db.campuses.get(id);
    return campus && campus.tenantId === tenantId && !campus.isDeleted ? campus : null;
  }

  public async createCampus(data: Omit<Campus, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'> & { id?: string; isDeleted?: boolean }): Promise<Campus> {
    const id = data.id || `campus_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const campus: Campus = { ...data, id, isDeleted: data.isDeleted || false, createdAt: now, updatedAt: now };
    db.campuses.set(id, campus);
    return campus;
  }

  public async updateCampus(id: string, tenantId: string, updates: Partial<Omit<Campus, 'id' | 'tenantId' | 'createdAt'>>): Promise<Campus | null> {
    const campus = await this.findCampusById(id, tenantId);
    if (!campus) return null;
    const updated = { ...campus, ...updates, updatedAt: new Date() };
    db.campuses.set(id, updated);
    return updated;
  }

  public async deleteCampus(id: string, tenantId: string): Promise<boolean> {
    const campus = await this.findCampusById(id, tenantId);
    if (!campus) return false;
    db.campuses.set(id, { ...campus, isDeleted: true, deletedAt: new Date() });
    return true;
  }

  // --- Buildings ---
  public async findBuildings(tenantId: string, campusId?: string): Promise<Building[]> {
    return Array.from(db.buildings.values()).filter(
      b => b.tenantId === tenantId && !b.isDeleted && (!campusId || b.campusId === campusId)
    );
  }

  public async findBuildingById(id: string, tenantId: string): Promise<Building | null> {
    const building = db.buildings.get(id);
    return building && building.tenantId === tenantId && !building.isDeleted ? building : null;
  }

  public async createBuilding(data: Omit<Building, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'status'> & { id?: string; isDeleted?: boolean; status?: CampusStatus }): Promise<Building> {
    const id = data.id || `bldg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const building: Building = { ...data, id, isDeleted: data.isDeleted || false, status: data.status || 'ACTIVE', createdAt: now, updatedAt: now };
    db.buildings.set(id, building);
    return building;
  }

  public async updateBuilding(id: string, tenantId: string, updates: Partial<Omit<Building, 'id' | 'tenantId' | 'createdAt'>>): Promise<Building | null> {
    const building = await this.findBuildingById(id, tenantId);
    if (!building) return null;
    const updated = { ...building, ...updates, updatedAt: new Date() };
    db.buildings.set(id, updated);
    return updated;
  }

  public async deleteBuilding(id: string, tenantId: string): Promise<boolean> {
    const building = await this.findBuildingById(id, tenantId);
    if (!building) return false;
    db.buildings.set(id, { ...building, isDeleted: true, deletedAt: new Date() });
    return true;
  }

  // --- Floors ---
  public async findFloors(tenantId: string, buildingId?: string): Promise<Floor[]> {
    return Array.from(db.floors.values()).filter(
      f => f.tenantId === tenantId && !f.isDeleted && (!buildingId || f.buildingId === buildingId)
    );
  }

  public async findFloorById(id: string, tenantId: string): Promise<Floor | null> {
    const floor = db.floors.get(id);
    return floor && floor.tenantId === tenantId && !floor.isDeleted ? floor : null;
  }

  public async createFloor(data: Omit<Floor, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'status'> & { id?: string; isDeleted?: boolean; status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' }): Promise<Floor> {
    const id = data.id || `floor_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const floor: Floor = { ...data, id, isDeleted: data.isDeleted || false, status: data.status || 'ACTIVE', createdAt: now, updatedAt: now };
    db.floors.set(id, floor);
    return floor;
  }

  public async updateFloor(id: string, tenantId: string, updates: Partial<Omit<Floor, 'id' | 'tenantId' | 'createdAt'>>): Promise<Floor | null> {
    const floor = await this.findFloorById(id, tenantId);
    if (!floor) return null;
    const updated = { ...floor, ...updates, updatedAt: new Date() };
    db.floors.set(id, updated);
    return updated;
  }

  public async deleteFloor(id: string, tenantId: string): Promise<boolean> {
    const floor = await this.findFloorById(id, tenantId);
    if (!floor) return false;
    db.floors.set(id, { ...floor, isDeleted: true, deletedAt: new Date() });
    return true;
  }

  // --- Rooms ---
  public async findRooms(tenantId: string, filters?: { campusId?: string; buildingId?: string; floorId?: string; academicYearId?: string }): Promise<Room[]> {
    return Array.from(db.rooms.values()).filter(r => {
      if (r.tenantId !== tenantId || r.isDeleted) return false;
      if (filters?.campusId && r.campusId !== filters.campusId) return false;
      if (filters?.buildingId && r.buildingId !== filters.buildingId) return false;
      if (filters?.floorId && r.floorId !== filters.floorId) return false;
      if (filters?.academicYearId && r.academicYearId !== filters.academicYearId) return false;
      return true;
    });
  }

  public async findRoomById(id: string, tenantId: string): Promise<Room | null> {
    const room = db.rooms.get(id);
    return room && room.tenantId === tenantId && !room.isDeleted ? room : null;
  }

  public async createRoom(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'> & { id?: string; isDeleted?: boolean }): Promise<Room> {
    const id = data.id || `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const room: Room = { ...data, id, isDeleted: data.isDeleted || false, createdAt: now, updatedAt: now };
    db.rooms.set(id, room);
    return room;
  }

  public async updateRoom(id: string, tenantId: string, updates: Partial<Omit<Room, 'id' | 'tenantId' | 'createdAt'>>): Promise<Room | null> {
    const room = await this.findRoomById(id, tenantId);
    if (!room) return null;
    const updated = { ...room, ...updates, updatedAt: new Date() };
    db.rooms.set(id, updated);
    return updated;
  }

  public async deleteRoom(id: string, tenantId: string): Promise<boolean> {
    const room = await this.findRoomById(id, tenantId);
    if (!room) return false;
    db.rooms.set(id, { ...room, isDeleted: true, deletedAt: new Date() });
    return true;
  }

  // --- Full Organization Hierarchy Tree ---
  public async getOrganizationTree(tenantId: string, schoolName: string): Promise<OrganizationTree> {
    const school = await this.findSchoolByTenant(tenantId);
    const campuses = await this.findCampuses(tenantId);
    const buildings = await this.findBuildings(tenantId);
    const floors = await this.findFloors(tenantId);
    const rooms = await this.findRooms(tenantId);

    const campusTree = campuses.map(campus => {
      const campusBuildings = buildings.filter(b => b.campusId === campus.id).map(building => {
        const buildingFloors = floors.filter(f => f.buildingId === building.id).map(floor => {
          const floorRooms = rooms.filter(r => r.floorId === floor.id);
          return { ...floor, rooms: floorRooms };
        });
        return { ...building, floors: buildingFloors };
      });
      return { ...campus, buildings: campusBuildings };
    });

    return {
      schoolName: school ? school.name : schoolName,
      tenantId,
      school: school || undefined,
      campuses: campusTree,
    };
  }
}

export const organizationRepository = new OrganizationRepository();
