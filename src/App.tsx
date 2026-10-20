
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './context/I18nContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import { Layout } from './components/Layout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Marketing Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { ProductsPage } from './pages/ProductsPage';
import { PricingPage } from './pages/PricingPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { RequestDemoPage } from './pages/RequestDemoPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SecurityPage } from './pages/SecurityPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { StudentsPage } from './pages/dashboard/StudentsPage';
import { AdmissionsPage } from './pages/dashboard/AdmissionsPage';
import { AcademicPage } from './pages/dashboard/AcademicPage';
import { SchoolLifePage } from './pages/dashboard/SchoolLifePage';
import { StaffPage } from './pages/dashboard/StaffPage';
import { AttendancePage } from './pages/dashboard/AttendancePage';
import { AttendanceTrackingPage } from './pages/dashboard/AttendanceTrackingPage';
import { MassarPage } from './pages/dashboard/MassarPage';
import { FinancePage } from './pages/dashboard/FinancePage';
import { TransportPage } from './pages/dashboard/TransportPage';
import { OrganizationPage } from './pages/dashboard/OrganizationPage';
import { AuditPage } from './pages/dashboard/AuditPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { PlatformDashboardPage } from './pages/platform/PlatformDashboardPage';

function ProtectedApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TenantProvider>
      <NotificationProvider>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/academic" element={<AcademicPage />} />
            <Route path="/school-life" element={<SchoolLifePage />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route
              path="/attendance-tracking"
              element={<AttendanceTrackingPage />}
            />
            <Route path="/massar" element={<MassarPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/organization" element={<OrganizationPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </DashboardLayout>
      </NotificationProvider>
    </TenantProvider>
  );
}

function ProtectedPlatform() {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const roles = currentUser.roles ?? [];

 if (!roles.includes('SUPER_ADMIN')) {
    return <Navigate to="/app" replace />;
  }

  return <PlatformDashboardPage />;
}

export function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing Website */}
            <Route element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/solutions" element={<SolutionsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/request-demo" element={<RequestDemoPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

         {/* Protected School Platform */}
<Route path="/app/*" element={<ProtectedApp />} />

{/* Protected Platform Super Admin */}
<Route path="/platform" element={<ProtectedPlatform />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
