// src/utils/formatTooltipContent.js
import React, {useEffect, useRef} from 'react';
import {Box, Typography} from '@mui/material';
// Remove eager loading of Prism and all languages - we'll load them dynamically
import {TYPOGRAPHY} from '../themes/baseTheme';

// Constants for styling
const INLINE_CODE_STYLES = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  padding: '2px 4px',
  fontSize: '0.90rem',
  fontFamily: '"JetBrains Mono", monospace',
  display: 'inline-block',
  color: '#e6e6e6',
  lineHeight: 1.4,
};

// Original Prism-tomorrow theme styling extracted to constants
const PRISM_STYLING = {
  // Code block container styling
  CONTAINER: {
    borderRadius: '4px',
    backgroundColor: 'rgba(45, 45, 45, 1)', // Original darker background
    margin: '8px 0', // Keep original margin
    overflow: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  // Pre element styling
  PRE: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    overflow: 'auto',
  },
  // Code element styling - matching Prism's tomorrow theme
  CODE: {
    padding: '1em', // Original Prism padding
    display: 'block',
    overflow: 'auto',
    backgroundColor: 'rgba(45, 45, 45, 1)',
    color: '#ccc', // Original text color
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '1.15em',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
};

/**
 * Detects programming language from code block
 * @param {string} codeBlock - Code block content with optional language identifier
 * @returns {Object} - Language identifier and clean code
 */
const detectLanguage = (codeBlock) => {
  if (!codeBlock) return {language: 'plaintext', code: ''};

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
 * Format code using Prism.js with pre-styling to prevent flicker
 * @param {string} code - Code to highlight
 * @param {string} language - Programming language
 * @returns {JSX.Element} - Highlighted code
 */
const HighlightedCode = React.memo(({code, language}) => {
  // Reference to code element for direct style manipulation
  const codeRef = useRef(null);

  useEffect(() => {
    // Add pre-styling to code block before Prism touches it
    if (codeRef.current) {
      // Apply all Prism styling properties
      Object.entries(PRISM_STYLING.CODE).forEach(([property, value]) => {
        codeRef.current.style[property] = value;
      });
    }

    // Use a setTimeout to defer Prism loading until after tooltip is shown
    const timer = setTimeout(() => {
      if (code && language) {
        import('prismjs').then(Prism => {
          // Import the theme
          import('prismjs/themes/prism-tomorrow.css');

          // Dynamically import the language if needed
          if (language !== 'plaintext' && !Prism.languages[language]) {
            import(`prismjs/components/prism-${language}`).catch(() => {
              console.log(`Prism language '${language}' not available`);
            }).finally(() => {
              Prism.highlightAll();
            });
          } else {
            Prism.highlightAll();
          }
        });
      }
    }, 100); // Small delay to prioritize showing the tooltip first

    return () => clearTimeout(timer);
  }, [code, language]);

  return (
      <pre style={PRISM_STYLING.PRE}>
        <code
            ref={codeRef}
            className={`language-${language}`}
        >
          {code}
        </code>
      </pre>
  );
});

/**
 * Process text formatting for bold and inline code
 * @param {string} text - Text to format
 * @returns {JSX.Element} Formatted text with bold and inline code
 */
const processTextFormatting = (text) => {
  if (!text ||
      (!text.includes('**') && !text.includes('`'))) return <span>{text ||
      ''}</span>;

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
                      color: '#ffffff', // Soft cyan color that works well on dark backgrounds
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
                        my: 1.5,
                        mx: 0.5,
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
                        ...PRISM_STYLING.CONTAINER,
                        maxHeight: codeMaxHeight,
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