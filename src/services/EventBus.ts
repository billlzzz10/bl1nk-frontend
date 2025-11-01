type EventCallback = (...args: any[]) => void;

interface EventMap {
  [key: string]: EventCallback[];
}

class EventBus {
  private events: EventMap = {};

  // Subscribe to an event
  on(event: string, callback: EventCallback): () => void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  // Unsubscribe from an event
  off(event: string, callback: EventCallback): void {
    if (!this.events[event]) return;
    
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  // Emit an event
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event callback for "${event}":`, error);
      }
    });
  }

  // Subscribe to an event only once
  once(event: string, callback: EventCallback): void {
    const onceCallback = (...args: any[]) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    
    this.on(event, onceCallback);
  }

  // Remove all listeners for an event
  removeAllListeners(event?: string): void {
    if (event) {
      delete this.events[event];
    } else {
      this.events = {};
    }
  }

  // Get all event names
  eventNames(): string[] {
    return Object.keys(this.events);
  }

  // Get listener count for an event
  listenerCount(event: string): number {
    return this.events[event]?.length || 0;
  }
}

// Event type definitions for type safety
export interface AppEvents {
  // Command events
  'command:sent': { command: string; workspaceId?: string };
  'command:response': { plan: any };
  'command:error': { error: string };

  // Plan events
  'plan:created': { plan: any };
  'plan:approved': { plan: any };
  'plan:executing': { plan: any };
  'plan:completed': { plan: any };
  'plan:failed': { plan: any; error: string };

  // Workspace events
  'workspace:changed': { workspaceId: string };
  'workspace:created': { workspace: any };
  'workspace:updated': { workspace: any };
  'workspace:deleted': { workspaceId: string };

  // UI events
  'ui:notification': { type: 'success' | 'error' | 'warning' | 'info'; message: string };
  'ui:loading': { isLoading: boolean; message?: string };
  'ui:modal:open': { modalId: string; data?: any };
  'ui:modal:close': { modalId: string };

  // System events
  'system:stats:updated': { stats: any };
  'system:health:updated': { health: any };
  'system:error': { error: string };

  // Auth events
  'auth:login': { user: any; token: string };
  'auth:logout': {};
  'auth:error': { error: string };

  // File events
  'file:uploaded': { file: any };
  'file:error': { error: string };

  // Search events
  'search:query': { query: string };
  'search:results': { results: any[] };
  'search:error': { error: string };

  // Playwright events
  'playwright:test:start': {};
  'playwright:test:complete': { result: any };
  'playwright:test:error': { error: string };
}

// Type-safe event bus
class TypedEventBus extends EventBus {
  on<K extends keyof AppEvents>(event: K, callback: (data: AppEvents[K]) => void): () => void {
    return super.on(event, callback);
  }

  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]): void {
    super.emit(event, data);
  }

  once<K extends keyof AppEvents>(event: K, callback: (data: AppEvents[K]) => void): void {
    super.once(event, callback);
  }
}

// Export singleton instance
export const eventBus = new TypedEventBus();
export default eventBus;
