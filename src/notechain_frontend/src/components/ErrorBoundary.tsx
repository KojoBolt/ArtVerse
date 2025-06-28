import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by error boundary:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-background text-text-primary flex items-center justify-center">
                    <div className="max-w-md mx-auto text-center p-6 bg-surface rounded-lg shadow-xl">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h2>
                        <p className="text-text-secondary mb-4">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <div className="space-x-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
                            >
                                Refresh Page
                            </button>
                            <button
                                onClick={() => this.setState({ hasError: false, error: undefined })}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-150 ease-in-out"
                            >
                                Try Again
                            </button>
                        </div>
                        {this.state.error && (
                            <details className="mt-4 text-left">
                                <summary className="text-sm text-text-secondary cursor-pointer">Error Details</summary>
                                <pre className="mt-2 text-xs text-red-400 bg-gray-800 p-2 rounded overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
