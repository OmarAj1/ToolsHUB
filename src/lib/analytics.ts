type EventType = 'OPEN_TOOL' | 'TOOL_ERROR';

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  type: EventType;
  toolId: string;
  message?: string;
}

class AnalyticsTracker {
  events: AnalyticsEvent[] = [];
  listeners: Array<() => void> = [];

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getEvents() {
    return this.events;
  }

  logOpen(toolId: string) {
    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      type: 'OPEN_TOOL',
      toolId,
    };
    this.events.unshift(event);
    if (this.events.length > 50) this.events.pop();
    console.log(`[Analytics] Tool Opened: ${toolId}`);
    this.notify();
  }

  logError(toolId: string, message: string) {
    const event: AnalyticsEvent = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      type: 'TOOL_ERROR',
      toolId,
      message,
    };
    this.events.unshift(event);
    if (this.events.length > 50) this.events.pop();
    console.error(`[Analytics] Tool Error (${toolId}): ${message}`);
    this.notify();
  }
}

export const analytics = new AnalyticsTracker();
