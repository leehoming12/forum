import _ from 'lodash';
import React from 'react';
import { useLocation } from 'react-router-dom';

type ErrorBoundaryProps = React.PropsWithChildren<{
  fallback: React.ReactNode | ((error: Error) => React.ReactNode);
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}>;

type ErrorBoundaryState = { error?: Error; };

class _ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  state: ErrorBoundaryState = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  reset() {
    this.setState({ error: undefined });
  }

  render() {
    const { fallback, children } = this.props;
    if (!_.isNil(this.state.error)) {
      return _.isFunction(fallback) ? fallback(this.state.error) : fallback;
    }
    return children;
  }
}

export const ErrorBoundary = (
  props: ErrorBoundaryProps,
) => {
  const { pathname } = useLocation();
  return (
    <_ErrorBoundary key={pathname} {...props} />
  );
};

export default ErrorBoundary;