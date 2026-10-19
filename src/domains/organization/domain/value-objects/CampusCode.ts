import { InvalidCampusCodeError } from '../errors/OrganizationDomainErrors';

export class CampusCode {
  private readonly value: string;

  constructor(code: string) {
    const formatted = code.trim().toUpperCase();
    if (!formatted || formatted.length < 2 || formatted.length > 15 || !/^[A-Z0-9_-]+$/.test(formatted)) {
      throw new InvalidCampusCodeError(code);
    }
    this.value = formatted;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: CampusCode): boolean {
    return this.value === other.getValue();
  }
}
