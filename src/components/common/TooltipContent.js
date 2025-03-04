// src/components/common/TooltipContent.js
import React from 'react';
import {Box, Rating} from '@mui/material';
import {COLORS, TYPOGRAPHY} from '../../themes/baseTheme';
import {formatTooltipContent} from '../../utils/formatTooltipContent';

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
      <Box sx={{textAlign: 'center'}}>
        {formatTooltipContent(title, {
          fontSize: TYPOGRAPHY.fontSize.regularText,
          lineHeight: 1.4,
        })}
      </Box>

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