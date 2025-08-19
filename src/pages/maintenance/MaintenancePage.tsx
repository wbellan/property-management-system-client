import React, { useState, useEffect } from 'react';
import { MaintenanceContent } from '../../components/maintenance/MaintenanceContent';
import { useAuth } from '../../contexts/AuthContext';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'completed' | 'on-hold';
  createdDate: string;
  assignedTo?: string;
  estimatedCost: number;
  actualCost?: number;
  dueDate: string;
  completedDate?: string;
  images: string[];
  notes: string[];
}

export const MaintenancePage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const loadMaintenanceRequests = async () => {
      try {
        // Mock maintenance request data
        const mockRequests: MaintenanceRequest[] = [
          {
            id: '1',
            title: 'Leaking Kitchen Faucet',
            description: 'Kitchen faucet has been dripping constantly for the past week. Water damage starting to appear on cabinet.',
            propertyName: 'Sunset Apartments',
            unitNumber: 'Unit 4B',
            tenantName: 'John Smith',
            category: 'plumbing',
            priority: 'high',
            status: 'in-progress',
            createdDate: '2024-08-15',
            assignedTo: 'Mike\'s Plumbing Services',
            estimatedCost: 150,
            actualCost: 135,
            dueDate: '2024-08-20',
            images: ['faucet-leak.jpg'],
            notes: ['Initial assessment completed', 'Parts ordered', 'Repair scheduled for tomorrow']
          },
          {
            id: '2',
            title: 'HVAC System Not Cooling',
            description: 'Air conditioning unit not producing cold air. Unit runs but only blows warm air.',
            propertyName: 'Downtown Office Complex',
            unitNumber: 'Suite 200',
            tenantName: 'Sarah Johnson',
            category: 'hvac',
            priority: 'urgent',
            status: 'open',
            createdDate: '2024-08-18',
            estimatedCost: 300,
            dueDate: '2024-08-19',
            images: ['hvac-unit.jpg'],
            notes: ['Tenant called at 9 AM', 'Scheduled for emergency service']
          },
          {
            id: '3',
            title: 'Broken Dishwasher',
            description: 'Dishwasher making loud grinding noise and not cleaning dishes properly.',
            propertyName: 'Riverside Condos',
            unitNumber: 'Unit 12A',
            tenantName: 'Mike Brown',
            category: 'appliance',
            priority: 'medium',
            status: 'completed',
            createdDate: '2024-08-10',
            assignedTo: 'Appliance Repair Pro',
            estimatedCost: 200,
            actualCost: 180,
            dueDate: '2024-08-15',
            completedDate: '2024-08-14',
            images: ['dishwasher-before.jpg', 'dishwasher-after.jpg'],
            notes: ['Replaced motor assembly', 'Tested all cycles', 'Tenant confirmed working properly']
          },
          {
            id: '4',
            title: 'Electrical Outlet Not Working',
            description: 'Bedroom electrical outlet stopped working. No power to multiple outlets on same wall.',
            propertyName: 'Sunset Apartments',
            unitNumber: 'Unit 7C',
            tenantName: 'Emily Davis',
            category: 'electrical',
            priority: 'high',
            status: 'open',
            createdDate: '2024-08-17',
            estimatedCost: 125,
            dueDate: '2024-08-22',
            images: [],
            notes: ['Safety inspection required']
          },
          {
            id: '5',
            title: 'Paint Touch-up Needed',
            description: 'Hallway walls need paint touch-up after recent repairs. Several scuff marks and small holes.',
            propertyName: 'Downtown Office Complex',
            unitNumber: 'Common Area',
            tenantName: 'Property Management',
            category: 'general',
            priority: 'low',
            status: 'on-hold',
            createdDate: '2024-08-12',
            estimatedCost: 75,
            dueDate: '2024-08-30',
            images: ['wall-damage.jpg'],
            notes: ['Waiting for paint color approval', 'Scheduled for next week']
          }
        ];

        await new Promise(resolve => setTimeout(resolve, 800));
        setRequests(mockRequests);
      } catch (error) {
        console.error('Failed to load maintenance requests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMaintenanceRequests();
  }, [user, token]);

  return (
    <MaintenanceContent 
      requests={requests}
      loading={loading}
      onRefresh={() => window.location.reload()}
    />
  );
};
