import React, { createContext, useContext, useState } from 'react';
import { NotificationItem, NotificationType } from '../types/notification';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    type: NotificationType,
    titleAr: string,
    titleFr: string,
    messageAr: string,
    messageFr: string
  ) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_001',
    tenantId: 'sch_casablanca_01',
    userId: 'usr_owner_01',
    type: 'MASSAR',
    titleAr: 'مزامنة مسار مكتملة بنجاح',
    titleFr: 'Synchronisation MASSAR réussie',
    messageAr: 'تم تصدير 120 ورقة مراقبة مستمرة للربط الوزاري بدون أخطاء.',
    messageFr: '120 fiches de contrôle continu transférées vers le serveur du Ministère.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'notif_002',
    tenantId: 'sch_casablanca_01',
    userId: 'usr_owner_01',
    type: 'FINANCE',
    titleAr: 'دفع جديد عبر البطاقة CMI',
    titleFr: 'Nouveau paiement par Carte CMI',
    messageAr: 'قام ولي الأمر بنجلون بأداء الواجب الشهري (3,200 درهم) وحصل على الوصل الرقمي.',
    messageFr: 'Paiement reçu du tuteur Benjelloun (3 200 DH) avec reçu CMI numéroté.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const addNotification = (
    type: NotificationType,
    titleAr: string,
    titleFr: string,
    messageAr: string,
    messageFr: string
  ) => {
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}`,
      tenantId: 'sch_casablanca_01',
      userId: 'usr_owner_01',
      type,
      titleAr,
      titleFr,
      messageAr,
      messageFr,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
