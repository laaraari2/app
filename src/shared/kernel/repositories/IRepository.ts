export interface IRepository<TEntity, TId = string> {
  findById(id: TId, tenantId: string): Promise<TEntity | null>;

  save(entity: TEntity): Promise<TEntity>;

  update(
    id: TId,
    tenantId: string,
    updates: Partial<TEntity>
  ): Promise<TEntity | null>;

  softDelete(
    id: TId,
    tenantId: string,
    actorId?: string
  ): Promise<boolean>;

  restore(
    id: TId,
    tenantId: string
  ): Promise<boolean>;
}
