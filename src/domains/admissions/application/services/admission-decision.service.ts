import { applicantRepository } from '../../infrastructure/persistence/applicant.repository';
import { applicantService } from './applicant.service';
import { AdmissionDecision } from '../../domain/entities/admissions-types';
import { SubmitAdmissionDecisionDto } from '../../dto/admissions.dto';
import { auditService } from '../../../../services/audit.service';
import { submitDecisionSchema } from '../../validators/admissions.validator';
import { admissionsNotificationService } from './admissions-notification.service';

export class AdmissionDecisionService {
  public async submitDecision(
    tenantId: string,
    applicantId: string,
    dto: SubmitAdmissionDecisionDto,
    userId?: string,
    userEmail?: string
  ): Promise<AdmissionDecision> {
    const applicant = await applicantService.getApplicantById(applicantId, tenantId);
    const validated = submitDecisionSchema.parse(dto);

    // Update applicant status using domain rules
    await applicantService.changeApplicantStatus(
      applicant.id,
      tenantId,
      validated.decision,
      userId,
      userEmail
    );

    const decision: AdmissionDecision = {
      id: `dec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      applicantId: applicant.id,
      decision: validated.decision,
      decisionDate: new Date(),
      decidedBy: userId || 'system',
      decidedByName: userEmail || 'Commission d\'Admission',
      reason: validated.reason,
      waitingListRank: validated.decision === 'WAITING_LIST' ? validated.waitingListRank || 1 : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      isDeleted: false,
    };

    const saved = await applicantRepository.saveDecision(decision);

    // Send decision notification
    const primaryGuardian = applicant.guardians.find(g => g.isPrimary) || applicant.guardians[0];
    const decisionTitles: Record<string, string> = {
      ACCEPTED: 'Félicitations! Candidature Acceptée',
      REJECTED: 'Décision sur votre candidature',
      WAITING_LIST: 'Candidature placée sur Liste d\'Attente',
    };
    const decisionBodies: Record<string, string> = {
      ACCEPTED: `Nous avons le plaisir de vous informer que ${applicant.firstName} ${applicant.lastName} est admis(e). Vous pouvez procéder à l'inscription.`,
      REJECTED: `Suite à l'examen de votre dossier, nous ne sommes pas en mesure de donner une suite favorable à la candidature de ${applicant.firstName} ${applicant.lastName}.`,
      WAITING_LIST: `Votre dossier pour ${applicant.firstName} ${applicant.lastName} est placé en liste d'attente (Rang N° ${saved.waitingListRank || 1}).`,
    };

    await admissionsNotificationService.emitNotification(
      tenantId,
      'DECISION_ISSUED',
      decisionTitles[validated.decision],
      decisionBodies[validated.decision],
      primaryGuardian?.email || applicant.email,
      primaryGuardian?.phone || applicant.phone,
      { applicantId: applicant.id, decision: validated.decision }
    );

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'ADMISSION_DECISION_SUBMIT',
      resource: 'admissions:decision',
      resourceId: saved.id,
      details: { applicantId, decision: saved.decision },
    });

    return saved;
  }

  public async getApplicantDecision(tenantId: string, applicantId: string): Promise<AdmissionDecision | null> {
    await applicantService.getApplicantById(applicantId, tenantId);
    return applicantRepository.getDecisionByApplicantId(applicantId, tenantId);
  }
}

export const admissionDecisionService = new AdmissionDecisionService();
