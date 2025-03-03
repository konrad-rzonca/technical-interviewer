// src/components/HealthCheck.js - Updated with unified styles
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {usePanelStyles, useTitleStyles} from '../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../themes/baseTheme';

const HealthCheck = () => {
  const [health, setHealth] = useState({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: 0,
    version: '1.0.0',
    components: {
      UI: 'healthy',
      dataLoader: 'healthy',
      storage: 'healthy',
    },
  });

  // Title styles using the hook
  const titleStyles = useTitleStyles({fontSize: TYPOGRAPHY.fontSize.h5});

  // Panel styles for the health check container
  const panelStyles = usePanelStyles(false, true);

  // Simulate checking component health
  useEffect(() => {
    // Update uptime every second
    const interval = setInterval(() => {
      setHealth(prevHealth => ({
        ...prevHealth,
        uptime: prevHealth.uptime + 1,
        timestamp: new Date().toISOString(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check if localStorage is available
  useEffect(() => {
    try {
      localStorage.setItem('healthCheck', 'test');
      localStorage.removeItem('healthCheck');
    } catch (e) {
      setHealth(prevHealth => ({
        ...prevHealth,
        components: {
          ...prevHealth.components,
          storage: 'degraded',
        },
        status: 'degraded',
      }));
    }
  }, []);

  // Get appropriate color based on health status
  const getStatusColor = (status) => {
    return status === 'healthy' ? COLORS.basic.main : COLORS.intermediate.main;
  };

  return (
      <Box sx={{
        p: SPACING.toUnits(SPACING.xl),
        maxWidth: 600,
        mx: 'auto',
      }}>
        <Paper elevation={0} sx={{
          ...panelStyles,
          p: SPACING.toUnits(SPACING.lg),
          border: `1px solid ${COLORS.grey[200]}`,
          borderRadius: SPACING.toUnits(SPACING.borderRadius),
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: SPACING.toUnits(SPACING.sm),
          }}>
            <CheckCircleIcon
                sx={{
                  mr: SPACING.toUnits(SPACING.sm),
                  color: getStatusColor(health.status),
                }}
            />
            <Typography variant="h5" sx={titleStyles}>
              Application Health Status
            </Typography>
          </Box>

          <Box sx={{mb: SPACING.toUnits(SPACING.lg)}}>
            <Chip
                label={health.status.toUpperCase()}
                color={health.status === 'healthy' ? 'success' : 'warning'}
                sx={{
                  fontWeight: TYPOGRAPHY.fontWeight.medium,
                  fontSize: TYPOGRAPHY.fontSize.caption,
                }}
            />
          </Box>

          <Divider sx={{my: SPACING.toUnits(SPACING.sm)}}/>

          <List dense>
            <ListItem>
              <ListItemText
                  primary={
                    <Typography
                        sx={{fontSize: TYPOGRAPHY.fontSize.regularText}}>Version</Typography>
                  }
                  secondary={
                    <Typography sx={{
                      fontSize: TYPOGRAPHY.fontSize.caption,
                      color: COLORS.text.secondary,
                    }}>{health.version}</Typography>
                  }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                  primary={
                    <Typography
                        sx={{fontSize: TYPOGRAPHY.fontSize.regularText}}>Timestamp</Typography>
                  }
                  secondary={
                    <Typography sx={{
                      fontSize: TYPOGRAPHY.fontSize.caption,
                      color: COLORS.text.secondary,
                    }}>{health.timestamp}</Typography>
                  }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                  primary={
                    <Typography
                        sx={{fontSize: TYPOGRAPHY.fontSize.regularText}}>Uptime</Typography>
                  }
                  secondary={
                    <Typography sx={{
                      fontSize: TYPOGRAPHY.fontSize.caption,
                      color: COLORS.text.secondary,
                    }}>{`${health.uptime} seconds`}</Typography>
                  }
              />
            </ListItem>
          </List>

          <Typography variant="subtitle1" sx={{
            mt: SPACING.toUnits(SPACING.sm),
            mb: SPACING.toUnits(SPACING.xs),
            fontSize: TYPOGRAPHY.fontSize.h6,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
          }}>
            Component Status
          </Typography>

          <List dense>
            {Object.entries(health.components).map(([component, status]) => (
                <ListItem key={component}>
                  <ListItemText
                      primary={
                        <Typography
                            sx={{fontSize: TYPOGRAPHY.fontSize.regularText}}>
                          {component.charAt(0).toUpperCase() +
                              component.slice(1)}
                        </Typography>
                      }
                      secondary={
                        <Typography sx={{
                          fontSize: TYPOGRAPHY.fontSize.caption,
                          color: COLORS.text.secondary,
                        }}>{status.toUpperCase()}</Typography>
                      }
                  />
                  <Chip
                      size="small"
                      label={status}
                      color={status === 'healthy' ? 'success' : 'warning'}
                      sx={{fontSize: TYPOGRAPHY.fontSize.small}}
                  />
                </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
  );
};

export default HealthCheck;