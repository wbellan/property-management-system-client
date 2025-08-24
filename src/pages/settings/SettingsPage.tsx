// src/pages/settings/SettingsPage.tsx - IMPROVED IMPLEMENTATION
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';
import {
  Palette,
  Bell,
  Shield,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Save,
  AlertCircle,
  Smartphone,
  Key,
  CheckCircle,
  XCircle,
  Globe,
  Clock,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');
  const [userSettings, setUserSettings] = useState<any>({});
  const [orgSettings, setOrgSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: <Palette size={16} />, roles: ['*'] },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />, roles: ['*'] },
    { id: 'security', label: 'Security', icon: <Shield size={16} />, roles: ['*'] },
    { id: 'organization', label: 'Organization', icon: <Building2 size={16} />, roles: ['ORG_ADMIN', 'ENTITY_MANAGER'] }
  ];

  const availableTabs = tabs.filter(tab =>
    tab.roles.includes('*') || tab.roles.includes(user?.role)
  );

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [userRes, orgRes] = await Promise.all([
        apiService.getUserSettings(),
        user?.role && ['ORG_ADMIN', 'ENTITY_MANAGER'].includes(user.role)
          ? apiService.getOrganizationSettings()
          : Promise.resolve({ data: {} })
      ]);
      setUserSettings(userRes.data || {});
      setOrgSettings(orgRes.data || {});
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      await apiService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );

      setPasswordSuccess('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordError(error.message || 'Failed to change password');
    }
  };

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3><Palette size={20} /> Appearance Preferences</h3>
        <p>Customize how the application looks and feels</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <div className="setting-header">
            <Sun size={18} />
            <div>
              <label>Theme</label>
              <small>Choose your preferred color scheme</small>
            </div>
          </div>
          <div className="setting-control">
            <select disabled value="light" className="select-input">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <Globe size={18} />
            <div>
              <label>Language</label>
              <small>Select your preferred language</small>
            </div>
          </div>
          <div className="setting-control">
            <select disabled value="en" className="select-input">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <Clock size={18} />
            <div>
              <label>Timezone</label>
              <small>Set your local timezone for dates and times</small>
            </div>
          </div>
          <div className="setting-control">
            <select disabled value="America/Chicago" className="select-input">
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
            </select>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3><Bell size={20} /> Notification Preferences</h3>
        <p>Control how and when you receive notifications</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <div className="setting-header">
            <div>
              <label>Email Notifications</label>
              <small>Receive updates and alerts via email</small>
            </div>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input type="checkbox" disabled defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <div>
              <label>Push Notifications</label>
              <small>Browser notifications for urgent items</small>
            </div>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input type="checkbox" disabled defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <div>
              <label>Maintenance Alerts</label>
              <small>Get notified about maintenance requests and updates</small>
            </div>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input type="checkbox" disabled defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>

        <div className="setting-card">
          <div className="setting-header">
            <div>
              <label>Payment Reminders</label>
              <small>Reminders for upcoming payments and due dates</small>
            </div>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input type="checkbox" disabled defaultChecked />
              <span className="toggle-slider"></span>
            </label>
            <span className="coming-soon">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3><Shield size={20} /> Security Settings</h3>
        <p>Manage your account security and authentication</p>
      </div>

      {/* Password Change Section */}
      <div className="security-card">
        <div className="card-header">
          <h4><Lock size={18} /> Change Password</h4>
          <p>Update your password to keep your account secure</p>
        </div>

        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="form-row">
            <div className="form-field">
              <label>Current Password</label>
              <div className="password-input">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="password-toggle"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>New Password</label>
              <div className="password-input">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={8}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="password-toggle"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Confirm New Password</label>
              <div className="password-input">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={8}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="password-toggle"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {passwordError && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="alert alert-success">
              <CheckCircle size={16} />
              {passwordSuccess}
            </div>
          )}

          <button type="submit" className="btn-primary">
            <Save size={16} />
            Update Password
          </button>
        </form>
      </div>

      {/* MFA Section */}
      <div className="security-card">
        <div className="card-header">
          <h4><Smartphone size={18} /> Multi-Factor Authentication</h4>
          <p>Add an extra layer of security to your account</p>
        </div>

        <div className="mfa-options">
          <div className="mfa-option">
            <div className="mfa-info">
              <div className="mfa-icon">
                <Smartphone size={20} />
              </div>
              <div>
                <h5>Authenticator App</h5>
                <small>Use an authenticator app like Google Authenticator or Authy</small>
              </div>
            </div>
            <div className="mfa-status">
              <span className="status-badge disabled">
                <XCircle size={14} />
                Not Enabled
              </span>
              <button className="btn-secondary" disabled>
                Enable
              </button>
            </div>
          </div>

          <div className="mfa-option">
            <div className="mfa-info">
              <div className="mfa-icon">
                <Key size={20} />
              </div>
              <div>
                <h5>Security Keys</h5>
                <small>Use hardware security keys for the highest level of protection</small>
              </div>
            </div>
            <div className="mfa-status">
              <span className="status-badge disabled">
                <XCircle size={14} />
                Not Enabled
              </span>
              <button className="btn-secondary" disabled>
                Add Key
              </button>
            </div>
          </div>
        </div>

        <div className="mfa-notice">
          <AlertCircle size={16} />
          Multi-factor authentication will be available in a future update
        </div>
      </div>

      {/* Password Requirements */}
      <div className="info-card">
        <h5>Password Requirements</h5>
        <ul>
          <li>At least 8 characters long</li>
          <li>Mix of uppercase and lowercase letters</li>
          <li>At least one number</li>
          <li>At least one special character</li>
          <li>Cannot reuse your last 5 passwords</li>
        </ul>
      </div>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3><Building2 size={20} /> Organization Settings</h3>
        <p>Manage organization-wide settings and policies</p>
      </div>

      <div className="placeholder-content">
        <Building2 size={48} className="placeholder-icon" />
        <h4>Organization Settings</h4>
        <p>
          Organization-wide settings will be available here for administrators.
          This will include billing preferences, security policies, user management,
          and system configurations.
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <style>{`
        .settings-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .settings-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .section-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 1rem;
        }

        .section-header h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .section-header p {
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
        }

        .settings-grid {
          display: grid;
          gap: 1.5rem;
        }

        .setting-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .setting-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .setting-header label {
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem 0;
          display: block;
        }

        .setting-header small {
          color: #6b7280;
          font-size: 0.875rem;
          display: block;
        }

        .setting-control {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .select-input {
          min-width: 180px;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: white;
          font-size: 0.875rem;
        }

        .select-input:disabled {
          background: #f3f4f6;
          color: #9ca3af;
        }

        .coming-soon {
          background: #fef3c7;
          color: #92400e;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-weight: 500;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #d1d5db;
          transition: 0.4s;
          border-radius: 24px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: #6366f1;
        }

        input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }

        .security-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .card-header {
          margin-bottom: 2rem;
        }

        .card-header h4 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.5rem 0;
        }

        .card-header p {
          color: #6b7280;
          margin: 0;
          font-size: 0.875rem;
        }

        .password-form {
          max-width: 600px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-row:has(.form-field:nth-child(2)) {
          grid-template-columns: 1fr 1fr;
        }

        .form-field {
          display: flex;
          flex-direction: column;
        }

        .form-field label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .password-input {
          position: relative;
        }

        .password-input input {
          width: 100%;
          padding: 0.75rem;
          padding-right: 3rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .password-input input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0.25rem;
        }

        .password-toggle:hover {
          color: #374151;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .alert-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .alert-success {
          background: #f0fdf4;
          color: #059669;
          border: 1px solid #bbf7d0;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #6366f1;
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #5856eb;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mfa-options {
          display: grid;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .mfa-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .mfa-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mfa-icon {
          background: #f3f4f6;
          padding: 0.75rem;
          border-radius: 0.5rem;
          color: #6b7280;
        }

        .mfa-info h5 {
          margin: 0 0 0.25rem 0;
          font-weight: 600;
          color: #111827;
        }

        .mfa-info small {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .mfa-status {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
        }

        .status-badge.disabled {
          background: #fee2e2;
          color: #dc2626;
        }

        .status-badge.enabled {
          background: #d1fae5;
          color: #059669;
        }

        .mfa-notice {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #fffbeb;
          color: #92400e;
          padding: 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .info-card {
          background: #f0f9ff;
          padding: 1.5rem;
          border-radius: 0.75rem;
          border-left: 4px solid #3b82f6;
        }

        .info-card h5 {
          margin: 0 0 1rem 0;
          color: #1e40af;
          font-weight: 600;
        }

        .info-card ul {
          margin: 0;
          padding-left: 1.25rem;
          color: #1e40af;
        }

        .info-card li {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .placeholder-content {
          text-align: center;
          padding: 4rem 2rem;
        }

        .placeholder-icon {
          color: #d1d5db;
          margin-bottom: 1rem;
        }

        .placeholder-content h4 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-weight: 600;
        }

        .placeholder-content p {
          color: #6b7280;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 50vh;
          gap: 1rem;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .settings-container {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
        }

        .settings-sidebar {
          width: 240px;
          flex-shrink: 0;
        }

        .sidebar-nav {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .nav-button {
          width: 100%;
          padding: 0.875rem 1rem;
          text-align: left;
          border: none;
          background: transparent;
          color: #374151;
          border-radius: 0.5rem;
          margin-bottom: 0.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .nav-button:hover {
          background: #f3f4f6;
        }

        .nav-button.active {
          background: #6366f1;
          color: white;
        }

        .settings-content {
          flex: 1;
          min-width: 0;
        }

        .page-title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .page-subtitle {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .settings-page {
            padding: 1rem;
          }

          .settings-container {
            flex-direction: column;
            gap: 1rem;
          }

          .settings-sidebar {
            width: 100%;
          }

          .sidebar-nav {
            display: flex;
            overflow-x: auto;
            padding: 0.5rem;
            gap: 0.5rem;
          }

          .nav-button {
            flex-shrink: 0;
            margin-bottom: 0;
          }

          .form-row:has(.form-field:nth-child(2)) {
            grid-template-columns: 1fr;
          }

          .setting-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .setting-control {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Manage your account preferences and security</p>

      <div className="settings-container">
        {/* Settings Sidebar */}
        <div className="settings-sidebar">
          <nav className="sidebar-nav">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'organization' && renderOrganizationSettings()}
        </div>
      </div>
    </div>
  );
};