import React from 'react';
import {
  X,
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wrench,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'properties', label: 'Properties', icon: Building2, href: '/properties' },
  { id: 'tenants', label: 'Tenants', icon: Users, href: '/tenants' },
  { id: 'leases', label: 'Leases', icon: FileText, href: '/leases' },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench, href: '/maintenance' },
  { id: 'reports', label: 'Reports', icon: BarChart3, href: '/reports' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-nav-overlay">
      <div className="mobile-nav-backdrop" onClick={onClose}></div>
      <div className="mobile-nav">
        <div className="mobile-nav-header">
          <div className="mobile-nav-logo">
            <h2>PropFlow</h2>
          </div>
          <button onClick={onClose} className="mobile-nav-close">
            <X size={24} />
          </button>
        </div>

        <nav className="mobile-nav-menu">
          {navItems.map((item) => (
            <a             
              key={item.id}
              href={item.href}
              className="mobile-nav-item"
              onClick={onClose}
            >
              <item.icon size={20} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mobile-nav-footer">
          <div className="mobile-nav-user">
            <div className="user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="user-name">{user?.firstName} {user?.lastName}</p>
              <p className="user-role">{user?.role}</p>
            </div>
          </div>

          <div className="mobile-nav-actions">
            <button className="mobile-nav-action">
              <Settings size={20} />
              Settings
            </button>
            <button className="mobile-nav-action" onClick={handleLogout}>
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
