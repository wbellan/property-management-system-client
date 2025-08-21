import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { PropertiesPage } from '../../pages/properties/PropertiesPage';
import { TenantsPage } from '../../pages/tenants/TenantsPage';
import { LeasesPage } from '../../pages/leases/LeasesPage';
import { MaintenancePage } from '../../pages/maintenance/MaintenancePage';
import { ReportsPage } from '../../pages/reports/ReportsPage';
import { SettingsPage } from '../../pages/settings/SettingsPage';
import { UsersPage } from '../../pages/users';
import { ProtectedRoute } from './ProtectedRoute';

export const DashboardLayout: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient">
      <Header onMobileMenuOpen={() => setIsMobileNavOpen(true)} />

      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <main className="main-content">
        <Routes>
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/users/*" element={
            <ProtectedRoute requiredRoles={['ORG_ADMIN', 'ENTITY_MANAGER']}>
              <UsersPage />
            </ProtectedRoute>
          } />
          <Route path="/properties/*" element={
            <ProtectedRoute>
              <PropertiesPage />
            </ProtectedRoute>
          } />
          <Route path="/tenants/*" element={
            <ProtectedRoute requiredRoles={['ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER']}>
              <TenantsPage />
            </ProtectedRoute>
          } />
          <Route path="/leases/*" element={
            <ProtectedRoute>
              <LeasesPage />
            </ProtectedRoute>
          } />

          <Route path="/maintenance/*" element={
            <ProtectedRoute>
              <MaintenancePage />
            </ProtectedRoute>
          } />

          <Route path="/reports/*" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
          {/* <Route path="/settings/*" element={<SettingsPage />} /> */}

          <Route path="/settings/*" element={
            <ProtectedRoute requiredRoles={['ORG_ADMIN', 'ENTITY_MANAGER']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};
