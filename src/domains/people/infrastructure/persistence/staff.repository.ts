import { db } from '../../../../db/store';
import { StaffMember } from '../../domain/entities/people-types';

export class StaffRepository {
  public async create(staff: StaffMember): Promise<StaffMember> {
    db.staffMembers.set(staff.id, staff);
    return staff;
  }

  public async findById(id: string): Promise<StaffMember | null> {
    const staff = db.staffMembers.get(id);
    if (!staff || staff.isDeleted) return null;
    return staff;
  }

  public async findByEmployeeId(tenantId: string, employeeId: string): Promise<StaffMember | null> {
    for (const staff of db.staffMembers.values()) {
      if (
        staff.tenantId === tenantId &&
        staff.employeeId.toLowerCase() === employeeId.toLowerCase() &&
        !staff.isDeleted
      ) {
        return staff;
      }
    }
    return null;
  }

  public async findByNationalId(tenantId: string, nationalId: string): Promise<StaffMember | null> {
    for (const staff of db.staffMembers.values()) {
      if (
        staff.tenantId === tenantId &&
        staff.nationalId.toLowerCase() === nationalId.toLowerCase() &&
        !staff.isDeleted
      ) {
        return staff;
      }
    }
    return null;
  }

  public async findAllForTenant(
    tenantId: string,
    filters?: {
      campusId?: string;
      role?: string;
      department?: string;
      status?: string;
      search?: string;
    }
  ): Promise<StaffMember[]> {
    let result: StaffMember[] = [];
    for (const staff of db.staffMembers.values()) {
      if (staff.tenantId !== tenantId || staff.isDeleted) continue;

      if (filters?.campusId && staff.campusId !== filters.campusId) continue;
      if (filters?.role && staff.staffRole !== filters.role) continue;
      if (filters?.department && staff.department.toLowerCase() !== filters.department.toLowerCase()) continue;
      if (filters?.status && staff.status !== filters.status) continue;

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesName =
          staff.firstName.toLowerCase().includes(query) ||
          staff.lastName.toLowerCase().includes(query) ||
          `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(query);
        const matchesCode = staff.employeeId.toLowerCase().includes(query);
        const matchesEmail = staff.email.toLowerCase().includes(query);
        const matchesNational = staff.nationalId.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesEmail && !matchesNational) continue;
      }

      result.push(staff);
    }
    return result;
  }

  public async update(id: string, updates: Partial<StaffMember>): Promise<StaffMember | null> {
    const existing = db.staffMembers.get(id);
    if (!existing || existing.isDeleted) return null;

    const updated: StaffMember = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    db.staffMembers.set(id, updated);
    return updated;
  }

  public async softDelete(id: string): Promise<boolean> {
    const existing = db.staffMembers.get(id);
    if (!existing || existing.isDeleted) return false;

    existing.isDeleted = true;
    existing.deletedAt = new Date();
    existing.updatedAt = new Date();
    db.staffMembers.set(id, existing);
    return true;
  }

  public async restore(id: string): Promise<boolean> {
    const existing = db.staffMembers.get(id);
    if (!existing || !existing.isDeleted) return false;

    existing.isDeleted = false;
    existing.deletedAt = undefined;
    existing.updatedAt = new Date();
    db.staffMembers.set(id, existing);
    return true;
  }
}

export const staffRepository = new StaffRepository();
