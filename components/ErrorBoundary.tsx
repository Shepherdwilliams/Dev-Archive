import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React lifecycle:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-black text-white flex items-center justify-center p-6 font-mono">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase text-rose-400 tracking-wider">
                System Anomaly Detected
              </h2>
              <p className="text-xs text-slate-400">
                An unexpected application error occurred. The system has paused to prevent data corruption.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-left text-[11px] text-slate-400 font-mono overflow-x-auto max-h-32">
                <code>{this.state.error.message}</code>
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 rounded-xl bg-brand-green hover:bg-brand-green-dark text-brand-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-brand-green/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reinitialize System</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
