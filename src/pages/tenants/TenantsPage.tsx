import React, { useState, useEffect } from 'react';
import { TenantsContent } from '../../components/tenants/TenantsContent';
import { useAuth } from '../../contexts/AuthContext';

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  propertyName: string;
  unitNumber: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: number;
  status: 'active' | 'pending' | 'expired';
  balanceDue: number;
}

export const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadTenants = async () => {
      try {
        // Mock tenant data
        const mockTenants: Tenant[] = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@email.com',
            phone: '(555) 123-4567',
            propertyName: 'Sunset Apartments',
            unitNumber: 'Unit 4B',
            leaseStart: '2024-01-01',
            leaseEnd: '2024-12-31',
            rentAmount: 1520,
            status: 'active',
            balanceDue: 0
          },
          {
            id: '2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.j@email.com',
            phone: '(555) 987-6543',
            propertyName: 'Downtown Office Complex',
            unitNumber: 'Suite 200',
            leaseStart: '2024-03-15',
            leaseEnd: '2025-03-14',
            rentAmount: 2850,
            status: 'active',
            balanceDue: 0
          },
          {
            id: '3',
            firstName: 'Mike',
            lastName: 'Brown',
            email: 'mike.brown@email.com',
            phone: '(555) 456-7890',
            propertyName: 'Riverside Condos',
            unitNumber: 'Unit 12A',
            leaseStart: '2023-09-01',
            leaseEnd: '2024-08-31',
            rentAmount: 1750,
            status: 'pending',
            balanceDue: 1750
          },
          {
            id: '4',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily.davis@email.com',
            phone: '(555) 321-0987',
            propertyName: 'Sunset Apartments',
            unitNumber: 'Unit 7C',
            leaseStart: '2024-02-01',
            leaseEnd: '2025-01-31',
            rentAmount: 1620,
            status: 'active',
            balanceDue: 0
          }
        ];

        await new Promise(resolve => setTimeout(resolve, 800));
        setTenants(mockTenants);
      } catch (error) {
        console.error('Failed to load tenants:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenants();
  }, [user, token]);

  return (
    <TenantsContent 
      tenants={tenants}
      loading={loading}
      onRefresh={() => window.location.reload()}
    />
  );
};
