// src/utils/formatTooltipContent.js - With background precomputation
import React, {memo, useEffect, useRef} from 'react';
import {Box, Typography} from '@mui/material';
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
    backgroundColor: 'rgba(45, 45, 45, 1)',
    margin: '8px 0',
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
    padding: '1em',
    display: 'block',
    overflow: 'auto',
    backgroundColor: 'rgba(45, 45, 45, 1)',
    color: '#ccc',
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '1.15em',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    fontFeatureSettings: '"liga" 0, "calt" 0', // Add this line to disable ligatures
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

// Preload Prism.js
let prismLoaded = false;
const loadPrism = () => {
  if (prismLoaded) return Promise.resolve();

  return import('prismjs').then(() => {
    prismLoaded = true;
    import('prismjs/themes/prism-tomorrow.css');
  }).catch(err => {
    console.error('Failed to load Prism:', err);
  });
};

// Start loading Prism immediately
loadPrism();

// Optimized code highlighting component with memoization
const HighlightedCode = memo(({code, language}) => {
  const codeRef = useRef(null);
  const isHighlighted = useRef(false);

  useEffect(() => {
    if (!codeRef.current) return;

    // Apply base styling immediately
    Object.entries(PRISM_STYLING.CODE).forEach(([property, value]) => {
      codeRef.current.style[property] = value;
    });

    // Set content immediately
    codeRef.current.textContent = code;

    // Skip if already highlighted
    if (isHighlighted.current) return;

    // Load Prism if needed
    if (!prismLoaded) {
      loadPrism().then(() => highlightCode());
    } else {
      highlightCode();
    }

    function highlightCode() {
      if (!codeRef.current) return;

      import('prismjs').then(async Prism => {
        // Load language if needed
        if (language !== 'plaintext' && !Prism.languages[language]) {
          try {
            await import(`prismjs/components/prism-${language}`);
          } catch (err) {
            console.log(`Prism language '${language}' not available`);
          }
        }

        // Apply highlighting
        if (codeRef.current) {
          try {
            Prism.highlightElement(codeRef.current);
            isHighlighted.current = true;
          } catch (err) {
            console.error('Error highlighting code:', err);
          }
        }
      });
    }
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
 */
const TextWithFormatting = memo(({text}) => {
  if (!text) return null;

  // Quick check if formatting is needed at all
  if (!text.includes('**') && !text.includes('`')) {
    return <span>{text}</span>;
  }

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
                      color: '#ffffff',
                    }}>{boldText}</span>;
                  }
                  return <span key={j}>{boldSegment}</span>;
                })}
              </React.Fragment>
          );
        })}
      </>
  );
});

// Global cache for formatted tooltips
const tooltipCache = new Map();

// Background processing queue for tooltips
const tooltipQueue = [];
let isProcessingQueue = false;

// Process tooltips in the background without blocking UI
const processTooltipQueue = () => {
  if (tooltipQueue.length === 0) {
    isProcessingQueue = false;
    return;
  }

  isProcessingQueue = true;
  const nextDescription = tooltipQueue.shift();

  // Process in a non-blocking way
  setTimeout(() => {
    if (nextDescription) {
      formatTooltipContent(nextDescription);
    }

    // Continue with next item
    processTooltipQueue();
  }, 10); // Short delay to allow UI updates
};

/**
 * Queue a tooltip for background precomputation
 * @param {string} description - The tooltip content to precompute
 */
export const precomputeTooltip = (description) => {
  if (!description || tooltipCache.has(description)) return;

  // Add to queue if not already processed
  tooltipQueue.push(description);

  // Start processing if not already running
  if (!isProcessingQueue) {
    processTooltipQueue();
  }
};

/**
 * Formats content for tooltips with proper handling of newlines, code blocks,
 * inline code, and Markdown-style bold formatting.
 * Uses caching to speed up repeated calls.
 *
 * @param {string} content - The text content to format
 * @param {object} options - Additional formatting options
 * @returns {JSX.Element} Formatted content ready for tooltip display
 */
export const formatTooltipContent = (content, options = {}) => {
  if (!content) return '';

  // Use cached version if available
  if (tooltipCache.has(content)) {
    return tooltipCache.get(content);
  }

  const {
    fontSize = TYPOGRAPHY.fontSize.regularText,
    lineHeight = 1.6,
    codeMaxHeight = '700px',
    maxWidth = '1200px',
  } = options;

  let result;

  // Handle content with code blocks
  if (content.includes('```')) {
    const parts = content.split(/```([\s\S]*?)```/);

    result = (
        <Box sx={{maxWidth}}>
          {parts.map((part, idx) => {
            // Regular text parts (even indices)
            if (idx % 2 === 0) {
              return part ? (
                  <Typography
                      key={idx}
                      variant="body1"
                      sx={{
                        my: 1,
                        mx: 0.5,
                        fontSize,
                        lineHeight,
                      }}
                  >
                    <TextWithFormatting text={part}/>
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
  } else {
    // For regular text with no code blocks - much simpler path
    result = (
        <Typography
            variant="body1"
            sx={{
              my: 0.5,
              mx: 0.5,
              fontSize,
              lineHeight,
              whiteSpace: 'pre-line', // Preserve line breaks
            }}
        >
          <TextWithFormatting text={content}/>
        </Typography>
    );
  }

  // Cache the result
  tooltipCache.set(content, result);
  return result;
};

export default formatTooltipContent;