export type CampusStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'UNDER_MAINTENANCE';
export type RoomType = 'CLASSROOM' | 'LAB' | 'AMPHITHEATER' | 'SPORTS' | 'OFFICE' | 'LIBRARY' | 'AUDITORIUM';
export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'ARCHIVED';
export type EntityStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'UNDER_MAINTENANCE' | 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface BaseOrganizationEntity {
  id: string; // UUID
  tenantId: string; // UUID
  academicYearId?: string; // Academic year scope when applicable
  createdBy?: string;
  updatedBy?: string;
  isDeleted: boolean; // Soft delete flag
  deletedAt?: Date | string;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface School extends BaseOrganizationEntity {
  name: string;
  code: string;
  legalName?: string;
  slogan?: string;
  taxId?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface Campus extends BaseOrganizationEntity {
  name: string; // e.g. "Campus Principal Gueliz"
  code: string; // e.g. "CPG"
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  principalName?: string;
  isMain: boolean;
  status: CampusStatus;
}

export interface Building extends BaseOrganizationEntity {
  campusId: string;
  name: string; // e.g. "Bâtiment A - Sciences"
  code: string; // e.g. "BAT-A"
  totalFloors: number;
  description?: string;
  status: CampusStatus;
}

export interface Floor extends BaseOrganizationEntity {
  buildingId: string;
  campusId: string;
  name: string; // e.g. "1er Étage"
  floorNumber: number; // e.g. 1 (0 for RDC)
  description?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface Room extends BaseOrganizationEntity {
  campusId: string;
  buildingId: string;
  floorId: string;
  name: string; // e.g. "Salle 101"
  code: string; // e.g. "S101"
  roomType: RoomType;
  capacity: number;
  facilities: string[]; // e.g. ['Projector', 'AirCon', 'SmartBoard']
  status: RoomStatus;
}

export interface OrganizationTree {
  schoolName: string;
  tenantId: string;
  school?: School;
  campuses: Array<Campus & {
    buildings: Array<Building & {
      floors: Array<Floor & {
        rooms: Room[];
      }>;
    }>;
  }>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
  academicYearId?: string;
  campusId?: string;
  buildingId?: string;
  floorId?: string;
  roomType?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BulkOperationDTO {
  ids: string[];
  action: 'delete' | 'restore' | 'archive' | 'activate';
  status?: string;
}

export interface BulkOperationResult {
  successCount: number;
  failureCount: number;
  errors?: Array<{ id: string; error: string }>;
}

export interface ImportResult {
  importedCount: number;
  skippedCount: number;
  errors: Array<{ line: number; error: string }>;
}

export interface ActivityTimelineItem {
  id: string;
  tenantId: string;
  entityType: 'school' | 'campus' | 'building' | 'floor' | 'room';
  entityId: string;
  action: string;
  actorId?: string;
  actorEmail?: string;
  changes?: Record<string, any>;
  timestamp: Date;
}
