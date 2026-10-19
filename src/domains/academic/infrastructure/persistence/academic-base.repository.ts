import { TenantScopedRepository } from '../../../../repositories/base.repository';
import { AcademicBaseEntity, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';

export abstract class AcademicBaseRepository<T extends AcademicBaseEntity> extends TenantScopedRepository<T> {

  public async findPaginated(tenantId: string, options: PaginationAndFilterOptions): Promise<PaginatedResult<T>> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const search = options.search?.toLowerCase().trim();
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';

    let all = Array.from(this.getCollection().values()).filter(item => item.tenantId === tenantId);

    // Soft delete filtering
    if (!options.includeDeleted) {
      all = all.filter(item => !item.isDeleted);
    }

    // Archive filtering
    if (!options.includeArchived && options.includeArchived !== undefined) {
      all = all.filter(item => !item.isArchived);
    }

    // Search filter
    if (search) {
      all = all.filter(item => {
        const anyItem = item as any;
        return (
          (anyItem.name && anyItem.name.toLowerCase().includes(search)) ||
          (anyItem.code && anyItem.code.toLowerCase().includes(search)) ||
          (anyItem.title && anyItem.title.toLowerCase().includes(search)) ||
          (anyItem.description && anyItem.description.toLowerCase().includes(search))
        );
      });
    }

    // Custom entity specific filters
    if (options.status) {
      all = all.filter(item => (item as any).status === options.status);
    }
    if (options.stageId) {
      all = all.filter(item => (item as any).stageId === options.stageId);
    }
    if (options.gradeId) {
      all = all.filter(item => (item as any).gradeId === options.gradeId);
    }
    if (options.academicYearId) {
      all = all.filter(item => (item as any).academicYearId === options.academicYearId);
    }
    if (options.campusId) {
      all = all.filter(item => (item as any).campusId === options.campusId);
    }
    if (options.categoryId) {
      all = all.filter(item => (item as any).categoryId === options.categoryId);
    }
    if (options.classGroupId) {
      all = all.filter(item => (item as any).classGroupId === options.classGroupId);
    }
    if (options.subjectId) {
      all = all.filter(item => (item as any).subjectId === options.subjectId);
    }
    if (options.teacherId) {
      all = all.filter(item => (item as any).teacherId === options.teacherId);
    }
    if (options.eventType) {
      all = all.filter(item => (item as any).eventType === options.eventType);
    }

    // Sorting
    all.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (valA instanceof Date) valA = valA.getTime();
      if (valB instanceof Date) valB = valB.getTime();

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = all.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedData = all.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  }

  public async softDelete(id: string, tenantId: string, deletedBy?: string): Promise<T | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated = {
      ...existing,
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy,
      updatedAt: new Date(),
    };

    this.getCollection().set(id, updated);
    return updated;
  }

  public async restore(id: string, tenantId: string, updatedBy?: string): Promise<T | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated = {
      ...existing,
      isDeleted: false,
      deletedAt: undefined,
      deletedBy: undefined,
      updatedBy,
      updatedAt: new Date(),
    };

    this.getCollection().set(id, updated);
    return updated;
  }

  public async archive(id: string, tenantId: string, archivedBy?: string): Promise<T | null> {
    const existing = await this.findById(id, tenantId);
    if (!existing) return null;

    const updated = {
      ...existing,
      isArchived: true,
      archivedAt: new Date(),
      archivedBy,
      status: 'ARCHIVED',
      updatedAt: new Date(),
    };

    this.getCollection().set(id, updated as any);
    return updated;
  }
}
