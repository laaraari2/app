import { GuardianInfo } from '../entities/admissions-types';
import { AdmissionsDomainError } from '../errors/admissions-domain.error';

export class GuardianInfoValueObject {
  private readonly info: GuardianInfo;

  constructor(info: GuardianInfo) {
    if (!info.fullName || info.fullName.trim().length < 2) {
      throw new AdmissionsDomainError('Guardian full name must be at least 2 characters.');
    }
    if (!info.phone || info.phone.trim().length < 6) {
      throw new AdmissionsDomainError('Guardian phone number is required.');
    }
    this.info = {
      ...info,
      fullName: info.fullName.trim(),
      phone: info.phone.trim(),
      email: info.email?.trim().toLowerCase(),
    };
  }

  public getValue(): GuardianInfo {
    return this.info;
  }

  public static validateList(guardians: GuardianInfo[]): GuardianInfo[] {
    if (!guardians || guardians.length === 0) {
      throw new AdmissionsDomainError('At least one primary guardian/parent information is required.');
    }
    const validated = guardians.map(g => new GuardianInfoValueObject(g).getValue());
    const hasPrimary = validated.some(g => g.isPrimary);
    if (!hasPrimary) {
      validated[0].isPrimary = true;
    }
    return validated;
  }
}
