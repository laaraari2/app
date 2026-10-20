import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuditLog, Permission } from '../types/auth';
import { ROLE_PERMISSIONS, hasPermission } from '../lib/rbac';
import { apiClient } from '../lib/apiClient';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  activeRole: UserRole;
  switchRole: (newRole: UserRole) => void;
  checkPermission: (permission: Permission | Permission[]) => boolean;
  logout: () => void;
  auditLogs: AuditLog[];
  logActivity: (action: string, module: string, details: string) => void;
}

const DEFAULT_USER: User = {
  id: 'usr_owner_01',
  tenantId: 'sch_casablanca_01',
  branchId: 'br_main_01',
  fullName: 'أستاذ عبد الرحيم الإدريسي / Prof. Abdelrahim Idrissi',
  email: 'a.idrissi@eduvora.ma',
  role: 'SCHOOL_OWNER',
  roles: ['SCHOOL_OWNER'],
  preferredLanguage: 'ar',
  permissions: ROLE_PERMISSIONS['SCHOOL_OWNER'],
  isActive: true,
  lastLoginAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [currentUser, setCurrentUser] = useState<User | null>(() => {
  const savedUser = localStorage.getItem('eduvora_user');
  return savedUser ? JSON.parse(savedUser) : null;
});
  const [activeRole, setActiveRole] = useState<UserRole>('SCHOOL_OWNER');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_101',
      tenantId: 'sch_casablanca_01',
      userId: 'usr_owner_01',
      userName: 'أستاذ عبد الرحيم الإدريسي',
      userRole: 'SCHOOL_OWNER',
      action: 'LOGIN_SUCCESS',
      module: 'AUTH',
      details: 'Connexion réussie depuis Casablanca (CFC Tower)',
      ipAddress: '197.230.14.88',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'log_102',
      tenantId: 'sch_casablanca_01',
      userId: 'usr_owner_01',
      userName: 'أستاذ عبد الرحيم الإدريسي',
      userRole: 'SCHOOL_OWNER',
      action: 'MASSAR_SYNC_COMPLETE',
      module: 'MASSAR',
      details: 'Synchronisation de 450 fiches élèves avec la plateforme du Ministère',
      ipAddress: '197.230.14.88',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ]);

  useEffect(() => {
    if (currentUser?.tenantId) {
      apiClient.setTenantId(currentUser.tenantId);
    }
  }, [currentUser]);

  const switchRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        role: newRole,
        permissions: ROLE_PERMISSIONS[newRole],
      };
      setCurrentUser(updatedUser);
      logActivity('ROLE_SWITCH', 'RBAC', `Passage au rôle ${newRole}`);
    }
  };

  const checkPermission = (permission: Permission | Permission[] | string | string[]): boolean => {
    if (!currentUser) return false;
    return hasPermission(currentUser.permissions || [], permission as any);
  };

  const logActivity = (action: string, module: string, details: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      tenantId: currentUser.tenantId,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userRole: currentUser.role,
      action,
      module,
      details,
      ipAddress: '197.230.14.88',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Eduvora-Platform': 'SaaS-Enterprise-V2',
    },
    body: JSON.stringify({ email, password }),
  });

  const result = await response.json();

  if (!response.ok || result.status !== 'success') {
    throw new Error(result.message || 'Email ou mot de passe incorrect.');
  }

  const { user, accessToken } = result.data;

  if (!user || !accessToken) {
    throw new Error('Réponse invalide du serveur.');
  }

setCurrentUser(user);
setActiveRole(user.role || user.roles?.[0] || 'USER');
console.log('User role:', user.role, 'User roles:', user.roles);

localStorage.setItem('eduvora_user', JSON.stringify(user));
localStorage.setItem('eduvora_access_token', accessToken);

apiClient.setAuthToken(accessToken);
};

 const logout = () => {
  localStorage.removeItem('eduvora_user');
  localStorage.removeItem('eduvora_access_token');

  setCurrentUser(null);
  setActiveRole(null);
  apiClient.setAuthToken('');
};

  return (
   
<AuthContext.Provider
  value={{
    login,
    currentUser,
    isAuthenticated: !!currentUser,
    activeRole,
    switchRole,
    checkPermission,
    logout,
    auditLogs,
    logActivity,
  }}
>

      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
