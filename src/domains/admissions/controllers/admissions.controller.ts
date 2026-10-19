import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../types/auth';
import { admissionCampaignService } from '../application/services/admission-campaign.service';
import { registrationPeriodService } from '../application/services/registration-period.service';
import { applicantService } from '../application/services/applicant.service';
import { applicantDocumentService } from '../application/services/applicant-document.service';
import { applicantInterviewService } from '../application/services/applicant-interview.service';
import { applicantExamService } from '../application/services/applicant-exam.service';
import { admissionDecisionService } from '../application/services/admission-decision.service';
import { waitingListService } from '../application/services/waiting-list.service';
import { enrollmentService } from '../application/services/enrollment.service';
import { admissionsImportExportService } from '../application/services/admissions-import-export.service';
import { admissionsActivityService } from '../application/services/admissions-activity.service';
import { admissionsNotificationService } from '../application/services/admissions-notification.service';

export class AdmissionsController {
  // --- Campaign Handlers ---
  public async getCampaigns(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const result = await admissionCampaignService.getPaginatedCampaigns(tenantId, {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        status: req.query.status as string,
        academicYearId: req.query.academicYearId as string,
      });
      res.json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  }

  public async getCampaignById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const campaign = await admissionCampaignService.getCampaignById(req.params.id, tenantId);
      res.json({ status: 'success', data: campaign });
    } catch (err) {
      next(err);
    }
  }

  public async createCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const campaign = await admissionCampaignService.createCampaign(
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: campaign });
    } catch (err) {
      next(err);
    }
  }

  public async updateCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const campaign = await admissionCampaignService.updateCampaign(
        req.params.id,
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: campaign });
    } catch (err) {
      next(err);
    }
  }

  public async deleteCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await admissionCampaignService.softDeleteCampaign(req.params.id, tenantId, req.user?.id, req.user?.email);
      res.json({ status: 'success', message: 'Campaign soft deleted' });
    } catch (err) {
      next(err);
    }
  }

  public async restoreCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const campaign = await admissionCampaignService.restoreCampaign(
        req.params.id,
        tenantId,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: campaign });
    } catch (err) {
      next(err);
    }
  }

  // --- Registration Period Handlers ---
  public async getPeriods(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const result = await registrationPeriodService.getPaginatedPeriods(tenantId, {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        campaignId: req.query.campaignId as string,
        status: req.query.status as string,
      });
      res.json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  }

  public async createPeriod(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const period = await registrationPeriodService.createPeriod(
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: period });
    } catch (err) {
      next(err);
    }
  }

  // --- Applicant Handlers ---
  public async getApplicants(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const result = await applicantService.getPaginatedApplicants(tenantId, {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        status: req.query.status as string,
        campaignId: req.query.campaignId as string,
        periodId: req.query.periodId as string,
        academicYearId: req.query.academicYearId as string,
        targetGradeId: req.query.targetGradeId as string,
      });
      res.json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  }

  public async getApplicantById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const applicant = await applicantService.getApplicantById(req.params.id, tenantId);
      res.json({ status: 'success', data: applicant });
    } catch (err) {
      next(err);
    }
  }

  public async createApplicant(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const applicant = await applicantService.createApplicant(
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: applicant });
    } catch (err) {
      next(err);
    }
  }

  public async updateApplicant(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const applicant = await applicantService.updateApplicant(
        req.params.id,
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: applicant });
    } catch (err) {
      next(err);
    }
  }

  public async deleteApplicant(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      await applicantService.softDeleteApplicant(req.params.id, tenantId, req.user?.id, req.user?.email);
      res.json({ status: 'success', message: 'Applicant soft deleted' });
    } catch (err) {
      next(err);
    }
  }

  public async restoreApplicant(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const applicant = await applicantService.restoreApplicant(
        req.params.id,
        tenantId,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: applicant });
    } catch (err) {
      next(err);
    }
  }

  public async bulkApplicantAction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const result = await applicantService.executeBulkAction(
        tenantId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  }

  // --- Document Verification Handlers ---
  public async uploadDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const doc = await applicantDocumentService.uploadDocument(
        tenantId,
        req.params.id,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: doc });
    } catch (err) {
      next(err);
    }
  }

  public async getApplicantDocuments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const docs = await applicantDocumentService.getApplicantDocuments(tenantId, req.params.id);
      res.json({ status: 'success', data: docs });
    } catch (err) {
      next(err);
    }
  }

  public async verifyDocument(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const doc = await applicantDocumentService.verifyDocument(
        tenantId,
        req.params.docId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: doc });
    } catch (err) {
      next(err);
    }
  }

  // --- Interview & Exam Handlers ---
  public async scheduleInterview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const interview = await applicantInterviewService.scheduleInterview(
        tenantId,
        req.params.id,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: interview });
    } catch (err) {
      next(err);
    }
  }

  public async evaluateInterview(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const interview = await applicantInterviewService.evaluateInterview(
        tenantId,
        req.params.interviewId,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: interview });
    } catch (err) {
      next(err);
    }
  }

  public async scheduleExam(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const exam = await applicantExamService.createExam(
        tenantId,
        req.params.id,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: exam });
    } catch (err) {
      next(err);
    }
  }

  // --- Decision & Waiting List Handlers ---
  public async submitDecision(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const decision = await admissionDecisionService.submitDecision(
        tenantId,
        req.params.id,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: decision });
    } catch (err) {
      next(err);
    }
  }

  public async getWaitingList(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const list = await waitingListService.getWaitingList(tenantId, req.query.campaignId as string);
      res.json({ status: 'success', data: list });
    } catch (err) {
      next(err);
    }
  }

  public async promoteFromWaitingList(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const applicant = await waitingListService.promoteFromWaitingList(
        tenantId,
        req.params.id,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', data: applicant });
    } catch (err) {
      next(err);
    }
  }

  // --- Enrollment Handler ---
  public async enrollApplicant(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const student = await enrollmentService.enrollApplicant(
        tenantId,
        req.params.id,
        req.body,
        req.user?.id,
        req.user?.email
      );
      res.status(201).json({ status: 'success', data: student });
    } catch (err) {
      next(err);
    }
  }

  public async getEnrolledStudents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const result = await enrollmentService.getEnrolledStudents(tenantId, {
        page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
        search: req.query.search as string,
        academicYearId: req.query.academicYearId as string,
        targetGradeId: req.query.targetGradeId as string,
      });
      res.json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  }

  // --- Import / Export Handlers ---
  public async importApplicantsCsv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const { csvContent, campaignId, periodId, academicYearId, targetGradeId } = req.body;
      const result = await admissionsImportExportService.importApplicantsCsv(
        tenantId,
        csvContent,
        campaignId,
        periodId,
        academicYearId,
        targetGradeId,
        req.user?.id,
        req.user?.email
      );
      res.json({ status: 'success', ...result });
    } catch (err) {
      next(err);
    }
  }

  public async exportApplicantsCsv(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const csv = await admissionsImportExportService.exportApplicantsCsv(tenantId, req.query.campaignId as string);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="applicants_export.csv"');
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }

  // --- Activity & Notifications Handlers ---
  public async getActivityTimeline(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const logs = await admissionsActivityService.getEntityActivityTimeline(tenantId, req.query.resourceId as string);
      res.json({ status: 'success', data: logs });
    } catch (err) {
      next(err);
    }
  }

  public async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.tenantContext?.tenantId || req.user?.tenantId!;
      const notifs = await admissionsNotificationService.getNotificationsForTenant(tenantId);
      res.json({ status: 'success', data: notifs });
    } catch (err) {
      next(err);
    }
  }
}

export const admissionsController = new AdmissionsController();
