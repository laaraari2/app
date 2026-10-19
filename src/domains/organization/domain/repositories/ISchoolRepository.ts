import { School, PaginationQuery, PaginatedResult } from "../../../../types/organization";

export interface ISchoolRepository {
  findById(id: string, tenantId: string): Promise<School | null>;

  findByTenantId(tenantId: string): Promise<School | null>;

  save(school: School): Promise<School>;

  update(
    id: string,
    tenantId: string,
    updates: Partial<School>
  ): Promise<School | null>;

  softDelete(
    id: string,
    tenantId: string,
    actorId?: string
  ): Promise<boolean>;

  restore(
    id: string,
    tenantId: string
  ): Promise<boolean>;

  findAllPaginated(
    tenantId: string,
    query: PaginationQuery
  ): Promise<PaginatedResult<School>>;
}
