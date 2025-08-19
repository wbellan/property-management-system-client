import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PropertiesContent } from '../../components/properties/PropertiesContent';
import { useAuth } from '../../contexts/AuthContext';

// Define Property interface directly
interface Property {
  id: string;
  name: string;
  address: string;
  propertyType: string;
  totalUnits?: number;
  spaces?: any[];
  entityId: string;
  createdAt: string;
  updatedAt: string;
}

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Mock data for demo
        const mockProperties: Property[] = [
          {
            id: '1',
            name: 'Sunset Apartments',
            address: '123 Main St, Austin, TX 78701',
            propertyType: 'Residential',
            totalUnits: 24,
            spaces: [],
            entityId: 'demo-entity',
            createdAt: '2024-01-15',
            updatedAt: '2024-08-15'
          },
          {
            id: '2',
            name: 'Downtown Office Complex',
            address: '456 Business Ave, Austin, TX 78702',
            propertyType: 'Commercial',
            totalUnits: 12,
            spaces: [],
            entityId: 'demo-entity',
            createdAt: '2024-02-20',
            updatedAt: '2024-08-10'
          },
          {
            id: '3',
            name: 'Riverside Condos',
            address: '789 River Rd, Austin, TX 78703',
            propertyType: 'Residential',
            totalUnits: 18,
            spaces: [],
            entityId: 'demo-entity',
            createdAt: '2024-03-10',
            updatedAt: '2024-08-05'
          }
        ];

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setProperties(mockProperties);
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [user, token]);

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <PropertiesContent 
            properties={properties} 
            loading={loading}
            onRefresh={() => window.location.reload()}
          />
        } 
      />
      <Route path="/:id" element={<div className="page-placeholder">Property Details Coming Soon</div>} />
      <Route path="/add" element={<div className="page-placeholder">Add Property Coming Soon</div>} />
    </Routes>
  );
};
