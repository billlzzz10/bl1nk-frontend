import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  SystemStats, 
  HealthCheck, 
  RecentActivity, 
  PlaywrightTestResult,
  Plan,
  Workspace,
  User
} from '@/types/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('auth_token');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Health and System APIs
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await this.client.get('/admin/dashboard/stats');
    return response.data;
  }

  async getHealthCheck(): Promise<HealthCheck> {
    const response = await this.client.get('/admin/dashboard/health-check');
    return response.data;
  }

  async getRecentActivity(): Promise<RecentActivity> {
    const response = await this.client.get('/admin/dashboard/recent-activity');
    return response.data;
  }

  // Playwright APIs
  async runPlaywrightTest(): Promise<PlaywrightTestResult> {
    const response = await this.client.post('/admin/dashboard/playwright/test');
    return response.data;
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post('/auth/register', { email, password, name });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Workspace APIs
  async getWorkspaces(): Promise<Workspace[]> {
    const response = await this.client.get('/workspaces');
    return response.data;
  }

  async getWorkspace(id: string): Promise<Workspace> {
    const response = await this.client.get(`/workspaces/${id}`);
    return response.data;
  }

  async createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
    const response = await this.client.post('/workspaces', data);
    return response.data;
  }

  async updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace> {
    const response = await this.client.put(`/workspaces/${id}`, data);
    return response.data;
  }

  async deleteWorkspace(id: string): Promise<void> {
    await this.client.delete(`/workspaces/${id}`);
  }

  // Plan APIs
  async getPlans(workspaceId?: string): Promise<Plan[]> {
    const params = workspaceId ? { workspace_id: workspaceId } : {};
    const response = await this.client.get('/plans', { params });
    return response.data;
  }

  async getPlan(id: string): Promise<Plan> {
    const response = await this.client.get(`/plans/${id}`);
    return response.data;
  }

  async createPlan(data: Partial<Plan>): Promise<Plan> {
    const response = await this.client.post('/plans', data);
    return response.data;
  }

  async updatePlan(id: string, data: Partial<Plan>): Promise<Plan> {
    const response = await this.client.put(`/plans/${id}`, data);
    return response.data;
  }

  async approvePlan(id: string): Promise<Plan> {
    const response = await this.client.post(`/plans/${id}/approve`);
    return response.data;
  }

  async executePlan(id: string): Promise<Plan> {
    const response = await this.client.post(`/plans/${id}/execute`);
    return response.data;
  }

  async deletePlan(id: string): Promise<void> {
    await this.client.delete(`/plans/${id}`);
  }

  // Chat/Command APIs
  async sendCommand(command: string, workspaceId?: string): Promise<{ plan: Plan }> {
    const response = await this.client.post('/chat/command', { 
      command, 
      workspace_id: workspaceId 
    });
    return response.data;
  }

  // File APIs
  async uploadFile(file: File, workspaceId?: string): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    if (workspaceId) {
      formData.append('workspace_id', workspaceId);
    }

    const response = await this.client.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getFiles(workspaceId?: string): Promise<{ files: any[] }> {
    const params = workspaceId ? { workspace_id: workspaceId } : {};
    const response = await this.client.get('/files', { params });
    return response.data;
  }

  // Search APIs
  async search(query: string, workspaceId?: string): Promise<{ results: any[] }> {
    const response = await this.client.post('/search', { 
      query, 
      workspace_id: workspaceId 
    });
    return response.data;
  }

  // Vector APIs
  async getVectors(workspaceId?: string): Promise<{ vectors: any[] }> {
    const params = workspaceId ? { workspace_id: workspaceId } : {};
    const response = await this.client.get('/vectors', { params });
    return response.data;
  }

  // MCP APIs
  async getMcpServers(): Promise<{ servers: any[] }> {
    const response = await this.client.get('/mcp/servers');
    return response.data;
  }

  async callMcpTool(server: string, tool: string, args: any): Promise<any> {
    const response = await this.client.post('/mcp/call', {
      server,
      tool,
      arguments: args
    });
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
