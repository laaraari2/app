import { InvalidRoomCapacityError } from '../errors/OrganizationDomainErrors';

export class RoomCapacity {
  private readonly value: number;

  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 2000) {
      throw new InvalidRoomCapacityError(capacity);
    }
    this.value = capacity;
  }

  public getValue(): number {
    return this.value;
  }
}
