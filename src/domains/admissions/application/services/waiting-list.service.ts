import { applicantRepository } from '../../infrastructure/persistence/applicant.repository';
import { applicantService } from './applicant.service';
import { Applicant } from '../../domain/entities/admissions-types';
import { auditService } from '../../../../services/audit.service';
import { admissionsNotificationService } from './admissions-notification.service';

export class WaitingListService {
  public async getWaitingList(tenantId: string, campaignId?: string): Promise<Applicant[]> {
    const res = await applicantRepository.getPaginated(tenantId, {
      status: 'WAITING_LIST',
      campaignId,
      limit: 1000,
    });

    const items = res.data;
    // Sort by decision waiting list rank if available
    for (const app of items) {
      const decision = await applicantRepository.getDecisionByApplicantId(app.id, tenantId);
      (app as any).waitingListRank = decision?.waitingListRank || 999;
    }

    items.sort((a, b) => ((a as any).waitingListRank || 999) - ((b as any).waitingListRank || 999));
    return items;
  }

  public async promoteFromWaitingList(
    tenantId: string,
    applicantId: string,
    userId?: string,
    userEmail?: string
  ): Promise<Applicant> {
    const applicant = await applicantService.getApplicantById(applicantId, tenantId);

    // Promote status from WAITING_LIST -> ACCEPTED
    const updated = await applicantService.changeApplicantStatus(
      applicant.id,
      tenantId,
      'ACCEPTED',
      userId,
      userEmail
    );

    const primaryGuardian = updated.guardians.find(g => g.isPrimary) || updated.guardians[0];
    await admissionsNotificationService.emitNotification(
      tenantId,
      'WAITING_LIST_UPDATE',
      'Mise à jour Liste d\'Attente: Candidature Acceptée!',
      `Bonne nouvelle! Suite à des libérations de places, la candidature de ${updated.firstName} ${updated.lastName} est maintenant ACCEPTÉE.`,
      primaryGuardian?.email || updated.email,
      primaryGuardian?.phone || updated.phone,
      { applicantId: updated.id }
    );

    await auditService.log({
      tenantId,
      userId: userId || 'system',
      userEmail: userEmail || 'system@eduvora.com',
      action: 'WAITING_LIST_PROMOTE',
      resource: 'admissions:waiting_list',
      resourceId: updated.id,
    });

    return updated;
  }
}

export const waitingListService = new WaitingListService();
