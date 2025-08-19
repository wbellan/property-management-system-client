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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/properties/*" element={<PropertiesPage />} />
          <Route path="/tenants/*" element={<TenantsPage />} />
          <Route path="/leases/*" element={<LeasesPage />} />
          <Route path="/maintenance/*" element={<MaintenancePage />} />
          <Route path="/reports/*" element={<ReportsPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};
