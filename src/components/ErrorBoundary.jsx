import React from 'react';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    /* Zero console.* in production */
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = process.env.PUBLIC_URL || '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="error-boundary" role="alert" aria-live="assertive">
        <div className="error-boundary__inner">
          <span className="error-boundary__icon" aria-hidden="true">⚠️</span>
          <h1 className="error-boundary__title">Something went wrong</h1>
          <p className="error-boundary__subtitle">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="error-boundary__detail">
              {this.state.error.toString()}
            </pre>
          )}
          <button
            className="btn btn--primary"
            onClick={this.handleReset}
          >
            ↺ Reload
          </button>
        </div>
      </div>
    );
  }
}
