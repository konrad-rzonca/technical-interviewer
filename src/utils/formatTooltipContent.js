// src/utils/formatTooltipContent.js
import React, {useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme for code blocks
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import {TYPOGRAPHY} from '../themes/baseTheme';
import {globalStyles} from './styles';

// Constants
const INLINE_CODE_STYLES = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: '2px 4px',
  fontSize: '0.90rem',
  fontFamily: '"JetBrains Mono", monospace',
  display: 'inline-block',
  color: '#e6e6e6',
  lineHeight: 1.4,
};

const CODE_BLOCK_STYLES = {
  ...globalStyles.pre,
  borderRadius: '4px',
  padding: '0', // Removed padding
  margin: '0', // Remove margin
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.95rem', // Increased font size
  overflowX: 'auto',
  lineHeight: 1.4,
  color: '#e6e6e6',
};
/**
 * Detects programming language from code block
 * @param {string} codeBlock - Code block content with optional language identifier
 * @returns {Object} - Language identifier and clean code
 */
const detectLanguage = (codeBlock) => {
  // Check if the first line contains a language identifier
  const firstLine = codeBlock.trim().split('\n')[0];
  let language = 'plaintext';
  let code = codeBlock;

  if (firstLine.match(/^[a-zA-Z0-9_+-]+$/)) {
    // Extract language and remove it from the code
    language = firstLine.toLowerCase();
    code = codeBlock.substring(firstLine.length + 1);

    // Map common language identifiers to Prism's language names
    const languageMap = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'py': 'python',
      'sh': 'bash',
      'shell': 'bash',
      'java': 'java',
      'json': 'json',
      'css': 'css',
      'html': 'html',
      'sql': 'sql',
    };

    language = languageMap[language] || language;
  }

  return {language, code};
};

/**
 * Format code using Prism.js
 * @param {string} code - Code to highlight
 * @param {string} language - Programming language
 * @returns {JSX.Element} - Highlighted code
 */
const HighlightedCode = ({code, language}) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
      <pre style={{margin: 0}}>
      <code className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

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
    maxWidth = '1200px',
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
                      sx={INLINE_CODE_STYLES}
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
                      return <span key={j} style={{
                        fontWeight: 'bold',
                        color: '#4DC3D0', // Soft cyan color that works well on dark backgrounds
                      }}>{boldText}</span>;
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
        <Box sx={{maxWidth}}>
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
              const {language, code} = detectLanguage(part);
              return (
                  <Box
                      key={idx}
                      sx={{
                        ...CODE_BLOCK_STYLES,
                        maxHeight: codeMaxHeight,
                        margin: '8px 0',
                      }}
                  >
                    <HighlightedCode code={code} language={language}/>
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