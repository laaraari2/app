import { AcademicDomainError } from '../errors/academic-domain.error';

export class DateRange {
  private readonly start: Date;
  private readonly end: Date;

  constructor(startDate: Date | string, endDate: Date | string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      throw new AcademicDomainError('Invalid start date');
    }
    if (isNaN(end.getTime())) {
      throw new AcademicDomainError('Invalid end date');
    }
    if (start >= end) {
      throw new AcademicDomainError('Start date must be strictly before end date');
    }

    this.start = start;
    this.end = end;
  }

  public getStart(): Date {
    return this.start;
  }

  public getEnd(): Date {
    return this.end;
  }

  public overlaps(other: DateRange): boolean {
    return this.start < other.getEnd() && this.end > other.getStart();
  }
}
