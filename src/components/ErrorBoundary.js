// src/components/ErrorBoundary.js - Refactored
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { SPACING, TYPOGRAPHY, COLORS } from '../utils/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.log('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Centered error UI using theme tokens
      return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '50vh',
          width: '100%',
          padding: SPACING.toUnits(SPACING.md),
          textAlign: 'center',
          backgroundColor: COLORS.grey[50],
          borderRadius: SPACING.toUnits(SPACING.borderRadius),
          margin: `${SPACING.toUnits(SPACING.md)} auto`,
          maxWidth: '600px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.error.main}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginBottom: SPACING.toUnits(SPACING.md) }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>

          <Typography variant="h5" sx={{
            color: COLORS.text.primary,
            marginBottom: SPACING.toUnits(SPACING.md),
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: TYPOGRAPHY.fontSize.h5
          }}>
            Something went wrong
          </Typography>

          <Typography sx={{
            color: COLORS.text.secondary,
            marginBottom: SPACING.toUnits(SPACING.lg),
            maxWidth: '400px',
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: TYPOGRAPHY.fontSize.regularText
          }}>
            The application encountered an unexpected error. Please try again or refresh the page.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => this.setState({ hasError: false })}
            sx={{
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: TYPOGRAPHY.fontSize.button,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: COLORS.primary.dark,
              }
            }}
          >
            Try again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;