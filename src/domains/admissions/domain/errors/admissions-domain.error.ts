export class AdmissionsDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdmissionsDomainError';
  }
}

export class InvalidStatusTransitionError extends AdmissionsDomainError {
  constructor(currentStatus: string, targetStatus: string) {
    super(`Invalid applicant status transition from '${currentStatus}' to '${targetStatus}'.`);
    this.name = 'InvalidStatusTransitionError';
  }
}

export class ApplicantNotApprovedError extends AdmissionsDomainError {
  constructor(status: string) {
    super(`Cannot enroll applicant with status '${status}'. Applicant must be 'ACCEPTED' first.`);
    this.name = 'ApplicantNotApprovedError';
  }
}

export class CampaignClosedError extends AdmissionsDomainError {
  constructor(campaignName: string) {
    super(`Admission campaign '${campaignName}' is closed or not active.`);
    this.name = 'CampaignClosedError';
  }
}

export class DocumentValidationError extends AdmissionsDomainError {
  constructor(message: string) {
    super(`Document validation failed: ${message}`);
    this.name = 'DocumentValidationError';
  }
}
