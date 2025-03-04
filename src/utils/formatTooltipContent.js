// src/utils/formatTooltipContent.js
import React from 'react';
import {Box, Typography} from '@mui/material';
import {TYPOGRAPHY} from '../themes/baseTheme';
import {globalStyles} from './styles';

/**
 * Formats content for tooltips with proper handling of newlines and code blocks
 * @param {string} content - The text content to format
 * @param {object} options - Additional formatting options
 * @returns {JSX.Element} Formatted content ready for tooltip display
 */
export const formatTooltipContent = (content, options = {}) => {
  if (!content) return '';

  const {
    fontSize = TYPOGRAPHY.fontSize.regularText,
    lineHeight = 1.6,
    codeMaxHeight = '300px',
  } = options;

  // Handle content with code blocks
  if (content.includes('```')) {
    const parts = content.split(/```([\s\S]*?)```/);

    return (
        <Box>
          {parts.map((part, idx) => {
            // Regular text parts (even indices)
            if (idx % 2 === 0) {
              return part ? (
                  <Typography
                      key={idx}
                      variant="body1"
                      sx={{
                        mb: 1,
                        whiteSpace: 'pre-line', // Preserve line breaks
                        fontSize,
                        lineHeight,
                      }}
                  >
                    {part}
                  </Typography>
              ) : null;
            }
            // Code block parts (odd indices)
            else {
              return (
                  <Box
                      key={idx}
                      component="pre"
                      sx={{
                        ...globalStyles.pre,
                        maxHeight: codeMaxHeight,
                        margin: '8px 0',
                      }}
                  >
                    {part}
                  </Box>
              );
            }
          })}
        </Box>
    );
  }

  // For regular text with no code blocks
  return (
      <Typography
          variant="body1"
          sx={{
            fontSize,
            lineHeight,
            whiteSpace: 'pre-line', // Preserve line breaks
          }}
      >
        {content}
      </Typography>
  );
};

export default formatTooltipContent;