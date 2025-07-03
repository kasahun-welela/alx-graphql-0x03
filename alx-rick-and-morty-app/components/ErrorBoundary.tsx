import React, { ReactNode } from "react";
import * as Sentry from "@sentry/react";

interface State {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true };
  }

  //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  //     Sentry.captureException(error, { extra: errorInfo });
  //     console.log({ error, errorInfo });
  //   }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Capture error in Sentry with component stack trace
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        environment: "development",
      },
    });

    console.error("Error boundary caught:", error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
