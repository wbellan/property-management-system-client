import React, { useState } from 'react';
import { Menu, Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuOpen }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
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
          <h1 className="logo-text">PropFlow</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="/dashboard" className="nav-link nav-link-active">Dashboard</a>
          <a href="/properties" className="nav-link">Properties</a>
          <a href="/tenants" className="nav-link">Tenants</a>
          <a href="/leases" className="nav-link">Leases</a>
          <a href="/maintenance" className="nav-link">Maintenance</a>
          <a href="/reports" className="nav-link">Reports</a>
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
                <button className="user-menu-item">
                  <User size={16} />
                  Profile
                </button>
                <button className="user-menu-item">
                  <Settings size={16} />
                  Settings
                </button>
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
