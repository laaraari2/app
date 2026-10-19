import { db } from '../../../../db/store';
import {
  Applicant,
  ApplicantDocument,
  ApplicantInterview,
  ApplicantExam,
  AdmissionDecision,
  PaginationAndFilterOptions,
  PaginatedResult,
} from '../../domain/entities/admissions-types';

export class ApplicantRepository {
  // --- Applicant core ---
  public async findById(id: string, tenantId: string): Promise<Applicant | null> {
    const applicant = db.applicants.get(id);
    if (!applicant || applicant.tenantId !== tenantId) return null;
    return applicant;
  }

  public async findByApplicationNumber(appNum: string, tenantId: string): Promise<Applicant | null> {
    for (const app of db.applicants.values()) {
      if (app.tenantId === tenantId && app.applicationNumber === appNum && !app.isDeleted) {
        return app;
      }
    }
    return null;
  }

  public async save(applicant: Applicant): Promise<Applicant> {
    db.applicants.set(applicant.id, applicant);
    return applicant;
  }

  public async getNextApplicationSequence(tenantId: string, academicYearId: string): Promise<number> {
    let count = 0;
    for (const app of db.applicants.values()) {
      if (app.tenantId === tenantId && app.academicYearId === academicYearId) {
        count++;
      }
    }
    return count + 1;
  }

  public async getPaginated(
    tenantId: string,
    options: PaginationAndFilterOptions
  ): Promise<PaginatedResult<Applicant>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const search = options.search?.toLowerCase().trim();

    let items = Array.from(db.applicants.values()).filter(a => a.tenantId === tenantId);

    if (!options.includeDeleted) {
      items = items.filter(a => !a.isDeleted);
    }

    if (options.campaignId) items = items.filter(a => a.campaignId === options.campaignId);
    if (options.periodId) items = items.filter(a => a.periodId === options.periodId);
    if (options.academicYearId) items = items.filter(a => a.academicYearId === options.academicYearId);
    if (options.targetGradeId) items = items.filter(a => a.targetGradeId === options.targetGradeId);
    if (options.status) items = items.filter(a => a.status === options.status);

    if (search) {
      items = items.filter(
        a =>
          a.firstName.toLowerCase().includes(search) ||
          a.lastName.toLowerCase().includes(search) ||
          a.applicationNumber.toLowerCase().includes(search) ||
          (a.email && a.email.toLowerCase().includes(search)) ||
          (a.nationalId && a.nationalId.toLowerCase().includes(search))
      );
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;

    return {
      data: items.slice(startIndex, startIndex + limit),
      total,
      page,
      limit,
      totalPages,
    };
  }

  // --- Sub-entities: Documents ---
  public async saveDocument(doc: ApplicantDocument): Promise<ApplicantDocument> {
    db.applicantDocuments.set(doc.id, doc);
    return doc;
  }

  public async getDocumentsByApplicantId(applicantId: string, tenantId: string): Promise<ApplicantDocument[]> {
    return Array.from(db.applicantDocuments.values()).filter(
      d => d.applicantId === applicantId && d.tenantId === tenantId && !d.isDeleted
    );
  }

  public async findDocumentById(docId: string, tenantId: string): Promise<ApplicantDocument | null> {
    const doc = db.applicantDocuments.get(docId);
    if (!doc || doc.tenantId !== tenantId) return null;
    return doc;
  }

  // --- Sub-entities: Interviews ---
  public async saveInterview(interview: ApplicantInterview): Promise<ApplicantInterview> {
    db.applicantInterviews.set(interview.id, interview);
    return interview;
  }

  public async getInterviewsByApplicantId(applicantId: string, tenantId: string): Promise<ApplicantInterview[]> {
    return Array.from(db.applicantInterviews.values()).filter(
      i => i.applicantId === applicantId && i.tenantId === tenantId && !i.isDeleted
    );
  }

  public async findInterviewById(interviewId: string, tenantId: string): Promise<ApplicantInterview | null> {
    const interview = db.applicantInterviews.get(interviewId);
    if (!interview || interview.tenantId !== tenantId) return null;
    return interview;
  }

  // --- Sub-entities: Exams ---
  public async saveExam(exam: ApplicantExam): Promise<ApplicantExam> {
    db.applicantExams.set(exam.id, exam);
    return exam;
  }

  public async getExamsByApplicantId(applicantId: string, tenantId: string): Promise<ApplicantExam[]> {
    return Array.from(db.applicantExams.values()).filter(
      e => e.applicantId === applicantId && e.tenantId === tenantId && !e.isDeleted
    );
  }

  // --- Sub-entities: Decision ---
  public async saveDecision(decision: AdmissionDecision): Promise<AdmissionDecision> {
    db.admissionDecisions.set(decision.id, decision);
    return decision;
  }

  public async getDecisionByApplicantId(applicantId: string, tenantId: string): Promise<AdmissionDecision | null> {
    for (const d of db.admissionDecisions.values()) {
      if (d.applicantId === applicantId && d.tenantId === tenantId && !d.isDeleted) {
        return d;
      }
    }
    return null;
  }
}

export const applicantRepository = new ApplicantRepository();
