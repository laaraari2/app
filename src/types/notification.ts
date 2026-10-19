export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'MASSAR' | 'FINANCE';

export interface NotificationItem {
  id: string;
  tenantId: string;
  userId: string;
  type: NotificationType;
  titleAr: string;
  titleFr: string;
  messageAr: string;
  messageFr: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
