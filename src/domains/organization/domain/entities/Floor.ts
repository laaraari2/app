import { Floor as IFloor } from '../../../../types/organization';

export class FloorAggregate implements IFloor {
  public id: string;
  public tenantId: string;
  public buildingId: string;
  public campusId: string;
  public name: string;
  public floorNumber: number;
  public description?: string;
  public status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  public academicYearId?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public isDeleted: boolean;
  public deletedAt?: Date | string;
  public deletedBy?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: IFloor) {
    this.id = data.id || crypto.randomUUID();
    this.tenantId = data.tenantId;
    this.buildingId = data.buildingId;
    this.campusId = data.campusId;
    this.name = data.name;
    this.floorNumber = data.floorNumber;
    this.description = data.description;
    this.status = data.status || 'ACTIVE';
    this.academicYearId = data.academicYearId;
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
    this.isDeleted = data.isDeleted || false;
    this.deletedAt = data.deletedAt;
    this.deletedBy = data.deletedBy;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  public softDelete(actorId?: string): void {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = actorId;
    this.updatedAt = new Date();
  }

  public restore(): void {
    this.isDeleted = false;
    this.deletedAt = undefined;
    this.deletedBy = undefined;
    this.updatedAt = new Date();
  }

  public archive(): void {
    this.status = 'ARCHIVED';
    this.updatedAt = new Date();
  }
}
