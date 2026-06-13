import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PdfSafeBoundary extends Component<Props, State> {
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

  public componentDidMount() {
    window.addEventListener("error", this.handleGlobalError);
    window.addEventListener("unhandledrejection", this.handleGlobalPromiseRejection);
  }

  public componentWillUnmount() {
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener("unhandledrejection", this.handleGlobalPromiseRejection);
  }

  private handleGlobalError = (event: ErrorEvent) => {
    console.error("PDF Global Error:", event.error);
    this.setState({ hasError: true, error: event.error });
  };

  private handleGlobalPromiseRejection = (event: PromiseRejectionEvent) => {
    console.error("PDF Unhandled Promise Rejection:", event.reason);
    this.setState({ hasError: true, error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)) });
  };

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("PDF Operation ERROR:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-4xl mx-auto w-full flex flex-col items-center">
          <div className="w-full max-w-2xl bg-surface border border-borderMain p-8 rounded-2xl flex flex-col items-center text-center shadow-lg">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-textMain mb-4">This PDF operation failed</h2>
            <p className="text-slate-300 mb-6 text-sm">
              Common reasons: complex formatting, large file size, or browser limitations. Try a smaller/simpler file.
            </p>
            <div className="w-full bg-background p-4 rounded-xl text-left border border-borderMain mb-8 overflow-auto max-h-[150px]">
              <p className="text-xs font-mono text-error/80 break-all">
                {this.state.error?.message || "Unknown error occurred"}
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-primary text-textMain font-bold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Reload
              </button>
              <Link 
                to="/category/pdf"
                className="px-6 py-3 border border-borderMain text-textMain font-bold rounded-xl hover:bg-surface transition-colors flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withPdfSafeBoundary<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithPdfSafeBoundary(props: P) {
    return (
      <PdfSafeBoundary>
        <WrappedComponent {...props} />
      </PdfSafeBoundary>
    );
  };
}
