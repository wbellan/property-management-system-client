import { useState } from "react";
import { useAuth } from "../../contexts";

// src/pages/settings/SettingsPage.tsx
export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', label: 'Appearance', roles: ['*'] },
    { id: 'notifications', label: 'Notifications', roles: ['*'] },
    { id: 'security', label: 'Security', roles: ['*'] },
    { id: 'organization', label: 'Organization', roles: ['ORG_ADMIN', 'ENTITY_MANAGER'] }
  ];

  const availableTabs = tabs.filter(tab =>
    tab.roles.includes('*') || tab.roles.includes(user?.role)
  );

  return (
    <div style={{ maxWidth: '4xl', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Settings
      </h1>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Settings Sidebar */}
        <div style={{ width: '200px' }}>
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
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1 }}>
          <SettingsContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

const SettingsContent = ({ activeTab }) => {
  // Settings content based on active tab
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3>{activeTab} Settings</h3>
      <p>Settings content for {activeTab} goes here...</p>
    </div>
  );
};