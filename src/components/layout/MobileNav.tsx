// src/components/layout/MobileNav.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  FileText,
  Wrench,
  DollarSign,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Optimized role-based navigation items matching the header
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['*']
    },
    {
      id: 'properties',
      label: 'Properties',
      icon: Building2,
      href: '/properties',
      roles: ['*']
    },
    {
      id: 'tenants',
      label: 'Tenants',
      icon: UserCheck,
      href: '/tenants',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER']
    },
    {
      id: 'leases',
      label: 'Leases',
      icon: FileText,
      href: '/leases',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER']
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      href: '/maintenance',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER', 'MAINTENANCE']
    },
    {
      id: 'financials',
      label: 'Financial',
      icon: DollarSign,
      href: '/financials',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'ACCOUNTANT']
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      href: '/reports',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER', 'ACCOUNTANT']
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      href: '/users',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER']
    },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes('*') || item.roles.includes(user?.role || '')
  );

  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'ORG_ADMIN': 'Organization Admin',
      'ENTITY_MANAGER': 'Entity Manager',
      'PROPERTY_MANAGER': 'Property Manager',
      'ACCOUNTANT': 'Accountant',
      'MAINTENANCE': 'Maintenance Staff',
      'TENANT': 'Tenant'
    };
    return roleMap[role] || role;
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
          display: flex;
        }

        .mobile-nav-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }

        .mobile-nav {
          position: relative;
          width: 280px;
          height: 100vh;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .mobile-nav-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.9);
        }

        .mobile-nav-logo h2 {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .mobile-nav-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .mobile-nav-close:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .mobile-nav-menu {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .mobile-nav-item:hover {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          border-left-color: #6366f1;
        }

        .mobile-nav-item-active {
          background: rgba(99, 102, 241, 0.1);
          color: #6366f1;
          border-left-color: #6366f1;
          font-weight: 600;
        }

        .mobile-nav-footer {
          border-top: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.9);
        }

        .mobile-nav-user {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .user-name {
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
        }

        .user-role {
          color: #6b7280;
          margin: 0;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .mobile-nav-actions {
          padding: 0 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-action {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: none;
          border: none;
          border-radius: 0.5rem;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s;
          cursor: pointer;
          text-align: left;
          width: 100%;
        }

        .mobile-nav-action:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .mobile-nav-action:last-child {
          color: #dc2626;
        }

        .mobile-nav-action:last-child:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        @media (min-width: 769px) {
          .mobile-nav-overlay {
            display: none;
          }
        }

        @media (max-width: 320px) {
          .mobile-nav {
            width: 100vw;
          }
        }
      `}</style>

      <div className="mobile-nav-overlay">
        <div className="mobile-nav-backdrop" onClick={onClose}></div>
        <div className="mobile-nav">
          <div className="mobile-nav-header">
            <div className="mobile-nav-logo">
              <h2>PropFlow</h2>
            </div>
            <button onClick={onClose} className="mobile-nav-close" aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          <nav className="mobile-nav-menu">
            {filteredNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                className={`mobile-nav-item ${isActiveRoute(item.href) ? 'mobile-nav-item-active' : ''}`}
                onClick={onClose}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mobile-nav-footer">
            <div className="mobile-nav-user">
              <div className="user-avatar">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="user-name">{user?.firstName} {user?.lastName}</p>
                <p className="user-role">{formatRole(user?.role || '')}</p>
              </div>
            </div>

            <div className="mobile-nav-actions">
              <Link to="/settings" className="mobile-nav-action" onClick={onClose}>
                <Settings size={20} />
                Settings
              </Link>
              <button className="mobile-nav-action" onClick={handleLogout}>
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};