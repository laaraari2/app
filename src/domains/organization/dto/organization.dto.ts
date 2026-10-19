import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.string().optional().transform(v => (v ? parseInt(v, 10) : 1)),
  limit: z.string().optional().transform(v => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  includeDeleted: z.string().optional().transform(v => v === 'true'),
  academicYearId: z.string().optional(),
  campusId: z.string().optional(),
  buildingId: z.string().optional(),
  floorId: z.string().optional(),
  roomType: z.string().optional(),
});

export const createSchoolSchema = z.object({
  name: z.string().min(2, 'School name must be at least 2 characters'),
  code: z.string().min(2, 'School code must be at least 2 characters'),
  legalName: z.string().optional(),
  slogan: z.string().optional(),
  taxId: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  logoUrl: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  academicYearId: z.string().optional(),
});

export const updateSchoolSchema = createSchoolSchema.partial();

export const createCampusSchema = z.object({
  name: z.string().min(2, 'Campus name must be at least 2 characters'),
  code: z.string().min(2, 'Campus code must be at least 2 characters'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  principalName: z.string().optional(),
  isMain: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'UNDER_MAINTENANCE']).optional(),
  academicYearId: z.string().optional(),
});

export const updateCampusSchema = createCampusSchema.partial();

export const createBuildingSchema = z.object({
  campusId: z.string().min(1, 'Campus ID is required'),
  name: z.string().min(2, 'Building name must be at least 2 characters'),
  code: z.string().min(1, 'Building code is required'),
  totalFloors: z.number().int().min(1).optional().default(1),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'UNDER_MAINTENANCE']).optional(),
  academicYearId: z.string().optional(),
});

export const updateBuildingSchema = createBuildingSchema.partial();

export const createFloorSchema = z.object({
  campusId: z.string().min(1, 'Campus ID is required'),
  buildingId: z.string().min(1, 'Building ID is required'),
  name: z.string().min(1, 'Floor name is required'),
  floorNumber: z.number().int(),
  description: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  academicYearId: z.string().optional(),
});

export const updateFloorSchema = createFloorSchema.partial();

export const createRoomSchema = z.object({
  campusId: z.string().min(1, 'Campus ID is required'),
  buildingId: z.string().min(1, 'Building ID is required'),
  floorId: z.string().min(1, 'Floor ID is required'),
  name: z.string().min(1, 'Room name is required'),
  code: z.string().min(1, 'Room code is required'),
  roomType: z.enum(['CLASSROOM', 'LAB', 'AMPHITHEATER', 'SPORTS', 'OFFICE', 'LIBRARY', 'AUDITORIUM']).optional().default('CLASSROOM'),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').optional().default(30),
  facilities: z.array(z.string()).optional().default([]),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'ARCHIVED']).optional().default('AVAILABLE'),
  academicYearId: z.string().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const bulkOperationSchema = z.object({
  ids: z.array(z.string()).min(1, 'At least one ID is required'),
  action: z.enum(['delete', 'restore', 'archive', 'activate']),
  status: z.string().optional(),
});
