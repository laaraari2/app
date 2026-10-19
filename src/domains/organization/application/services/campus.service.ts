import { campusRepository } from '../../infrastructure/persistence/campus.repository';
import { Campus, CampusStatus, PaginationQuery, PaginatedResult } from '../../../../types/organization';
import { NotFoundError, ConflictError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';

export class CampusService {
  public async getCampusById(id: string, tenantId: string): Promise<Campus> {
    const campus = await campusRepository.findById(id, tenantId);
    if (!campus) {
      throw new NotFoundError('Campus');
    }
    return campus;
  }

  public async getPaginatedCampuses(tenantId: string, query: PaginationQuery): Promise<PaginatedResult<Campus>> {
    return campusRepository.findAllPaginated(tenantId, query);
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
      academicYearId?: string;
    },
    actorId?: string,
    actorEmail?: string
  ): Promise<Campus> {
    const existing = await campusRepository.findByCode(data.code, tenantId);
    if (existing) {
      throw new ConflictError(`Campus code '${data.code}' already exists`);
    }

    const campus = await campusRepository.save({
      id: crypto.randomUUID(),
      tenantId,
      name: data.name,
      code: data.code.toUpperCase(),
      address: data.address,
      city: data.city,
      phone: data.phone,
      email: data.email,
      principalName: data.principalName,
      isMain: data.isMain || false,
      status: data.status || 'ACTIVE',
      academicYearId: data.academicYearId,
      createdBy: actorId,
      updatedBy: actorId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'CAMPUS_CREATED',
        resource: 'campus',
        targetId: campus.id,
        changes: data,
      });
    }

    return campus;
  }

  public async updateCampus(
    id: string,
    tenantId: string,
    data: Partial<{
      name: string;
      code: string;
      address: string;
      city: string;
      phone: string;
      email: string;
      principalName: string;
      isMain: boolean;
      status: CampusStatus;
      academicYearId: string;
    }>,
    actorId?: string,
    actorEmail?: string
  ): Promise<Campus> {
    const existing = await this.getCampusById(id, tenantId);

    if (data.code && data.code.toUpperCase() !== existing.code.toUpperCase()) {
      const conflict = await campusRepository.findByCode(data.code, tenantId);
      if (conflict) {
        throw new ConflictError(`Campus code '${data.code}' already exists`);
      }
    }

    const updated = await campusRepository.update(id, tenantId, {
      ...data,
      code: data.code ? data.code.toUpperCase() : existing.code,
      updatedBy: actorId,
    });

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'CAMPUS_UPDATED',
        resource: 'campus',
        targetId: id,
        changes: data,
      });
    }

    return updated!;
  }

  public async softDeleteCampus(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await campusRepository.softDelete(id, tenantId, actorId);
    if (!success) {
      throw new NotFoundError('Campus');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'CAMPUS_SOFT_DELETED',
        resource: 'campus',
        targetId: id,
      });
    }
  }

  public async restoreCampus(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<void> {
    const success = await campusRepository.restore(id, tenantId);
    if (!success) {
      throw new NotFoundError('Campus');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'CAMPUS_RESTORED',
        resource: 'campus',
        targetId: id,
      });
    }
  }

  public async archiveCampus(id: string, tenantId: string, actorId?: string, actorEmail?: string): Promise<Campus> {
    const archived = await campusRepository.archive(id, tenantId);
    if (!archived) {
      throw new NotFoundError('Campus');
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'CAMPUS_ARCHIVED',
        resource: 'campus',
        targetId: id,
      });
    }

    return archived;
  }
}

export const campusService = new CampusService();
