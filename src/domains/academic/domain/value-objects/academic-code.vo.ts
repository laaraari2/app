import { AcademicDomainError } from '../errors/academic-domain.error';

export class AcademicCode {
  private readonly value: string;

  constructor(code: string) {
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      throw new AcademicDomainError('Entity code cannot be empty');
    }
    const sanitized = code.trim().toUpperCase().replace(/[\s-]+/g, '_');
    if (sanitized.length < 2 || sanitized.length > 50) {
      throw new AcademicDomainError('Entity code length must be between 2 and 50 characters');
    }
    this.value = sanitized;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: AcademicCode): boolean {
    return this.value === other.getValue();
  }
}
