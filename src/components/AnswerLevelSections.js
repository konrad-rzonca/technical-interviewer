// src/components/AnswerLevelSections.js - Refactored
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Popper,
  Fade,
  ClickAwayListener,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import { getSkillLevelStyles, globalStyles } from '../utils/styleHooks';
import { SPACING, TYPOGRAPHY, COLORS } from '../utils/theme';

// Smarter bullet point extraction
const extractKeyPoints = (content) => {
  // Handle code blocks first - don't break them up
  let processedContent = content;
  const codeBlocks = [];
  const codeRegex = /```([\s\S]*?)```/g;
  let match;
  let index = 0;

  while ((match = codeRegex.exec(content)) !== null) {
    // Replace the code block with a placeholder
    const placeholder = `[CODE_BLOCK_${index}]`;
    processedContent = processedContent.replace(match[0], placeholder);
    codeBlocks.push(match[1]);
    index++;
  }

  // Identify list items
  const listPoints = [];

  // Try to split on numbered points (1., 2., etc.) or bullet markers (* or -)
  const listItemRegex = /(?:^|\n)(?:\d+\.\s+|\*\s+|-\s+)([^\n]+)/g;
  let listMatch;

  while ((listMatch = listItemRegex.exec(processedContent)) !== null) {
    listPoints.push({
      title: "● " + listMatch[1].trim().split(' ').slice(0, 3).join(' ') + "...",
      description: listMatch[1].trim()
    });
  }

  // If we found list items, use them
  if (listPoints.length > 0) {
    // Restore code blocks in descriptions
    return listPoints.map(point => {
      let desc = point.description;
      for (let i = 0; i < codeBlocks.length; i++) {
        desc = desc.replace(`[CODE_BLOCK_${i}]`, "```" + codeBlocks[i] + "```");
      }
      return {
        ...point,
        description: desc
      };
    });
  }

  // Otherwise, try to split on sentences
  const sentences = processedContent.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

  // For longer content, try to create 3-6 meaningful points
  if (sentences.length <= 2 && content.length > 200) {
    // Split into roughly equal chunks
    const chunks = [];
    const idealChunkCount = 3;
    const idealChunkSize = content.length / idealChunkCount;

    let currentChunk = "";
    let currentLength = 0;

    for (const sentence of sentences) {
      if (currentLength + sentence.length > idealChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
        currentLength = sentence.length;
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
        currentLength += sentence.length;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks.map(chunk => {
      // Create a concise summary for the title
      const words = chunk.split(' ');
      const title = "● " + words.slice(0, 3).join(' ') + (words.length > 3 ? "..." : "");

      return {
        title,
        description: chunk
      };
    });
  }

  // For shorter content or single-sentence answers
  if (sentences.length <= 1) {
    return [{
      title: "● " + sentences[0].split(' ').slice(0, 3).join(' ') + "...",
      description: sentences[0]
    }];
  }

  // For multiple sentences, each becomes a bullet point
  return sentences.map(sentence => ({
    title: "● " + sentence.split(' ').slice(0, 3).join(' ') + (sentence.split(' ').length > 3 ? "..." : ""),
    description: sentence
  }));
};

const AnswerLevelSections = ({ answerLevels }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPoints, setSelectedPoints] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [organizedLevels, setOrganizedLevels] = useState([]);

  // Process answer levels when they change
  useEffect(() => {
    if (!answerLevels || answerLevels.length === 0) return;

    // Sort levels and extract key points
    const processed = answerLevels
      .sort((a, b) => a.level - b.level)
      .map(level => ({
        ...level,
        keyPoints: extractKeyPoints(level.content)
      }));

    setOrganizedLevels(processed);
    setSelectedPoints({});
  }, [answerLevels]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlePointClick = (levelIndex, pointIndex) => {
    const key = `${levelIndex}-${pointIndex}`;
    setSelectedPoints(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePointMouseEnter = (event, description) => {
    setTooltipContent(description);
    setAnchorEl(event.currentTarget);
  };

  const handlePointMouseLeave = () => {
    // Close tooltip immediately
    setAnchorEl(null);
  };

  const handleTooltipClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Get level label based on index
  const getLevelLabel = (index) => {
    switch (index) {
      case 0: return 'Basic';
      case 1: return 'Intermediate';
      case 2: return 'Advanced';
      default: return `Level ${index + 1}`;
    }
  };

  // Get level styles based on index
  const getLevelStyles = (index) => {
    const levelMap = ['beginner', 'intermediate', 'advanced'];
    const level = levelMap[index] || 'beginner';
    return getSkillLevelStyles(level);
  };

  // Replace code blocks with properly formatted code
  const formatDescription = (description) => {
    if (!description) return '';

    // Check if the description contains a code block
    if (description.includes('```')) {
      // Split by code block delimiters
      const parts = description.split(/```([\s\S]*?)```/);

      if (parts.length <= 1) return description;

      // Rebuild with proper code formatting
      return (
        <Box>
          {parts.map((part, index) => {
            // Even indices are regular text, odd indices are code
            if (index % 2 === 0) {
              return part ? <Typography key={index} variant="body1" sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}>{part}</Typography> : null;
            } else {
              return (
                <Box
                  key={index}
                  component="pre"
                  sx={{
                    ...globalStyles.pre,
                    mt: SPACING.toUnits(SPACING.sm),
                    mb: SPACING.toUnits(SPACING.sm)
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

    return description;
  };

  return (
    <Box>
      {/* Level tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        sx={{
          mb: SPACING.toUnits(SPACING.sm),
          '& .MuiTabs-indicator': {
            backgroundColor: getLevelStyles(selectedTab).main
          }
        }}
      >
        {organizedLevels.map((level, index) => (
          <Tab
            key={index}
            label={getLevelLabel(index)}
            sx={{
              textTransform: 'none',
              color: 'text.primary',
              '&.Mui-selected': {
                color: getLevelStyles(index).main
              }
            }}
          />
        ))}
      </Tabs>

      {/* Key points for selected level */}
      {organizedLevels.map((level, levelIndex) => {
        const levelStyles = getLevelStyles(levelIndex);

        return (
          <Box
            key={levelIndex}
            sx={{
              display: selectedTab === levelIndex ? 'block' : 'none',
              p: SPACING.toUnits(SPACING.sm),
              border: `1px solid ${levelStyles.border}`,
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
              backgroundColor: levelStyles.background
            }}
          >
            <Grid container spacing={SPACING.toUnits(SPACING.sm)}>
              {level.keyPoints.map((point, pointIndex) => {
                const key = `${levelIndex}-${pointIndex}`;
                const isSelected = selectedPoints[key];

                return (
                  <Grid item xs={12} sm={6} md={4} key={pointIndex}>
                    <Box
                      onClick={() => handlePointClick(levelIndex, pointIndex)}
                      onMouseEnter={(e) => handlePointMouseEnter(e, point.description)}
                      onMouseLeave={handlePointMouseLeave}
                      sx={{
                        p: SPACING.toUnits(SPACING.md),
                        borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
                        cursor: 'pointer',
                        backgroundColor: isSelected ? `${levelStyles.main}10` : 'white',
                        border: `1px solid ${isSelected ? `${levelStyles.main}50` : COLORS.grey[200]}`,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: `${levelStyles.main}10`,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
                      >
                        {point.title}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}

      {/* Tooltip */}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="top"
        transition
        sx={{
          zIndex: 1200,
          maxWidth: 450,
          '& .MuiPaper-root': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Fade {...TransitionProps} timeout={100}>
              <Paper elevation={3} sx={{ p: SPACING.toUnits(SPACING.sm) }}>
                {formatDescription(tooltipContent)}
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  );
};

export default AnswerLevelSections;