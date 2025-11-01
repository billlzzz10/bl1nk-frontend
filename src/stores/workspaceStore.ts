import { create } from 'zustand';
import { Workspace, Plan, BrandConfig } from '@/types/api';
import { apiService } from '@/services/api';
import { eventBus } from '@/services/EventBus';

interface WorkspaceStore {
  // State
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  plans: Plan[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  loadWorkspaces: () => Promise<void>;
  loadWorkspace: (id: string) => Promise<void>;
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  
  // Plan actions
  loadPlans: (workspaceId?: string) => Promise<void>;
  createPlan: (data: Partial<Plan>) => Promise<Plan>;
  approvePlan: (id: string) => Promise<void>;
  executePlan: (id: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  
  // Command actions
  sendCommand: (command: string) => Promise<Plan>;
  
  // Utility actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  // Initial state
  currentWorkspace: null,
  workspaces: [],
  plans: [],
  isLoading: false,
  error: null,

  // Actions
  setCurrentWorkspace: (workspace: Workspace | null) => {
    set({ currentWorkspace: workspace });
    if (workspace) {
      eventBus.emit('workspace:changed', { workspaceId: workspace.id });
      // Load plans for the workspace
      get().loadPlans(workspace.id);
    }
  },

  loadWorkspaces: async () => {
    try {
      set({ isLoading: true, error: null });
      const workspaces = await apiService.getWorkspaces();
      set({ workspaces, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load workspaces';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  loadWorkspace: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const workspace = await apiService.getWorkspace(id);
      set({ currentWorkspace: workspace, isLoading: false });
      eventBus.emit('workspace:changed', { workspaceId: id });
      
      // Load plans for the workspace
      get().loadPlans(id);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load workspace';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  createWorkspace: async (data: Partial<Workspace>) => {
    try {
      set({ isLoading: true, error: null });
      const workspace = await apiService.createWorkspace(data);
      
      set(state => ({
        workspaces: [...state.workspaces, workspace],
        currentWorkspace: workspace,
        isLoading: false
      }));

      eventBus.emit('workspace:created', { workspace });
      eventBus.emit('ui:notification', { type: 'success', message: 'Workspace created successfully' });
      
      return workspace;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create workspace';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
      throw error;
    }
  },

  updateWorkspace: async (id: string, data: Partial<Workspace>) => {
    try {
      set({ isLoading: true, error: null });
      const workspace = await apiService.updateWorkspace(id, data);
      
      set(state => ({
        workspaces: state.workspaces.map(w => w.id === id ? workspace : w),
        currentWorkspace: state.currentWorkspace?.id === id ? workspace : state.currentWorkspace,
        isLoading: false
      }));

      eventBus.emit('workspace:updated', { workspace });
      eventBus.emit('ui:notification', { type: 'success', message: 'Workspace updated successfully' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update workspace';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  deleteWorkspace: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiService.deleteWorkspace(id);
      
      set(state => ({
        workspaces: state.workspaces.filter(w => w.id !== id),
        currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace,
        isLoading: false
      }));

      eventBus.emit('workspace:deleted', { workspaceId: id });
      eventBus.emit('ui:notification', { type: 'success', message: 'Workspace deleted successfully' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete workspace';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  // Plan actions
  loadPlans: async (workspaceId?: string) => {
    try {
      set({ isLoading: true, error: null });
      const plans = await apiService.getPlans(workspaceId);
      set({ plans, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load plans';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  createPlan: async (data: Partial<Plan>) => {
    try {
      set({ isLoading: true, error: null });
      const plan = await apiService.createPlan(data);
      
      set(state => ({
        plans: [...state.plans, plan],
        isLoading: false
      }));

      eventBus.emit('plan:created', { plan });
      eventBus.emit('ui:notification', { type: 'success', message: 'Plan created successfully' });
      
      return plan;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create plan';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
      throw error;
    }
  },

  approvePlan: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const plan = await apiService.approvePlan(id);
      
      set(state => ({
        plans: state.plans.map(p => p.id === id ? plan : p),
        isLoading: false
      }));

      eventBus.emit('plan:approved', { plan });
      eventBus.emit('ui:notification', { type: 'success', message: 'Plan approved successfully' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to approve plan';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  executePlan: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const plan = await apiService.executePlan(id);
      
      set(state => ({
        plans: state.plans.map(p => p.id === id ? plan : p),
        isLoading: false
      }));

      eventBus.emit('plan:executing', { plan });
      eventBus.emit('ui:notification', { type: 'info', message: 'Plan execution started' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to execute plan';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  deletePlan: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await apiService.deletePlan(id);
      
      set(state => ({
        plans: state.plans.filter(p => p.id !== id),
        isLoading: false
      }));

      eventBus.emit('ui:notification', { type: 'success', message: 'Plan deleted successfully' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete plan';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
    }
  },

  sendCommand: async (command: string) => {
    try {
      set({ isLoading: true, error: null });
      const { currentWorkspace } = get();
      
      eventBus.emit('command:sent', { command, workspaceId: currentWorkspace?.id });
      
      const response = await apiService.sendCommand(command, currentWorkspace?.id);
      const { plan } = response;
      
      set(state => ({
        plans: [...state.plans, plan],
        isLoading: false
      }));

      eventBus.emit('command:response', { plan });
      eventBus.emit('plan:created', { plan });
      
      return plan;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send command';
      set({ error: errorMessage, isLoading: false });
      eventBus.emit('command:error', { error: errorMessage });
      eventBus.emit('ui:notification', { type: 'error', message: errorMessage });
      throw error;
    }
  },

  // Utility actions
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));
