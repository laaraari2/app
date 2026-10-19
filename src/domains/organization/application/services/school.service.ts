import type { ISchoolRepository } from '../../domain/repositories/ISchoolRepository';
import { School, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { NotFoundError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';
import { schoolRepository } from '../../infrastructure/persistence/school.repository';
export class SchoolService {
  constructor(
    private readonly schoolRepository: ISchoolRepository
  ) {}

  public async getSchoolProfile(tenantId: string): Promise<School | null> {
    return this.schoolRepository.findByTenantId(tenantId);
  }

  public async getSchoolById(id: string, tenantId: string): Promise<School> {
    const school = await this.schoolRepository.findById(id, tenantId);

    if (!school) {
      throw new NotFoundError('School');
    }

    return school;
  }

  public async createOrUpdateSchoolProfile(
    tenantId: string,
    data: {
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
      status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
      academicYearId?: string;
    },
    actorId?: string,
    actorEmail?: string
  ): Promise<School> {

    const existing = await this.schoolRepository.findByTenantId(tenantId);

    if (existing) {

      const updated = await this.schoolRepository.update(existing.id, tenantId, {
        ...data,
        updatedBy: actorId,
      });

      if (actorId) {
        await auditService.logAction({
          tenantId,
          actorId,
          actorEmail,
          action: 'SCHOOL_PROFILE_UPDATED',
          resource: 'school',
          targetId: existing.id,
          changes: data,
        });
      }

      return updated!;
    }

    const school = await this.schoolRepository.save({
      id: crypto.randomUUID(),
      tenantId,
      name: data.name,
      code: data.code.toUpperCase(),
      legalName: data.legalName,
      slogan: data.slogan,
      taxId: data.taxId,
      address: data.address,
      city: data.city,
      country: data.country,
      phone: data.phone,
      email: data.email,
      website: data.website,
      logoUrl: data.logoUrl,
      status: data.status ?? 'ACTIVE',
      academicYearId: data.academicYearId,
      createdBy: actorId,
      updatedBy: actorId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (actorId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SCHOOL_PROFILE_CREATED',
        resource: 'school',
        targetId: school.id,
        changes: data,
      });
    }

    return school;
  }

  public async softDeleteSchool(
    id: string,
    tenantId: string,
    actorId?: string,
    actorEmail?: string
  ): Promise<void> {

    const success = await this.schoolRepository.softDelete(id, tenantId, actorId);

    if (!success) {
      throw new NotFoundError('School');
    }

    if (actorId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SCHOOL_SOFT_DELETED',
        resource: 'school',
        targetId: id,
      });
    }
  }

  public async restoreSchool(
    id: string,
    tenantId: string,
    actorId?: string,
    actorEmail?: string
  ): Promise<void> {

    const success = await this.schoolRepository.restore(id, tenantId);

    if (!success) {
      throw new NotFoundError('School');
    }

    if (actorId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'SCHOOL_RESTORED',
        resource: 'school',
        targetId: id,
      });
    }
  }

  public async getPaginatedSchools(
    tenantId: string,
    query: PaginationQuery
  ): Promise<PaginatedResult<School>> {

    return this.schoolRepository.findAllPaginated(tenantId, query);
  }
}


export const schoolService = new SchoolService( schoolRepository);
