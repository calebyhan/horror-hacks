'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-background-danger">
          <div className="text-center space-y-8 p-8">
            <h1 className="text-6xl font-mono text-ui-accent">ERROR</h1>

            <div className="max-w-2xl">
              <p className="text-ui-primary font-mono mb-4">
                Something went wrong. The game has crashed.
              </p>

              {this.state.error && (
                <pre className="text-sm text-ui-secondary font-mono bg-background-primary p-4 border border-ui-secondary overflow-auto max-h-64">
                  {this.state.error.message}
                </pre>
              )}
            </div>

            <button
              onClick={this.handleReset}
              className="px-8 py-4 bg-entity-shadow hover:bg-entity-frozen text-ui-primary font-mono text-xl border border-ui-secondary transition-colors"
            >
              RELOAD GAME
            </button>

            <p className="text-sm text-ui-secondary font-mono">
              If the problem persists, try clearing your browser cache
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}