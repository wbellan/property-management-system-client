import React, { useState, useEffect } from 'react';
import { LeasesContent } from '../../components/leases/LeasesContent';
import { useAuth } from '../../contexts/AuthContext';

interface Lease {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'active' | 'expiring' | 'expired' | 'renewed';
  autoRenew: boolean;
  lastPayment: string;
  nextPaymentDue: string;
  totalPaid: number;
  balanceDue: number;
  leaseType: 'residential' | 'commercial';
  documents: string[];
}

export const LeasesPage: React.FC = () => {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadLeases = async () => {
      try {
        // Mock lease data
        const mockLeases: Lease[] = [
          {
            id: '1',
            tenantName: 'John Smith',
            propertyName: 'Sunset Apartments',
            unitNumber: 'Unit 4B',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            monthlyRent: 1520,
            securityDeposit: 1520,
            status: 'active',
            autoRenew: true,
            lastPayment: '2024-08-01',
            nextPaymentDue: '2024-09-01',
            totalPaid: 12160,
            balanceDue: 0,
            leaseType: 'residential',
            documents: ['lease-agreement.pdf', 'move-in-checklist.pdf']
          },
          {
            id: '2',
            tenantName: 'Sarah Johnson',
            propertyName: 'Downtown Office Complex',
            unitNumber: 'Suite 200',
            startDate: '2024-03-15',
            endDate: '2025-03-14',
            monthlyRent: 2850,
            securityDeposit: 5700,
            status: 'active',
            autoRenew: false,
            lastPayment: '2024-08-15',
            nextPaymentDue: '2024-09-15',
            totalPaid: 14250,
            balanceDue: 0,
            leaseType: 'commercial',
            documents: ['commercial-lease.pdf', 'tenant-improvements.pdf']
          },
          {
            id: '3',
            tenantName: 'Mike Brown',
            propertyName: 'Riverside Condos',
            unitNumber: 'Unit 12A',
            startDate: '2023-09-01',
            endDate: '2024-08-31',
            monthlyRent: 1750,
            securityDeposit: 1750,
            status: 'expiring',
            autoRenew: false,
            lastPayment: '2024-07-01',
            nextPaymentDue: '2024-08-01',
            totalPaid: 19250,
            balanceDue: 1750,
            leaseType: 'residential',
            documents: ['lease-agreement.pdf']
          },
          {
            id: '4',
            tenantName: 'Emily Davis',
            propertyName: 'Sunset Apartments',
            unitNumber: 'Unit 7C',
            startDate: '2024-02-01',
            endDate: '2025-01-31',
            monthlyRent: 1620,
            securityDeposit: 1620,
            status: 'active',
            autoRenew: true,
            lastPayment: '2024-08-01',
            nextPaymentDue: '2024-09-01',
            totalPaid: 9720,
            balanceDue: 0,
            leaseType: 'residential',
            documents: ['lease-agreement.pdf', 'pet-addendum.pdf']
          },
          {
            id: '5',
            tenantName: 'Tech Startup LLC',
            propertyName: 'Downtown Office Complex',
            unitNumber: 'Suite 150',
            startDate: '2023-01-01',
            endDate: '2024-12-31',
            monthlyRent: 3200,
            securityDeposit: 6400,
            status: 'renewed',
            autoRenew: true,
            lastPayment: '2024-08-01',
            nextPaymentDue: '2024-09-01',
            totalPaid: 54400,
            balanceDue: 0,
            leaseType: 'commercial',
            documents: ['commercial-lease.pdf', 'renewal-agreement.pdf']
          }
        ];

        await new Promise(resolve => setTimeout(resolve, 800));
        setLeases(mockLeases);
      } catch (error) {
        console.error('Failed to load leases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeases();
  }, [user, token]);

  return (
    <LeasesContent 
      leases={leases}
      loading={loading}
      onRefresh={() => window.location.reload()}
    />
  );
};
