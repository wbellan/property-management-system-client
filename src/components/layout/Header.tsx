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
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActiveRoute('/dashboard') ? 'nav-link-active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/properties" 
            className={`nav-link ${isActiveRoute('/properties') ? 'nav-link-active' : ''}`}
          >
            Properties
          </Link>
          <Link 
            to="/tenants" 
            className={`nav-link ${isActiveRoute('/tenants') ? 'nav-link-active' : ''}`}
          >
            Tenants
          </Link>
          <Link 
            to="/leases" 
            className={`nav-link ${isActiveRoute('/leases') ? 'nav-link-active' : ''}`}
          >
            Leases
          </Link>
          <Link 
            to="/maintenance" 
            className={`nav-link ${isActiveRoute('/maintenance') ? 'nav-link-active' : ''}`}
          >
            Maintenance
          </Link>
          <Link 
            to="/reports" 
            className={`nav-link ${isActiveRoute('/reports') ? 'nav-link-active' : ''}`}
          >
            Reports
          </Link>
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
