export class OrganizationDomainError extends Error {
  constructor(message: string, public code: string = 'ORG_DOMAIN_ERROR') {
    super(message);
    this.name = 'OrganizationDomainError';
  }
}

export class InvalidCampusCodeError extends OrganizationDomainError {
  constructor(code: string) {
    super(`Invalid campus code '${code}'. Code must be 2-10 alphanumeric characters.`, 'INVALID_CAMPUS_CODE');
  }
}

export class InvalidRoomCapacityError extends OrganizationDomainError {
  constructor(capacity: number) {
    super(`Invalid room capacity ${capacity}. Room capacity must be a positive integer.`, 'INVALID_ROOM_CAPACITY');
  }
}

export class EntityNotFoundError extends OrganizationDomainError {
  constructor(entityName: string, id: string) {
    super(`${entityName} with ID '${id}' was not found.`, 'ENTITY_NOT_FOUND');
  }
}

export class DuplicateCodeError extends OrganizationDomainError {
  constructor(entityName: string, code: string) {
    super(`${entityName} code '${code}' already exists.`, 'DUPLICATE_CODE');
  }
}
