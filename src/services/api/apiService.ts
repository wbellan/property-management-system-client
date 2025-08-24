import { API_CONFIG, ENDPOINTS } from './config';

interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  accessToken?: string;
  user?: any;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      ...API_CONFIG.HEADERS,
    };

    const authToken = token || localStorage.getItem('propflow_token');
    if (authToken && !authToken.startsWith('demo-jwt-token')) {
      headers.Authorization = `Bearer ${authToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let responseData: any;

    try {
      responseData = await response.json();
    } catch (error) {
      responseData = {};
    }

    if (!response.ok) {
      const errorMessage = responseData.message ||
        responseData.error ||
        `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseData;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      headers: this.getAuthHeaders(token),
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      return this.handleResponse<T>(response);
    } catch (error) {
      // If this is a network error and we're in development, provide fallback
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn(`API endpoint ${endpoint} not available, using fallback data`);
        return this.getFallbackData<T>(endpoint);
      }
      throw error;
    }
  }

  private getFallbackData<T>(endpoint: string): ApiResponse<T> {
    // Fallback data for development when API is not available
    const fallbackResponses: Record<string, any> = {
      '/auth/login': {
        success: false,
        error: 'API not available - using demo mode'
      },
      '/reports/dashboard/demo-entity': {
        success: true,
        data: {
          occupancy: { rate: 87.5, totalSpaces: 24, occupiedSpaces: 21 },
          financial: { monthlyRevenue: 45600, totalRevenue: 547200, totalExpenses: 312000 },
          maintenance: { pending: 8, urgent: 2, completed: 45 },
          leases: { expiring: 5, total: 21, newThisMonth: 3 }
        }
      },
      '/properties': {
        success: true,
        data: [
          {
            id: 'prop-1',
            name: 'Sunset Apartments',
            address: '123 Main St, Anytown, TX 78701',
            propertyType: 'Apartment Complex',
            totalUnits: 24,
            entityId: 'demo-entity'
          },
          {
            id: 'prop-2',
            name: 'Downtown Lofts',
            address: '456 Commerce St, Anytown, TX 78702',
            propertyType: 'Loft Complex',
            totalUnits: 12,
            entityId: 'demo-entity'
          },
          {
            id: 'prop-3',
            name: 'Garden Homes',
            address: '789 Residential Blvd, Anytown, TX 78703',
            propertyType: 'Single Family',
            totalUnits: 8,
            entityId: 'demo-entity'
          }
        ]
      },
      '/tenants': {
        success: true,
        data: [
          {
            id: 'tenant-1',
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@email.com',
            phone: '(555) 123-4567',
            propertyName: 'Sunset Apartments',
            spaceName: 'Unit 4B',
            leaseStatus: 'ACTIVE',
            rentAmount: 1500,
            balanceDue: 0,
            leaseEndDate: '2025-06-30'
          },
          {
            id: 'tenant-2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah.johnson@email.com',
            phone: '(555) 234-5678',
            propertyName: 'Downtown Lofts',
            spaceName: 'Loft 2A',
            leaseStatus: 'ACTIVE',
            rentAmount: 2200,
            balanceDue: 150,
            leaseEndDate: '2025-08-15'
          },
          {
            id: 'tenant-3',
            firstName: 'Mike',
            lastName: 'Davis',
            email: 'mike.davis@email.com',
            phone: '(555) 345-6789',
            propertyName: 'Garden Homes',
            spaceName: 'House 1',
            leaseStatus: 'EXPIRING',
            rentAmount: 1800,
            balanceDue: 0,
            leaseEndDate: '2025-02-28'
          },
          {
            id: 'tenant-4',
            firstName: 'Lisa',
            lastName: 'Wilson',
            email: 'lisa.wilson@email.com',
            phone: '(555) 456-7890',
            propertyName: 'Sunset Apartments',
            spaceName: 'Unit 1A',
            leaseStatus: 'PENDING',
            rentAmount: 1400,
            balanceDue: 0,
            leaseEndDate: '2025-12-31'
          }
        ]
      },
      '/profile/photo': {
        success: true,
        data: {
          profilePhotoUrl: '/uploads/demo-profile.jpg',
          message: 'Demo: Photo upload simulated'
        }
      }
    };

    return fallbackResponses[endpoint] || { success: false, error: 'Endpoint not found' };
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse> {
    return this.request(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request(ENDPOINTS.LOGOUT, { method: 'POST' });
  }

  async validateToken(token: string): Promise<ApiResponse> {
    return this.request('/auth/validate', {}, token);
  }

  // Dashboard methods
  async getDashboardMetrics(entityId: string, token?: string): Promise<ApiResponse> {
    return this.request(`${ENDPOINTS.DASHBOARD_METRICS}/${entityId}`, {}, token);
  }

  // Add this new method to your ApiService class
  async getOrganizationDashboardMetrics(organizationId: string, token?: string): Promise<ApiResponse> {
    return this.request(`${ENDPOINTS.ORGANIZATION_DASHBOARD_METRICS}/${organizationId}`, {}, token);
  }

  // Properties methods
  async getProperties(token?: string): Promise<ApiResponse> {
    return this.request(ENDPOINTS.PROPERTIES, {}, token);
  }

  async createProperty(data: any, token?: string): Promise<ApiResponse> {
    return this.request(ENDPOINTS.PROPERTIES, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async updateProperty(id: string, data: any, token?: string): Promise<ApiResponse> {
    return this.request(`${ENDPOINTS.PROPERTIES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteProperty(id: string, token?: string): Promise<ApiResponse> {
    return this.request(`${ENDPOINTS.PROPERTIES}/${id}`, {
      method: 'DELETE',
    }, token);
  }

  // Tenants methods
  async getTenants(token?: string): Promise<ApiResponse> {
    return this.request('/tenants', {}, token);
  }

  async createTenant(data: any, token?: string): Promise<ApiResponse> {
    return this.request('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  // Users methods
  async getOrganizationUsers(organizationId: string, token?: string): Promise<ApiResponse> {
    return this.request(`/users/organization/${organizationId}`, {}, token);
  }

  // async inviteUser(data: any, token?: string): Promise<ApiResponse> {
  //   return this.request('/users/invite', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   }, token);
  // }

  // async completeInvitation(inviteToken: string, password: string): Promise<ApiResponse> {
  //   return this.request('/users/complete-invitation', {
  //     method: 'POST',
  //     body: JSON.stringify({ inviteToken, password }),
  //   });
  // }

  async setupOrganization(data: any): Promise<ApiResponse> {
    return this.request('/users/setup-organization', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // async resendInvitation(userId: string, token?: string): Promise<ApiResponse> {
  //   return this.request(`/users/${userId}/resend-invitation`, {
  //     method: 'POST',
  //   }, token);
  // }

  async getAccessOptions(organizationId: string, token?: string): Promise<ApiResponse> {
    return this.request(`/users/access-options/${organizationId}`, {}, token);
  }

  // Reports methods
  async getReports(type: string, entityId: string, params: any = {}, token?: string): Promise<ApiResponse> {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/reports/${type}/${entityId}${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint, {}, token);
  }

  // Profile methods
  async getProfile(token?: string): Promise<ApiResponse> {
    return this.request('/profile', {}, token);
  }

  async updateProfile(profileData: any, token?: string): Promise<ApiResponse> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }, token);
  }

  // async uploadProfilePhoto(file: File, token?: string): Promise<ApiResponse> {
  //   const formData = new FormData();
  //   formData.append('photo', file);

  //   return this.request('/profile/photo', {
  //     method: 'POST',
  //     body: formData,
  //     headers: this.getAuthHeaders(token), // Remove Content-Type for FormData
  //   }, token);
  // }

  async uploadProfilePhoto(file: File, token?: string): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('photo', file);

    // Use the standard request method but with FormData
    const authHeaders = this.getAuthHeaders(token);
    // Remove Content-Type to let browser set it for FormData
    delete authHeaders['Content-Type'];

    try {
      const response = await fetch(`${this.baseURL}/profile/photo`, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      });
      return this.handleResponse(response);
    } catch (error) {
      // Same fallback handling as your other methods
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn(`API endpoint /profile/photo not available, using fallback data`);
        return this.getFallbackData('/profile/photo');
      }
      throw error;
    }
  }

  async removeProfilePhoto(token?: string): Promise<ApiResponse> {
    return this.request('/profile/photo', {
      method: 'DELETE',
    }, token);
  }
}

export const apiService = new ApiService();