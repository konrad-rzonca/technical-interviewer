// src/components/BestPracticesPanel.js
import React from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {usePanelStyles, useTitleStyles} from '../../utils/styles';
import {SPACING, TYPOGRAPHY} from '../../utils/theme';

const BestPracticesPanel = () => {
  // Use the same styling hooks as other panels for consistency
  const titleStyles = useTitleStyles();
  const panelStyles = usePanelStyles(false, true);

  return (
      <Box sx={{
        p: 2,
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Paper
            elevation={0}
            sx={panelStyles}
        >
          <Typography variant="h5" sx={titleStyles}>
            Best Practices
          </Typography>
          <Typography sx={{
            fontSize: TYPOGRAPHY.fontSize.regularText,
            marginTop: SPACING.toUnits(SPACING.md),
          }}>
            This tab will contain engineering best practices and guidelines.
          </Typography>
        </Paper>
      </Box>
  );
};

export default BestPracticesPanel;