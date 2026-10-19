import { campusRepository } from '../../infrastructure/persistence/campus.repository';
import { buildingRepository } from '../../infrastructure/persistence/building.repository';
import { floorRepository } from '../../infrastructure/persistence/floor.repository';
import { roomRepository } from '../../infrastructure/persistence/room.repository';
import { ImportResult, RoomType, RoomStatus, CampusStatus } from '../../../../types/organization';
import { auditService } from '../../../../services/audit.service';

export class OrganizationImportExportService {
  public async importCampusesCsv(tenantId: string, csvContent: string, actorId?: string, actorEmail?: string): Promise<ImportResult> {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) {
      return { importedCount: 0, skippedCount: 0, errors: [{ line: 1, error: 'Empty or header-only CSV file' }] };
    }

    let importedCount = 0;
    let skippedCount = 0;
    const errors: Array<{ line: number; error: string }> = [];

    // Header: name,code,address,city,phone,email,principalName,isMain,status
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      if (row.length < 2) {
        errors.push({ line: i + 1, error: 'Insufficient columns' });
        skippedCount++;
        continue;
      }

      const [name, code, address, city, phone, email, principalName, isMain, status] = row;

      if (!name || !code) {
        errors.push({ line: i + 1, error: 'Missing name or code' });
        skippedCount++;
        continue;
      }

      try {
        const existing = await campusRepository.findByCode(code, tenantId);
        if (existing) {
          skippedCount++;
          errors.push({ line: i + 1, error: `Campus code '${code}' already exists` });
          continue;
        }

        await campusRepository.save({
          id: crypto.randomUUID(),
          tenantId,
          name,
          code: code.toUpperCase(),
          address: address || undefined,
          city: city || undefined,
          phone: phone || undefined,
          email: email || undefined,
          principalName: principalName || undefined,
          isMain: isMain?.toLowerCase() === 'true',
          status: (status as CampusStatus) || 'ACTIVE',
          createdBy: actorId,
          updatedBy: actorId,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        importedCount++;
      } catch (err: any) {
        skippedCount++;
        errors.push({ line: i + 1, error: err.message || 'Import error' });
      }
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'IMPORT_CAMPUSES_CSV',
        resource: 'campus',
        targetId: 'batch',
        changes: { importedCount, skippedCount, errorCount: errors.length },
      });
    }

    return { importedCount, skippedCount, errors };
  }

  public async importRoomsCsv(tenantId: string, csvContent: string, actorId?: string, actorEmail?: string): Promise<ImportResult> {
    const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length <= 1) {
      return { importedCount: 0, skippedCount: 0, errors: [{ line: 1, error: 'Empty or header-only CSV file' }] };
    }

    let importedCount = 0;
    let skippedCount = 0;
    const errors: Array<{ line: number; error: string }> = [];

    // Header: campusCode,buildingCode,floorName,name,code,roomType,capacity,facilities,status
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      if (row.length < 5) {
        errors.push({ line: i + 1, error: 'Insufficient columns' });
        skippedCount++;
        continue;
      }

      const [campusCode, buildingCode, floorName, name, code, roomType, capacityStr, facilitiesStr, status] = row;

      if (!campusCode || !buildingCode || !name || !code) {
        errors.push({ line: i + 1, error: 'Missing required fields (campusCode, buildingCode, name, code)' });
        skippedCount++;
        continue;
      }

      try {
        const campus = await campusRepository.findByCode(campusCode, tenantId);
        if (!campus) {
          skippedCount++;
          errors.push({ line: i + 1, error: `Campus code '${campusCode}' not found` });
          continue;
        }

        const building = await buildingRepository.findByCode(buildingCode, campus.id, tenantId);
        if (!building) {
          skippedCount++;
          errors.push({ line: i + 1, error: `Building code '${buildingCode}' not found` });
          continue;
        }

        const floors = await floorRepository.findAllPaginated(tenantId, { buildingId: building.id, limit: 100 });
        let floor = floors.data.find(f => f.name.toLowerCase() === (floorName || '').toLowerCase());

        if (!floor && floors.data.length > 0) {
          floor = floors.data[0];
        }

        if (!floor) {
          // Auto create a ground floor if none exists
          floor = await floorRepository.save({
            id: crypto.randomUUID(),
            tenantId,
            campusId: campus.id,
            buildingId: building.id,
            name: floorName || 'Rez-de-chaussée',
            floorNumber: 0,
            status: 'ACTIVE',
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        const existingRoom = await roomRepository.findByCode(code, building.id, tenantId);
        if (existingRoom) {
          skippedCount++;
          errors.push({ line: i + 1, error: `Room code '${code}' already exists in building '${buildingCode}'` });
          continue;
        }

        const facilities = facilitiesStr ? facilitiesStr.split(';').map(f => f.trim()) : ['Projector'];
        const capacity = capacityStr ? parseInt(capacityStr, 10) : 30;

        await roomRepository.save({
          id: crypto.randomUUID(),
          tenantId,
          campusId: campus.id,
          buildingId: building.id,
          floorId: floor.id,
          name,
          code: code.toUpperCase(),
          roomType: (roomType as RoomType) || 'CLASSROOM',
          capacity: isNaN(capacity) ? 30 : capacity,
          facilities,
          status: (status as RoomStatus) || 'AVAILABLE',
          createdBy: actorId,
          updatedBy: actorId,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        importedCount++;
      } catch (err: any) {
        skippedCount++;
        errors.push({ line: i + 1, error: err.message || 'Import error' });
      }
    }

    if (actorId && tenantId) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'IMPORT_ROOMS_CSV',
        resource: 'room',
        targetId: 'batch',
        changes: { importedCount, skippedCount, errorCount: errors.length },
      });
    }

    return { importedCount, skippedCount, errors };
  }

  public async exportCampusesCsv(tenantId: string): Promise<string> {
    const campuses = (await campusRepository.findAllPaginated(tenantId, { limit: 1000 })).data;
    const header = 'ID,Name,Code,Address,City,Phone,Email,PrincipalName,IsMain,Status,CreatedAt\n';
    const rows = campuses.map(c =>
      `"${c.id}","${c.name}","${c.code}","${c.address || ''}","${c.city || ''}","${c.phone || ''}","${c.email || ''}","${c.principalName || ''}","${c.isMain}","${c.status}","${c.createdAt}"`
    );
    return header + rows.join('\n');
  }

  public async exportRoomsCsv(tenantId: string): Promise<string> {
    const rooms = (await roomRepository.findAllPaginated(tenantId, { limit: 1000 })).data;
    const header = 'ID,CampusID,BuildingID,FloorID,Name,Code,RoomType,Capacity,Facilities,Status,CreatedAt\n';
    const rows = rooms.map(r =>
      `"${r.id}","${r.campusId}","${r.buildingId}","${r.floorId}","${r.name}","${r.code}","${r.roomType}","${r.capacity}","${r.facilities.join(';')}","${r.status}","${r.createdAt}"`
    );
    return header + rows.join('\n');
  }
}

export const organizationImportExportService = new OrganizationImportExportService();
