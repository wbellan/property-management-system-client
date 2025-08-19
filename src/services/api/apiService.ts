import { API_CONFIG, ENDPOINTS } from './config';
import type { ApiResponse } from '../../types';

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
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
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

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    return this.handleResponse<T>(response);
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request(ENDPOINTS.LOGOUT, { method: 'POST' });
  }

  // Dashboard methods
  async getDashboardMetrics(entityId: string, token?: string) {
    return this.request(`${ENDPOINTS.DASHBOARD_METRICS}/${entityId}`, {}, token);
  }

  // Properties methods
  async getProperties(token?: string) {
    return this.request(ENDPOINTS.PROPERTIES, {}, token);
  }

  async createProperty(data: any, token?: string) {
    return this.request(ENDPOINTS.PROPERTIES, {
      method: 'POST',
      body: JSON.stringify(data),
    }, token);
  }

  async updateProperty(id: string, data: any, token?: string) {
    return this.request(`${ENDPOINTS.PROPERTIES}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, token);
  }

  async deleteProperty(id: string, token?: string) {
    return this.request(`${ENDPOINTS.PROPERTIES}/${id}`, {
      method: 'DELETE',
    }, token);
  }
}

export const apiService = new ApiService();
