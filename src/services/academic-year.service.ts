import { academicYearRepository } from '../repositories/academic-year.repository';
import { AcademicYear, AcademicYearStatus } from '../domains/academic/domain/entities/academic-types';
import { NotFoundError, ConflictError } from '../errors/AppError';

export class AcademicYearService {
  public async getAcademicYears(tenantId: string): Promise<AcademicYear[]> {
    return academicYearRepository.findAll(undefined, tenantId);
  }

  public async getAcademicYearById(id: string, tenantId: string): Promise<AcademicYear> {
    const ay = await academicYearRepository.findById(id, tenantId);
    if (!ay) {
      throw new NotFoundError('Academic Year');
    }
    return ay;
  }

  public async getCurrentAcademicYear(tenantId: string): Promise<AcademicYear> {
    const current = await academicYearRepository.getCurrentAcademicYear(tenantId);
    if (!current) {
      throw new NotFoundError('Current Academic Year');
    }
    return current;
  }

  public async createAcademicYear(
    tenantId: string,
    data: {
      name: string;
      code: string;
      startDate: string | Date;
      endDate: string | Date;
      isCurrent?: boolean;
      status?: AcademicYearStatus;
    }
  ): Promise<AcademicYear> {
    const existing = await academicYearRepository.findByCode(data.code, tenantId);
    if (existing) {
      throw new ConflictError(`Academic year code '${data.code}' already exists`);
    }

    const ay = await academicYearRepository.create({
      tenantId,
      name: data.name,
      code: data.code.toUpperCase(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isCurrent: data.isCurrent || false,
      status: data.status || 'UPCOMING',
      settings: {},
    });

    if (data.isCurrent) {
      await academicYearRepository.setCurrentAcademicYear(tenantId, ay.id);
    }

    return ay;
  }

  public async updateAcademicYear(
    id: string,
    tenantId: string,
    updates: Partial<Omit<AcademicYear, 'id' | 'tenantId' | 'createdAt'>>
  ): Promise<AcademicYear> {
    const updated = await academicYearRepository.update(id, updates, tenantId);
    if (!updated) {
      throw new NotFoundError('Academic Year');
    }

    if (updates.isCurrent) {
      await academicYearRepository.setCurrentAcademicYear(tenantId, id);
    }

    return updated;
  }

  public async deleteAcademicYear(id: string, tenantId: string): Promise<void> {
    const deleted = await academicYearRepository.delete(id, tenantId);
    if (!deleted) {
      throw new NotFoundError('Academic Year');
    }
  }

  public async setCurrentAcademicYear(tenantId: string, id: string): Promise<AcademicYear> {
    const updated = await academicYearRepository.setCurrentAcademicYear(tenantId, id);
    if (!updated) {
      throw new NotFoundError('Academic Year');
    }
    return updated;
  }
}

export const academicYearService = new AcademicYearService();
