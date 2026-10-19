export type ConflictType = 'ROOM_DOUBLE_BOOKED' | 'TEACHER_DOUBLE_BOOKED' | 'CLASS_GROUP_DOUBLE_BOOKED';

export interface TimetableConflict {
  type: ConflictType;
  message: string;
  slot1Id: string;
  slot2Id?: string;
  entityId: string; // roomId, teacherId, or classGroupId
  dayOfWeek: string;
  periodNumber: number;
  startTime: string;
  endTime: string;
}
