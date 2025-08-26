// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Optimized role-based navigation items based on your permission matrix
  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      roles: ['*']
    },
    {
      path: '/entities',
      label: 'Entities',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER']
    },
    {
      path: '/properties',
      label: 'Properties',
      roles: ['*']
    },
    {
      path: '/tenants',
      label: 'Tenants',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER']
    },
    {
      path: '/leases',
      label: 'Leases',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER']
    },
    {
      path: '/maintenance',
      label: 'Maintenance',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER', 'MAINTENANCE']
    },
    {
      path: '/financials',
      label: 'Financial',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'ACCOUNTANT']
    },
    {
      path: '/reports',
      label: 'Reports',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER', 'ACCOUNTANT']
    },
    {
      path: '/users',
      label: 'Users',
      roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'ENTITY_MANAGER']
    },
  ];

  const filteredNavItems = navigationItems.filter(item =>
    item.roles.includes('*') || item.roles.includes(user?.role || '')
  );

  return (
    <>
      <style>{`
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          height: 4rem;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #374151;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .mobile-menu-btn:hover {
          background: #f3f4f6;
        }

        .header-logo {
          flex-shrink: 0;
        }

        .logo-link {
          text-decoration: none;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          justify-content: center;
          margin: 0 2rem;
        }

        .nav-link {
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #6b7280;
          font-weight: 500;
          border-radius: 0.5rem;
          transition: all 0.2s;
          position: relative;
          font-size: 0.875rem;
        }

        .nav-link:hover {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
        }

        .nav-link-active {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          font-weight: 600;
        }

        .nav-link-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 80%;
          height: 2px;
          background: #6366f1;
          border-radius: 1px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .header-action-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0.75rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .header-action-btn:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .notification-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #ef4444;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 0.75rem;
          min-width: 1.25rem;
          height: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-menu {
          position: relative;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .user-menu-trigger:hover {
          background: #f3f4f6;
        }

        .user-avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .user-name {
          color: #374151;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .user-menu-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 0.5rem);
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          min-width: 200px;
          z-index: 50;
          overflow: hidden;
        }

        .user-menu-header {
          padding: 1rem;
          background: #f9fafb;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar-large {
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
        }

        .user-full-name {
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
          font-size: 0.875rem;
        }

        .user-email {
          color: #6b7280;
          margin: 0;
          font-size: 0.75rem;
        }

        .user-menu-divider {
          height: 1px;
          background: #e5e7eb;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #374151;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .user-menu-item:hover {
          background: #f3f4f6;
          color: #111827;
        }

        .user-menu-logout {
          color: #dc2626;
        }

        .user-menu-logout:hover {
          background: #fef2f2;
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }

          .desktop-nav {
            display: none;
          }

          .header-content {
            padding: 0 0.75rem;
          }

          .user-name {
            display: none;
          }

          .header-actions {
            gap: 0.25rem;
          }

          .header-action-btn {
            padding: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .header-action-btn:not(.user-menu-trigger) {
            display: none;
          }

          .logo-text {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <header className="header">
        <div className="header-content">
          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={onMobileMenuOpen}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <div className="header-logo">
            <Link to="/dashboard" className="logo-link">
              <h1 className="logo-text">PropFlow</h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {filteredNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActiveRoute(item.path) ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="header-actions">
            {/* Search */}
            <button className="header-action-btn" aria-label="Search">
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button className="header-action-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>

            {/* User menu */}
            <div className="user-menu">
              <button
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="User menu"
              >
                <div className="user-avatar">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <span className="user-name">{user?.firstName}</span>
              </button>

              {showUserMenu && (
                <div className="user-menu-dropdown">
                  <div className="user-menu-header">
                    <div className="user-avatar-large">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="user-full-name">{user?.firstName} {user?.lastName}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="user-menu-divider"></div>
                  <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                    <User size={16} />
                    Profile
                  </Link>
                  <Link to="/settings" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                    <Settings size={16} />
                    Settings
                  </Link>
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-item user-menu-logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};