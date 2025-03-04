// src/components/common/TooltipContent.js
import React from 'react';
import {Box, Rating, Typography} from '@mui/material';
import {COLORS, TYPOGRAPHY} from '../../themes/baseTheme';

/**
 * Standardized tooltip content component with consistent styling
 */
const TooltipContent = ({
  title,
  rating,
  maxWidth = 350,
}) => (
    <Box sx={{
      maxWidth: maxWidth,
      // Don't add padding here - it's handled by the tooltip slotProps
    }}>
      <Typography sx={{
        fontSize: TYPOGRAPHY.fontSize.regularText,
        fontWeight: TYPOGRAPHY.fontWeight.regular,
        lineHeight: 1.4,
        textAlign: 'center',
      }}>
        {title}
      </Typography>

      {rating !== undefined && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 1,
          }}>
            <Rating
                value={rating}
                readOnly
                size="small"
                sx={{color: COLORS.basic.main}}
            />
          </Box>
      )}
    </Box>
);

export default TooltipContent;