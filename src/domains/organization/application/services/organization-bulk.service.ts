import { campusRepository } from '../../infrastructure/persistence/campus.repository';
import { buildingRepository } from '../../infrastructure/persistence/building.repository';
import { floorRepository } from '../../infrastructure/persistence/floor.repository';
import { roomRepository } from '../../infrastructure/persistence/room.repository';
import { BulkOperationDTO, BulkOperationResult } from '../../../../types/organization';
import { auditService } from '../../../../services/audit.service';

export class OrganizationBulkService {
  public async executeBulkOperation(
    tenantId: string,
    entityType: 'campus' | 'building' | 'floor' | 'room',
    dto: BulkOperationDTO,
    actorId?: string,
    actorEmail?: string
  ): Promise<BulkOperationResult> {
    let successCount = 0;
    let failureCount = 0;
    const errors: Array<{ id: string; error: string }> = [];

    for (const id of dto.ids) {
      try {
        if (entityType === 'campus') {
          if (dto.action === 'delete') {
            const ok = await campusRepository.softDelete(id, tenantId, actorId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'restore') {
            const ok = await campusRepository.restore(id, tenantId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'archive') {
            const res = await campusRepository.archive(id, tenantId);
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'activate') {
            const res = await campusRepository.update(id, tenantId, { status: 'ACTIVE' });
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          }
        } else if (entityType === 'building') {
          if (dto.action === 'delete') {
            const ok = await buildingRepository.softDelete(id, tenantId, actorId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'restore') {
            const ok = await buildingRepository.restore(id, tenantId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'archive') {
            const res = await buildingRepository.archive(id, tenantId);
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'activate') {
            const res = await buildingRepository.update(id, tenantId, { status: 'ACTIVE' });
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          }
        } else if (entityType === 'floor') {
          if (dto.action === 'delete') {
            const ok = await floorRepository.softDelete(id, tenantId, actorId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'restore') {
            const ok = await floorRepository.restore(id, tenantId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'archive') {
            const res = await floorRepository.archive(id, tenantId);
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'activate') {
            const res = await floorRepository.update(id, tenantId, { status: 'ACTIVE' });
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          }
        } else if (entityType === 'room') {
          if (dto.action === 'delete') {
            const ok = await roomRepository.softDelete(id, tenantId, actorId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'restore') {
            const ok = await roomRepository.restore(id, tenantId);
            if (ok) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'archive') {
            const res = await roomRepository.archive(id, tenantId);
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          } else if (dto.action === 'activate') {
            const res = await roomRepository.update(id, tenantId, { status: 'AVAILABLE' });
            if (res) successCount++; else { failureCount++; errors.push({ id, error: 'Not found' }); }
          }
        }
      } catch (err: any) {
        failureCount++;
        errors.push({ id, error: err.message || 'Error executing operation' });
      }
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: `BULK_${dto.action.toUpperCase()}_${entityType.toUpperCase()}`,
        resource: entityType,
        targetId: dto.ids.join(','),
        changes: { successCount, failureCount, action: dto.action },
      });
    }

    return { successCount, failureCount, errors };
  }
}

export const organizationBulkService = new OrganizationBulkService();
