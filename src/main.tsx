import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { FirebaseProvider } from './context/FirebaseContext';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const raw = error instanceof Error ? error.message : 'An unexpected error occurred.';
    let readable = raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.error === 'string') {
        readable = parsed.error.includes('Quota exceeded')
          ? 'Daily database quota has been reached. Quota resets tomorrow.'
          : parsed.error;
      }
    } catch {
      // Keep original error message
    }
    return { hasError: true, message: readable };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-canvas)] p-6">
          <div className="max-w-md w-full bg-white border border-[var(--color-hairline)] rounded-xl p-8 text-center shadow-sm">
            <h1 className="font-display text-2xl font-semibold text-[var(--color-primary-ink)]">
              Unable to complete request
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 px-5 py-2.5 text-xs font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] transition-colors rounded-lg cursor-pointer"
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

createRoot(document.getElementById('root')!).render(
  <AppErrorBoundary>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </AppErrorBoundary>
);
