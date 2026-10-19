export class PeopleDomainError extends Error {
  constructor(message: string, public code: string = 'PEOPLE_DOMAIN_ERROR') {
    super(message);
    this.name = 'PeopleDomainError';
  }
}

export class PersonNotFoundError extends PeopleDomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} with ID "${id}" was not found`, 'PERSON_NOT_FOUND');
    this.name = 'PersonNotFoundError';
  }
}

export class DuplicateNationalIdError extends PeopleDomainError {
  constructor(nationalId: string, entityType: string) {
    super(`A ${entityType} with National ID "${nationalId}" already exists in this tenant.`, 'DUPLICATE_NATIONAL_ID');
    this.name = 'DuplicateNationalIdError';
  }
}

export class DuplicateEmployeeIdError extends PeopleDomainError {
  constructor(employeeId: string) {
    super(`A staff member with Employee ID "${employeeId}" already exists in this tenant.`, 'DUPLICATE_EMPLOYEE_ID');
    this.name = 'DuplicateEmployeeIdError';
  }
}

export class InvalidRelationshipError extends PeopleDomainError {
  constructor(message: string) {
    super(message, 'INVALID_RELATIONSHIP');
    this.name = 'InvalidRelationshipError';
  }
}
