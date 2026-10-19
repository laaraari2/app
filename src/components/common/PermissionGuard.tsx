import React from 'react';
import { Permission, UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission | Permission[];
  role?: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  role,
  fallback,
}) => {
  const { currentUser, checkPermission } = useAuth();
  const { locale } = useI18n();
  const isAr = locale === 'ar';

  if (!currentUser) {
    return null;
  }

  let hasRoleAccess = true;
  if (role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    hasRoleAccess = rolesArray.includes(currentUser.role);
  }

  let hasPermAccess = true;
  if (permission) {
    hasPermAccess = checkPermission(permission);
  }

  if (hasRoleAccess && hasPermAccess) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 flex items-center gap-4 text-xs font-medium">
      <ShieldAlert className="w-6 h-6 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <div className="font-bold text-sm">
          {isAr ? 'صلاحيات غير كافية الوصول' : 'Accès Restreint par RBAC'}
        </div>
        <p className="mt-0.5 opacity-90">
          {isAr
            ? `دورك الحالي (${currentUser.role}) لا يمتلك الصلاحية لاستخدام هذه الخاصية.`
            : `Votre rôle actuel (${currentUser.role}) ne dispose pas des permissions requises.`}
        </p>
      </div>
    </div>
  );
};
