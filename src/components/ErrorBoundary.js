import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ErrorContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  color: var(--hot-pink);
`;

const ErrorTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient-hot);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: var(--text-secondary);
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
  max-width: 600px;
`;

const RetryButton = styled(motion.button)`
  background: var(--gradient-primary);
  color: var(--text-primary);
  border: none;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-family: var(--font-primary);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: var(--shadow-glow);
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>System Error Detected</ErrorTitle>
          <ErrorMessage>
            The elite portfolio system has encountered an unexpected error. 
            Our cybersecurity protocols are working to restore full functionality.
          </ErrorMessage>
          <RetryButton
            onClick={this.handleRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Restart System
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
