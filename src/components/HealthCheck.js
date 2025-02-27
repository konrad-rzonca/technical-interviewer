// src/components/HealthCheck.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HealthCheck = () => {
  const [health, setHealth] = useState({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: 0,
    version: '1.0.0',
    components: {
      UI: 'healthy',
      dataLoader: 'healthy',
      storage: 'healthy'
    }
  });

  // Simulate checking component health
  useEffect(() => {
    // Update uptime every second
    const interval = setInterval(() => {
      setHealth(prevHealth => ({
        ...prevHealth,
        uptime: prevHealth.uptime + 1,
        timestamp: new Date().toISOString()
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
          storage: 'degraded'
        },
        status: 'degraded'
      }));
    }
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon
            color={health.status === 'healthy' ? 'success' : 'warning'}
            sx={{ mr: 2 }}
          />
          <Typography variant="h5">
            Application Health Status
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={health.status.toUpperCase()}
            color={health.status === 'healthy' ? 'success' : 'warning'}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <List dense>
          <ListItem>
            <ListItemText
              primary="Version"
              secondary={health.version}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Timestamp"
              secondary={health.timestamp}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Uptime"
              secondary={`${health.uptime} seconds`}
            />
          </ListItem>
        </List>

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Component Status
        </Typography>

        <List dense>
          {Object.entries(health.components).map(([component, status]) => (
            <ListItem key={component}>
              <ListItemText
                primary={component.charAt(0).toUpperCase() + component.slice(1)}
                secondary={status.toUpperCase()}
              />
              <Chip
                size="small"
                label={status}
                color={status === 'healthy' ? 'success' : 'warning'}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default HealthCheck;