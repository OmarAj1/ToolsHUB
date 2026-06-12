import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Automatically reload the page on chunk load errors (often happens after a new deployment)
    if (error.name === 'ChunkLoadError' || error.message.includes('dynamically imported module') || error.message.includes('fetch')) {
      window.location.reload();
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-lg border border-red-100">
            <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
            <p className="text-sm font-mono mb-6 bg-white p-4 rounded-xl overflow-auto text-left text-red-500 whitespace-pre-wrap snap-x max-h-[300px]">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
