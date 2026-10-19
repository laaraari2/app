import { AppError } from '../../../../errors/AppError';

export class AcademicDomainError extends AppError {
  constructor(message: string, statusCode: number = 400) {
    super(message, statusCode);
    this.name = 'AcademicDomainError';
  }
}

export class TimetableConflictError extends AcademicDomainError {
  public conflicts: any[];
  constructor(message: string, conflicts: any[]) {
    super(message, 409);
    this.name = 'TimetableConflictError';
    this.conflicts = conflicts;
  }
}

export class DuplicateCodeError extends AcademicDomainError {
  constructor(entityName: string, code: string) {
    super(`${entityName} with code '${code}' already exists for this tenant`, 409);
    this.name = 'DuplicateCodeError';
  }
}
