import { Campus as ICampus, CampusStatus } from '../../../../types/organization';
import { CampusCode } from '../value-objects/CampusCode';

export class CampusAggregate implements ICampus {
  public id: string;
  public tenantId: string;
  public name: string;
  public code: string;
  public address?: string;
  public city?: string;
  public phone?: string;
  public email?: string;
  public principalName?: string;
  public isMain: boolean;
  public status: CampusStatus;
  public academicYearId?: string;
  public createdBy?: string;
  public updatedBy?: string;
  public isDeleted: boolean;
  public deletedAt?: Date | string;
  public deletedBy?: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(data: ICampus) {
    this.id = data.id || crypto.randomUUID();
    this.tenantId = data.tenantId;
    this.name = data.name;
    this.code = new CampusCode(data.code).getValue();
    this.address = data.address;
    this.city = data.city;
    this.phone = data.phone;
    this.email = data.email;
    this.principalName = data.principalName;
    this.isMain = data.isMain;
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
