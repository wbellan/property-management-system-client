import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Mail,
  Phone,
  Lock,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const SettingsContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'organization', label: 'Organization', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <h3 className="section-title">Profile Information</h3>
            <p className="section-description">Update your personal information and contact details.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={user?.firstName}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue={user?.lastName}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  defaultValue={user?.email}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  className="form-input" 
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Bio</label>
                <textarea 
                  className="form-textarea" 
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
            
            <div className="section-actions">
              <button className="btn btn-primary">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'organization':
        return (
          <div className="settings-section">
            <h3 className="section-title">Organization Settings</h3>
            <p className="section-description">Manage your organization's information and settings.</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  defaultValue="Demo Property Management Co."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Business Type</label>
                <select className="form-input">
                  <option>Property Management</option>
                  <option>Real Estate</option>
                  <option>Investment</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tax ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="XX-XXXXXXX"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time Zone</label>
                <select className="form-input">
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label className="form-label">Business Address</label>
                <textarea 
                  className="form-textarea" 
                  rows={3}
                  placeholder="Enter your business address..."
                />
              </div>
            </div>
            
            <div className="section-actions">
              <button className="btn btn-primary">
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <h3 className="section-title">Notification Preferences</h3>
            <p className="section-description">Choose how you want to be notified about important updates.</p>
            
            <div className="notification-settings">
              <div className="notification-group">
                <h4 className="notification-group-title">Email Notifications</h4>
                <div className="notification-items">
                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-name">Maintenance Requests</div>
                      <div className="notification-desc">Get notified when new maintenance requests are submitted</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-name">Lease Expirations</div>
                      <div className="notification-desc">Alerts for leases expiring within 30 days</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-name">Payment Reminders</div>
                      <div className="notification-desc">Notifications for overdue payments</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="notification-group">
                <h4 className="notification-group-title">Push Notifications</h4>
                <div className="notification-items">
                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-name">Urgent Maintenance</div>
                      <div className="notification-desc">Immediate alerts for urgent maintenance issues</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="notification-item">
                    <div className="notification-info">
                      <div className="notification-name">New Messages</div>
                      <div className="notification-desc">Notifications for new tenant messages</div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="section-actions">
              <button className="btn btn-primary">
                <Save size={16} />
                Save Preferences
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-section">
            <h3 className="section-title">Security Settings</h3>
            <p className="section-description">Manage your account security and authentication settings.</p>
            
            <div className="security-section">
              <h4 className="subsection-title">Change Password</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div className="password-input">
                    <input 
                      type={showPassword ? "text" : "password"}
                      className="form-input" 
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Enter new password"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <button className="btn btn-primary">
                <Lock size={16} />
                Update Password
              </button>
            </div>

            <div className="security-section">
              <h4 className="subsection-title">Two-Factor Authentication</h4>
              <div className="security-item">
                <div className="security-info">
                  <div className="security-name">SMS Authentication</div>
                  <div className="security-desc">Receive verification codes via SMS</div>
                </div>
                <button className="btn btn-secondary">Enable</button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <div className="security-name">Authenticator App</div>
                  <div className="security-desc">Use an authenticator app for verification</div>
                </div>
                <button className="btn btn-secondary">Setup</button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="settings-section">
            <h3 className="section-title">Coming Soon</h3>
            <p className="section-description">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your account and application preferences</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`settings-nav-item ${activeTab === tab.id ? 'settings-nav-active' : ''}`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
