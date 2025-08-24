// src/pages/settings/SettingsPage.tsx - COMPLETE IMPLEMENTATION
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
  AlertCircle
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
      <h3>Appearance Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label>Theme</label>
          <select disabled value="light">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
          <small>Theme switching will be available soon</small>
        </div>
        <div className="setting-item">
          <label>Language</label>
          <select disabled value="en">
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
          <small>Multi-language support coming soon</small>
        </div>
        <div className="setting-item">
          <label>Timezone</label>
          <select disabled value="America/Chicago">
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
          </select>
          <small>Timezone settings will be customizable soon</small>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <label>Email Notifications</label>
            <small>Receive updates via email</small>
          </div>
          <input type="checkbox" disabled defaultChecked />
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <label>Push Notifications</label>
            <small>Browser notifications for urgent items</small>
          </div>
          <input type="checkbox" disabled defaultChecked />
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <label>Maintenance Alerts</label>
            <small>Get notified about maintenance requests</small>
          </div>
          <input type="checkbox" disabled defaultChecked />
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <label>Payment Reminders</label>
            <small>Reminders for upcoming payments</small>
          </div>
          <input type="checkbox" disabled defaultChecked />
        </div>
      </div>
      <small style={{ color: '#6b7280', marginTop: '1rem', display: 'block' }}>
        Notification preferences will be fully customizable soon
      </small>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>

      {/* Password Change Form */}
      <div className="security-card">
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Lock size={16} />
          Change Password
        </h4>

        <form onSubmit={handlePasswordChange}>
          <div className="form-field">
            <label>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
                minLength={8}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
                minLength={8}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {passwordError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} />
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div style={{
              color: '#059669',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {passwordSuccess}
            </div>
          )}

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            <Save size={16} />
            Update Password
          </button>
        </form>
      </div>

      {/* Password Requirements */}
      <div className="security-info">
        <h5>Password Requirements</h5>
        <ul style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1rem' }}>
          <li>At least 8 characters long</li>
          <li>Mix of uppercase and lowercase letters</li>
          <li>At least one number</li>
          <li>Cannot reuse your last 5 passwords</li>
        </ul>
      </div>
    </div>
  );

  const renderOrganizationSettings = () => (
    <div className="settings-section">
      <h3>Organization Settings</h3>
      <div className="org-settings-placeholder">
        <p style={{ color: '#6b7280' }}>
          Organization-wide settings will be available here for administrators.
          This will include billing preferences, security policies, and system configurations.
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        Loading settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '4xl', margin: '0 auto', padding: '2rem' }}>
      <style>{`
        .settings-section {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .settings-grid {
          display: grid;
          gap: 1rem;
        }
        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .setting-info {
          flex: 1;
        }
        .setting-item label {
          font-weight: 500;
          color: #111827;
          display: block;
          margin-bottom: 0.25rem;
        }
        .setting-item small {
          color: #6b7280;
          font-size: 0.875rem;
        }
        .setting-item select,
        .setting-item input[type="text"],
        .setting-item input[type="password"] {
          width: 200px;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
        }
        .setting-item input[type="checkbox"] {
          width: auto;
          transform: scale(1.2);
        }
        .security-card {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .form-field {
          margin-bottom: 1rem;
        }
        .form-field label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        .form-field input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
        }
        .security-info {
          background: #f0f9ff;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #3b82f6;
        }
        .security-info h5 {
          margin: 0 0 0.5rem 0;
          color: #1e40af;
          font-weight: 600;
        }
        .org-settings-placeholder {
          text-align: center;
          padding: 3rem;
        }
      `}</style>

      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Settings
      </h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Settings Sidebar */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          {availableTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                textAlign: 'left',
                border: 'none',
                background: activeTab === tab.id ? '#6366f1' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#374151',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: activeTab === tab.id ? 600 : 400
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1 }}>
          {activeTab === 'appearance' && renderAppearanceSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'organization' && renderOrganizationSettings()}
        </div>
      </div>
    </div>
  );
};
