import { db } from '../../../../db/store';
import { GuardianProfile } from '../../domain/entities/people-types';

export class GuardianRepository {
  public async create(guardian: GuardianProfile): Promise<GuardianProfile> {
    db.guardianProfiles.set(guardian.id, guardian);
    return guardian;
  }

  public async findById(id: string): Promise<GuardianProfile | null> {
    const guardian = db.guardianProfiles.get(id);
    if (!guardian || guardian.isDeleted) return null;
    return guardian;
  }

  public async findByNationalId(tenantId: string, nationalId: string): Promise<GuardianProfile | null> {
    for (const guardian of db.guardianProfiles.values()) {
      if (
        guardian.tenantId === tenantId &&
        guardian.nationalId.toLowerCase() === nationalId.toLowerCase() &&
        !guardian.isDeleted
      ) {
        return guardian;
      }
    }
    return null;
  }

  public async findByEmail(tenantId: string, email: string): Promise<GuardianProfile | null> {
    for (const guardian of db.guardianProfiles.values()) {
      if (
        guardian.tenantId === tenantId &&
        guardian.email.toLowerCase() === email.toLowerCase() &&
        !guardian.isDeleted
      ) {
        return guardian;
      }
    }
    return null;
  }

  public async findAllForTenant(
    tenantId: string,
    filters?: {
      search?: string;
    }
  ): Promise<GuardianProfile[]> {
    let result: GuardianProfile[] = [];
    for (const guardian of db.guardianProfiles.values()) {
      if (guardian.tenantId !== tenantId || guardian.isDeleted) continue;

      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const matchesName =
          guardian.firstName.toLowerCase().includes(query) ||
          guardian.lastName.toLowerCase().includes(query) ||
          `${guardian.firstName} ${guardian.lastName}`.toLowerCase().includes(query);
        const matchesEmail = guardian.email.toLowerCase().includes(query);
        const matchesPhone = guardian.phone.includes(query);
        const matchesNational = guardian.nationalId.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesNational) continue;
      }

      result.push(guardian);
    }
    return result;
  }

  public async update(id: string, updates: Partial<GuardianProfile>): Promise<GuardianProfile | null> {
    const existing = db.guardianProfiles.get(id);
    if (!existing || existing.isDeleted) return null;

    const updated: GuardianProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    db.guardianProfiles.set(id, updated);
    return updated;
  }

  public async softDelete(id: string): Promise<boolean> {
    const existing = db.guardianProfiles.get(id);
    if (!existing || existing.isDeleted) return false;

    existing.isDeleted = true;
    existing.updatedAt = new Date();
    db.guardianProfiles.set(id, existing);
    return true;
  }
}

export const guardianRepository = new GuardianRepository();
