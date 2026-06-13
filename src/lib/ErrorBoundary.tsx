import React, { ErrorInfo } from 'react';
import { analytics } from './analytics';

interface Props {
  children: React.ReactNode;
  toolId?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.toolId) {
      analytics.logError(this.props.toolId, error.message);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 h-full flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-100 bg-red-900/30 text-red-600 text-red-400 rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 className="text-xl font-bold text-slate-50 text-white mb-2">Something went wrong</h3>
          <p className="text-slate-400 text-slate-50 max-w-md">
            This tool encountered an unexpected error. The error has been logged automatically.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 px-4 py-2 bg-slate-900 bg-slate-800 text-white text-slate-50 font-bold rounded-xl hover:bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
