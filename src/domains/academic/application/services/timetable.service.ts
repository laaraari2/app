import { timetableSlotRepository } from '../../infrastructure/persistence/timetable-slot.repository';
import { TimetableSlot, PaginatedResult, PaginationAndFilterOptions } from '../../domain/entities/academic-types';
import { CreateTimetableSlotDto } from '../../dto/academic.dto';
import { TimetableConflict } from '../../domain/value-objects/timetable-conflict.vo';
import { TimetableConflictError } from '../../domain/errors/academic-domain.error';
import { NotFoundError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';

export class TimetableService {
  public async getPaginatedSlots(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<TimetableSlot>> {
    return timetableSlotRepository.findPaginated(tenantId, options);
  }

  public async getSlotById(id: string, tenantId: string): Promise<TimetableSlot> {
    const slot = await timetableSlotRepository.findById(id, tenantId);
    if (!slot || slot.isDeleted) {
      throw new NotFoundError('Timetable Slot');
    }
    return slot;
  }

  public async detectConflicts(
    tenantId: string,
    filter?: { classGroupId?: string; roomId?: string; teacherId?: string; academicYearId?: string }
  ): Promise<TimetableConflict[]> {
    const res = await timetableSlotRepository.findPaginated(tenantId, { limit: 2000, academicYearId: filter?.academicYearId });
    const slots = res.data.filter(s => !s.isDeleted && !s.isBreak);

    const conflicts: TimetableConflict[] = [];

    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        const s1 = slots[i];
        const s2 = slots[j];

        if (s1.dayOfWeek !== s2.dayOfWeek || s1.periodNumber !== s2.periodNumber) {
          continue;
        }

        // 1. Room Double Booking
        if (s1.roomId && s2.roomId && s1.roomId === s2.roomId) {
          if (!filter?.roomId || filter.roomId === s1.roomId) {
            conflicts.push({
              type: 'ROOM_DOUBLE_BOOKED',
              message: `Room '${s1.roomId}' is double booked on ${s1.dayOfWeek} Period ${s1.periodNumber}`,
              slot1Id: s1.id,
              slot2Id: s2.id,
              entityId: s1.roomId,
              dayOfWeek: s1.dayOfWeek,
              periodNumber: s1.periodNumber,
              startTime: s1.startTime,
              endTime: s1.endTime,
            });
          }
        }

        // 2. Class Group Double Booking
        if (s1.classGroupId && s2.classGroupId && s1.classGroupId === s2.classGroupId) {
          if (!filter?.classGroupId || filter.classGroupId === s1.classGroupId) {
            conflicts.push({
              type: 'CLASS_GROUP_DOUBLE_BOOKED',
              message: `Class Group '${s1.classGroupId}' has two overlapping sessions on ${s1.dayOfWeek} Period ${s1.periodNumber}`,
              slot1Id: s1.id,
              slot2Id: s2.id,
              entityId: s1.classGroupId,
              dayOfWeek: s1.dayOfWeek,
              periodNumber: s1.periodNumber,
              startTime: s1.startTime,
              endTime: s1.endTime,
            });
          }
        }

        // 3. Teacher Double Booking
        if (s1.teacherId && s2.teacherId && s1.teacherId === s2.teacherId) {
          if (!filter?.teacherId || filter.teacherId === s1.teacherId) {
            conflicts.push({
              type: 'TEACHER_DOUBLE_BOOKED',
              message: `Teacher '${s1.teacherId}' is scheduled for two classes on ${s1.dayOfWeek} Period ${s1.periodNumber}`,
              slot1Id: s1.id,
              slot2Id: s2.id,
              entityId: s1.teacherId,
              dayOfWeek: s1.dayOfWeek,
              periodNumber: s1.periodNumber,
              startTime: s1.startTime,
              endTime: s1.endTime,
            });
          }
        }
      }
    }

    return conflicts;
  }

  public async createSlot(
    tenantId: string,
    dto: CreateTimetableSlotDto,
    enforceNoConflicts: boolean = true,
    actorId?: string,
    actorEmail?: string
  ): Promise<TimetableSlot> {
    // Check conflicts before creating if required
    if (enforceNoConflicts && !dto.isBreak) {
      const existingInTime = await timetableSlotRepository.findPotentialConflicts(tenantId, dto.dayOfWeek, dto.periodNumber);
      const tempConflicts: TimetableConflict[] = [];

      for (const ex of existingInTime) {
        if (dto.roomId && ex.roomId === dto.roomId) {
          tempConflicts.push({
            type: 'ROOM_DOUBLE_BOOKED',
            message: `Room is already occupied on ${dto.dayOfWeek} Period ${dto.periodNumber}`,
            slot1Id: ex.id,
            entityId: dto.roomId,
            dayOfWeek: dto.dayOfWeek,
            periodNumber: dto.periodNumber,
            startTime: dto.startTime,
            endTime: dto.endTime,
          });
        }
        if (dto.classGroupId && ex.classGroupId === dto.classGroupId) {
          tempConflicts.push({
            type: 'CLASS_GROUP_DOUBLE_BOOKED',
            message: `Class Group already has a class on ${dto.dayOfWeek} Period ${dto.periodNumber}`,
            slot1Id: ex.id,
            entityId: dto.classGroupId,
            dayOfWeek: dto.dayOfWeek,
            periodNumber: dto.periodNumber,
            startTime: dto.startTime,
            endTime: dto.endTime,
          });
        }
        if (dto.teacherId && ex.teacherId === dto.teacherId) {
          tempConflicts.push({
            type: 'TEACHER_DOUBLE_BOOKED',
            message: `Teacher is already scheduled elsewhere on ${dto.dayOfWeek} Period ${dto.periodNumber}`,
            slot1Id: ex.id,
            entityId: dto.teacherId,
            dayOfWeek: dto.dayOfWeek,
            periodNumber: dto.periodNumber,
            startTime: dto.startTime,
            endTime: dto.endTime,
          });
        }
      }

      if (tempConflicts.length > 0) {
        throw new TimetableConflictError('Timetable slot conflict detected', tempConflicts);
      }
    }

    const slot = await timetableSlotRepository.create({
      tenantId,
      academicYearId: dto.academicYearId,
      campusId: dto.campusId,
      classGroupId: dto.classGroupId,
      subjectId: dto.subjectId,
      teacherId: dto.teacherId,
      roomId: dto.roomId,
      termId: dto.termId,
      dayOfWeek: dto.dayOfWeek,
      periodNumber: dto.periodNumber,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isBreak: dto.isBreak || false,
      breakType: dto.breakType,
      createdBy: actorId,
      isDeleted: false,
      isArchived: false,
    });

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'TIMETABLE_SLOT_CREATED',
        resource: 'timetable_slot',
        targetId: slot.id,
        changes: { day: slot.dayOfWeek, period: slot.periodNumber, classGroupId: slot.classGroupId },
      });
    }

    return slot;
  }

  public async updateSlot(
    id: string,
    tenantId: string,
    updates: Partial<TimetableSlot>,
    actorId?: string,
    actorEmail?: string
  ): Promise<TimetableSlot> {
    await this.getSlotById(id, tenantId);

    const updated = await timetableSlotRepository.update(id, { ...updates, updatedBy: actorId }, tenantId);
    if (!updated) throw new NotFoundError('Timetable Slot');

    if (actorId && actorEmail) {
      await auditService.logAction({
        tenantId,
        actorId,
        actorEmail,
        action: 'TIMETABLE_SLOT_UPDATED',
        resource: 'timetable_slot',
        targetId: id,
        changes: updates,
      });
    }

    return updated;
  }

  public async softDeleteSlot(id: string, tenantId: string, actorId?: string): Promise<TimetableSlot> {
    const deleted = await timetableSlotRepository.softDelete(id, tenantId, actorId);
    if (!deleted) throw new NotFoundError('Timetable Slot');
    return deleted;
  }

  public async restoreSlot(id: string, tenantId: string, actorId?: string): Promise<TimetableSlot> {
    const restored = await timetableSlotRepository.restore(id, tenantId, actorId);
    if (!restored) throw new NotFoundError('Timetable Slot');
    return restored;
  }

  public async archiveSlot(id: string, tenantId: string, actorId?: string): Promise<TimetableSlot> {
    const archived = await timetableSlotRepository.archive(id, tenantId, actorId);
    if (!archived) throw new NotFoundError('Timetable Slot');
    return archived;
  }
}

export const timetableService = new TimetableService();
