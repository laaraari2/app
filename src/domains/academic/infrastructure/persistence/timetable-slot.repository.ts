import { db } from '../../../../db/store';
import { TimetableSlot, DayOfWeek } from '../../domain/entities/academic-types';
import { AcademicBaseRepository } from './academic-base.repository';

export class TimetableSlotRepository extends AcademicBaseRepository<TimetableSlot> {
  protected getCollection(): Map<string, TimetableSlot> {
    return db.timetableSlots;
  }

  public async findSlotsByClassGroup(classGroupId: string, tenantId: string): Promise<TimetableSlot[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(s => !s.isDeleted && s.classGroupId === classGroupId);
  }

  public async findSlotsByTeacher(teacherId: string, tenantId: string): Promise<TimetableSlot[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(s => !s.isDeleted && s.teacherId === teacherId);
  }

  public async findSlotsByRoom(roomId: string, tenantId: string): Promise<TimetableSlot[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(s => !s.isDeleted && s.roomId === roomId);
  }

  public async findPotentialConflicts(
    tenantId: string,
    dayOfWeek: DayOfWeek,
    periodNumber: number,
    excludeSlotId?: string
  ): Promise<TimetableSlot[]> {
    const list = await this.findAll(undefined, tenantId);
    return list.filter(s => {
      if (s.isDeleted) return false;
      if (excludeSlotId && s.id === excludeSlotId) return false;
      return s.dayOfWeek === dayOfWeek && s.periodNumber === periodNumber;
    });
  }
}

export const timetableSlotRepository = new TimetableSlotRepository();
