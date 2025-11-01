// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// System Stats Types
export interface SystemStats {
  system: {
    cpu_percent: number;
    memory_percent: number;
    memory_used_gb: number;
    memory_total_gb: number;
    disk_percent: number;
    disk_used_gb: number;
    disk_total_gb: number;
    uptime_hours: number;
  };
  application: {
    requests_count: number;
    errors_count: number;
    active_connections: number;
    error_rate: number;
  };
  timestamp: string;
}

// Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'warning' | 'error';
  checks: {
    api: {
      status: string;
      response_time_ms: number;
    };
    database: {
      status: string;
      response_time_ms: number;
    };
    memory: {
      status: string;
      usage_percent: number;
    };
    disk: {
      status: string;
      usage_percent: number;
    };
  };
  timestamp: string;
}

// Recent Activity Types
export interface RecentRequest {
  timestamp: string;
  method: string;
  url: string;
  status_code: number;
  response_time_ms: number;
}

export interface RecentActivity {
  recent_requests: RecentRequest[];
  timestamp: string;
}

// Playwright Test Types
export interface PlaywrightTestResult {
  status: 'success' | 'error';
  message: string;
  details: string;
  timestamp: string;
}

// Plan Types (from the vision document)
export interface Plan {
  id: string;
  title: string;
  description: string;
  steps: PlanStep[];
  status: 'pending' | 'approved' | 'executing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  tool?: string;
  parameters?: Record<string, any>;
  result?: any;
}

// Brand Config Types (from the vision document)
export interface BrandConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  created_at: string;
  updated_at: string;
}

// Workspace Types
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  brand_config?: BrandConfig;
  created_at: string;
  updated_at: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
