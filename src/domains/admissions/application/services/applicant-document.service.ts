import { applicantRepository } from '../../infrastructure/persistence/applicant.repository';
import { applicantService } from './applicant.service';
import { ApplicantDocument, DocumentStatus } from '../../domain/entities/admissions-types';
import { UploadApplicantDocumentDto, VerifyApplicantDocumentDto } from '../../dto/admissions.dto';
import { NotFoundError } from '../../../../errors/AppError';
import { auditService } from '../../../../services/audit.service';
import { uploadDocumentSchema, verifyDocumentSchema } from '../../validators/admissions.validator';
import { admissionsNotificationService } from './admissions-notification.service';

export class ApplicantDocumentService {
  public async uploadDocument(
    tenantId: string,
    applicantId: string,
    dto: UploadApplicantDocumentDto,
    userId?: string,
    userEmail?: string
  ): Promise<ApplicantDocument> {
    const applicant = await applicantService.getApplicantById(applicantId, tenantId);
    const validated = uploadDocumentSchema.parse(dto);

    const doc: ApplicantDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      applicantId: applicant.id,
      documentType: validated.documentType,
      fileName: validated.fileName,
      fileUrl: validated.fileUrl,
      fileSize: validated.fileSize,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
    };

    const saved = await applicantRepository.saveDocument(doc);

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_DOCUMENT_UPLOAD',
      resource: 'admissions:document',
      resourceId: saved.id,
      details: { applicantId, documentType: saved.documentType, fileName: saved.fileName },
    });

    return saved;
  }

  public async getApplicantDocuments(tenantId: string, applicantId: string): Promise<ApplicantDocument[]> {
    await applicantService.getApplicantById(applicantId, tenantId);
    return applicantRepository.getDocumentsByApplicantId(applicantId, tenantId);
  }

  public async verifyDocument(
    tenantId: string,
    documentId: string,
    dto: VerifyApplicantDocumentDto,
    userId?: string,
    userEmail?: string
  ): Promise<ApplicantDocument> {
    const doc = await applicantRepository.findDocumentById(documentId, tenantId);
    if (!doc || doc.isDeleted) {
      throw new NotFoundError(`Document with ID '${documentId}' not found.`);
    }

    const validated = verifyDocumentSchema.parse(dto);

    doc.status = validated.status;
    doc.rejectionReason = validated.rejectionReason;
    doc.verifiedAt = new Date();
    doc.verifiedBy = userId;
    doc.updatedAt = new Date();

    const saved = await applicantRepository.saveDocument(doc);

    const applicant = await applicantService.getApplicantById(doc.applicantId, tenantId);

    // If document rejected, notify and optionally adjust status to WAITING_DOCUMENTS
    if (validated.status === 'REJECTED') {
      if (applicant.status === 'UNDER_REVIEW' || applicant.status === 'SUBMITTED') {
        await applicantService.changeApplicantStatus(applicant.id, tenantId, 'WAITING_DOCUMENTS', userId, userEmail);
      }

      const primaryGuardian = applicant.guardians.find(g => g.isPrimary) || applicant.guardians[0];
      await admissionsNotificationService.emitNotification(
        tenantId,
        'DOCUMENTS_REQUIRED',
        'Document complémentaire requis',
        `Le document '${doc.documentType}' pour ${applicant.firstName} ${applicant.lastName} a été rejeté. Motif: ${doc.rejectionReason || 'Document non conforme'}. Veuillez fournir un nouveau document.`,
        primaryGuardian?.email || applicant.email,
        primaryGuardian?.phone || applicant.phone,
        { applicantId: applicant.id, documentId: doc.id }
      );
    }

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'APPLICANT_DOCUMENT_VERIFY',
      resource: 'admissions:document',
      resourceId: saved.id,
      details: { status: saved.status, rejectionReason: saved.rejectionReason },
    });

    return saved;
  }
}

export const applicantDocumentService = new ApplicantDocumentService();
