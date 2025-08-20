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

  // Role-based navigation items
  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['*'] },
    { path: '/properties', label: 'Properties', roles: ['*'] },
    { path: '/tenants', label: 'Tenants', roles: ['ORG_ADMIN', 'ENTITY_MANAGER', 'PROPERTY_MANAGER'] },
    { path: '/users', label: 'Users', roles: ['ORG_ADMIN', 'ENTITY_MANAGER'] }, // ADD THIS
    { path: '/leases', label: 'Leases', roles: ['*'] },
    { path: '/maintenance', label: 'Maintenance', roles: ['*'] },
    { path: '/reports', label: 'Reports', roles: ['*'] },
  ];

  const filteredNavItems = navigationItems.filter(item =>
    item.roles.includes('*') || item.roles.includes(user?.role || '')
  );

  return (
    <header className="header">
      <div className="header-content">
        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={onMobileMenuOpen}
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
          <button className="header-action-btn">
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button className="header-action-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* User menu */}
          <div className="user-menu">
            <button
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
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
                <Link to="/settings" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
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
  );
};