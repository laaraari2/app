import { AdmissionsDomainError } from '../errors/admissions-domain.error';

export class EnrollmentNumber {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();
    if (!trimmed || trimmed.length < 5) {
      throw new AdmissionsDomainError('Enrollment number must be at least 5 characters.');
    }
    this.value = trimmed.toUpperCase();
  }

  public getValue(): string {
    return this.value;
  }

  public static generate(academicYearCode: string, sequenceNumber: number, prefix: string = 'STUD'): EnrollmentNumber {
    const year = academicYearCode.replace(/[^0-9]/g, '').slice(0, 4) || new Date().getFullYear().toString();
    const formattedSeq = String(sequenceNumber).padStart(5, '0');
    return new EnrollmentNumber(`${prefix}-${year}-${formattedSeq}`);
  }

  public toString(): string {
    return this.value;
  }
}
