import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { PropertiesPage } from '../../pages/properties/PropertiesPage';
import { TenantsPage } from '../../pages/tenants/TenantsPage';
import { ReportsPage } from '../../pages/reports/ReportsPage';

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
          <Route path="/reports/*" element={<ReportsPage />} />
          <Route path="/leases" element={<div className="page-placeholder">Leases Page Coming Soon</div>} />
          <Route path="/maintenance" element={<div className="page-placeholder">Maintenance Page Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
};
