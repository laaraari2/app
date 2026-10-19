import { ApplicantStatus } from '../entities/admissions-types';
import { InvalidStatusTransitionError } from '../errors/admissions-domain.error';

export class ApplicantStatusValueObject {
  private readonly value: ApplicantStatus;

  private static readonly ALLOWED_TRANSITIONS: Record<ApplicantStatus, ApplicantStatus[]> = {
    DRAFT: ['SUBMITTED', 'CANCELLED'],
    SUBMITTED: ['UNDER_REVIEW', 'CANCELLED', 'DRAFT'],
    UNDER_REVIEW: ['WAITING_DOCUMENTS', 'ACCEPTED', 'REJECTED', 'WAITING_LIST', 'CANCELLED'],
    WAITING_DOCUMENTS: ['UNDER_REVIEW', 'CANCELLED'],
    WAITING_LIST: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
    ACCEPTED: ['ENROLLED', 'CANCELLED', 'WAITING_LIST'],
    REJECTED: ['UNDER_REVIEW', 'CANCELLED'],
    ENROLLED: ['CANCELLED'],
    CANCELLED: ['DRAFT', 'UNDER_REVIEW'],
  };

  constructor(status: ApplicantStatus) {
    this.value = status;
  }

  public getValue(): ApplicantStatus {
    return this.value;
  }

  public canTransitionTo(targetStatus: ApplicantStatus): boolean {
    const allowed = ApplicantStatusValueObject.ALLOWED_TRANSITIONS[this.value] || [];
    return allowed.includes(targetStatus);
  }

  public validateTransition(targetStatus: ApplicantStatus): void {
    if (this.value === targetStatus) return; // same status is fine
    if (!this.canTransitionTo(targetStatus)) {
      throw new InvalidStatusTransitionError(this.value, targetStatus);
    }
  }

  public isTerminal(): boolean {
    return this.value === 'ENROLLED';
  }
}
