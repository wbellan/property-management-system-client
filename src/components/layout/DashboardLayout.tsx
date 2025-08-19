import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { PropertiesPage } from '../../pages/properties/PropertiesPage';
// Import other pages as we create them

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
          <Route path="/tenants" element={<div className="page-placeholder">Tenants Page Coming Soon</div>} />
          <Route path="/leases" element={<div className="page-placeholder">Leases Page Coming Soon</div>} />
          <Route path="/maintenance" element={<div className="page-placeholder">Maintenance Page Coming Soon</div>} />
          <Route path="/reports" element={<div className="page-placeholder">Reports Page Coming Soon</div>} />
        </Routes>
      </main>
    </div>
  );
};
