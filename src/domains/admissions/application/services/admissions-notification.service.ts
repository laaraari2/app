import { db } from '../../../../db/store';
import { NotificationPayload } from '../../domain/entities/admissions-types';

export class AdmissionsNotificationService {
  public async emitNotification(
    tenantId: string,
    type: NotificationPayload['type'],
    title: string,
    body: string,
    recipientEmail?: string,
    recipientPhone?: string,
    metadata?: Record<string, any>
  ): Promise<NotificationPayload> {
    const notification: NotificationPayload = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      recipientEmail,
      recipientPhone,
      type,
      title,
      body,
      metadata,
      createdAt: new Date(),
    };

    db.notifications.set(notification.id, notification);
    return notification;
  }

  public async getNotificationsForTenant(tenantId: string): Promise<NotificationPayload[]> {
    return Array.from(db.notifications.values())
      .filter(n => n.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export const admissionsNotificationService = new AdmissionsNotificationService();
