// src/utils/formatTooltipContent.js
import React from 'react';
import {Box, Typography} from '@mui/material';
import {TYPOGRAPHY} from '../themes/baseTheme';
import {globalStyles} from './styles';

/**
 * Formats content for tooltips with proper handling of newlines, code blocks, inline code, and Markdown-style bold formatting
 * @param {string} content - The text content to format
 * @param {object} options - Additional formatting options
 * @returns {JSX.Element} Formatted content ready for tooltip display
 */
export const formatTooltipContent = (content, options = {}) => {
  if (!content) return '';

  const {
    fontSize = TYPOGRAPHY.fontSize.regularText,
    lineHeight = 1.6,
    codeMaxHeight = '700px',
  } = options;

  // Process both bold and inline code formatting in a text segment
  const processTextFormatting = (text) => {
    if (!text.includes('**') && !text.includes('`')) return <span>{text}</span>;

    // First handle inline code with backticks
    const codeSegments = text.split(/(`[^`]+`)/g);

    return (
        <>
          {codeSegments.map((segment, i) => {
            // Handle inline code (wrapped in single backticks)
            if (segment.startsWith('`') && segment.endsWith('`')) {
              const codeText = segment.slice(1, -1);
              return (
                  <Box
                      key={i}
                      component="code"
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.06)',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                        fontSize: '0.85em',
                        display: 'inline-block',
                      }}
                  >
                    {codeText}
                  </Box>
              );
            }

            // For non-code segments, process bold formatting
            if (!segment.includes('**')) return <span key={i}>{segment}</span>;

            const boldSegments = segment.split(/(\*\*.*?\*\*)/g);
            return (
                <React.Fragment key={i}>
                  {boldSegments.map((boldSegment, j) => {
                    if (boldSegment.startsWith('**') &&
                        boldSegment.endsWith('**')) {
                      const boldText = boldSegment.slice(2, -2);
                      return <span key={j}
                                   style={{fontWeight: 'bold'}}>{boldText}</span>;
                    }
                    return <span key={j}>{boldSegment}</span>;
                  })}
                </React.Fragment>
            );
          })}
        </>
    );
  };

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
                    {processTextFormatting(part)}
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
        {processTextFormatting(content)}
      </Typography>
  );
};

export default formatTooltipContent;