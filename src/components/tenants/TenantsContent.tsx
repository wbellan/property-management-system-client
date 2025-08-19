import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  AlertCircle,
  Edit,
  MessageSquare
} from 'lucide-react';

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

interface TenantsContentProps {
  tenants: Tenant[];
  loading: boolean;
  onRefresh: () => void;
}

export const TenantsContent: React.FC<TenantsContentProps> = ({ 
  tenants, 
  loading, 
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = 
      tenant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'tenant-status-active';
      case 'pending': return 'tenant-status-pending';
      case 'expired': return 'tenant-status-expired';
      default: return 'tenant-status-active';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const TenantCard: React.FC<{ tenant: Tenant }> = ({ tenant }) => (
    <div className="tenant-card">
      <div className="tenant-card-header">
        <div className="tenant-info">
          <div className="tenant-avatar">
            {tenant.firstName[0]}{tenant.lastName[0]}
          </div>
          <div>
            <h3 className="tenant-name">{tenant.firstName} {tenant.lastName}</h3>
            <p className="tenant-property">
              <MapPin size={14} />
              {tenant.propertyName} - {tenant.unitNumber}
            </p>
          </div>
        </div>
        <span className={`tenant-status ${getStatusColor(tenant.status)}`}>
          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
        </span>
      </div>

      <div className="tenant-details">
        <div className="tenant-contact">
          <div className="contact-item">
            <Mail size={16} />
            <span>{tenant.email}</span>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <span>{tenant.phone}</span>
          </div>
        </div>

        <div className="tenant-lease-info">
          <div className="lease-item">
            <Calendar size={16} />
            <div><span className="lease-label">Lease Period</span>
             <span className="lease-value">{formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}</span>
           </div>
         </div>
         <div className="lease-item">
           <DollarSign size={16} />
           <div>
             <span className="lease-label">Monthly Rent</span>
             <span className="lease-value">${tenant.rentAmount.toLocaleString()}</span>
           </div>
         </div>
         {tenant.balanceDue > 0 && (
           <div className="lease-item balance-due">
             <AlertCircle size={16} />
             <div>
               <span className="lease-label">Balance Due</span>
               <span className="lease-value text-red-600">${tenant.balanceDue.toLocaleString()}</span>
             </div>
           </div>
         )}
       </div>
     </div>

     <div className="tenant-card-footer">
       <button className="tenant-action-btn">
         <MessageSquare size={16} />
         Message
       </button>
       <button className="tenant-action-btn">
         <Edit size={16} />
         Edit
       </button>
       <button className="tenant-view-btn">
         View Details
       </button>
     </div>
   </div>
 );

 if (loading) {
   return (
     <div className="tenants-loading">
       <div className="loading-spinner"></div>
       <p>Loading tenants...</p>
     </div>
   );
 }

 return (
   <div className="tenants-container">
     <div className="tenants-header">
       <div>
         <h1 className="tenants-title">Tenants</h1>
         <p className="tenants-subtitle">Manage tenant relationships and communications</p>
       </div>
       <div className="tenants-actions">
         <button className="btn btn-secondary">
           <Filter size={16} />
           Filter
         </button>
         <button className="btn btn-primary">
           <Plus size={16} />
           Add Tenant
         </button>
       </div>
     </div>

     <div className="tenants-toolbar">
       <div className="search-container">
         <Search size={20} className="search-icon" />
         <input
           type="text"
           placeholder="Search tenants..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="search-input"
         />
       </div>
       
       <div className="status-filters">
         <button 
           className={`status-filter ${statusFilter === 'all' ? 'status-filter-active' : ''}`}
           onClick={() => setStatusFilter('all')}
         >
           All
         </button>
         <button 
           className={`status-filter ${statusFilter === 'active' ? 'status-filter-active' : ''}`}
           onClick={() => setStatusFilter('active')}
         >
           Active
         </button>
         <button 
           className={`status-filter ${statusFilter === 'pending' ? 'status-filter-active' : ''}`}
           onClick={() => setStatusFilter('pending')}
         >
           Pending
         </button>
         <button 
           className={`status-filter ${statusFilter === 'expired' ? 'status-filter-active' : ''}`}
           onClick={() => setStatusFilter('expired')}
         >
           Expired
         </button>
       </div>

       <div className="tenants-count">
         {filteredTenants.length} {filteredTenants.length === 1 ? 'tenant' : 'tenants'}
       </div>
     </div>

     {filteredTenants.length === 0 ? (
       <div className="tenants-empty">
         <Users size={64} className="empty-icon" />
         <h3 className="empty-title">
           {searchTerm || statusFilter !== 'all' ? 'No tenants found' : 'No tenants yet'}
         </h3>
         <p className="empty-subtitle">
           {searchTerm || statusFilter !== 'all'
             ? 'Try adjusting your search or filter criteria' 
             : 'Get started by adding your first tenant to the system.'}
         </p>
         {!searchTerm && statusFilter === 'all' && (
           <button className="btn btn-primary">
             <Plus size={16} />
             Add Your First Tenant
           </button>
         )}
       </div>
     ) : (
       <div className="tenants-grid">
         {filteredTenants.map((tenant) => (
           <TenantCard key={tenant.id} tenant={tenant} />
         ))}
       </div>
     )}
   </div>
 );
};
