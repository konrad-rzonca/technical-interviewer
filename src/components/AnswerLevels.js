// src/components/AnswerLevels.js - Refactored
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getSkillLevelStyles, globalStyles } from '../utils/styleHooks';
import { SPACING, TYPOGRAPHY } from '../utils/theme';

const AnswerLevels = ({ answerLevels }) => {
  const [expanded, setExpanded] = useState([]);

  const handleToggle = (level) => {
    setExpanded((prev) => {
      if (prev.includes(level)) {
        return prev.filter((l) => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  // Get theme-based styles for each difficulty level
  const getLevelStyles = (level) => {
    // Map the level number to our standardized level names
    const levelMap = {
      1: 'beginner',     // Basic
      2: 'intermediate', // Intermediate
      3: 'advanced'      // Advanced
    };

    const levelKey = levelMap[level] || 'beginner';
    const styles = getSkillLevelStyles(levelKey);

    // Map the level to a text label
    const textMap = {
      1: 'Basic',
      2: 'Intermediate',
      3: 'Advanced'
    };

    return { ...styles, text: textMap[level] || 'Unknown' };
  };

  if (!answerLevels || answerLevels.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
      >
        No answer levels available for this question.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{
          fontSize: TYPOGRAPHY.fontSize.regularText,
          mb: SPACING.toUnits(SPACING.sm)
        }}
      >
        Click to reveal different levels of answer detail:
      </Typography>

      {answerLevels
        .sort((a, b) => a.level - b.level)
        .map((answerLevel) => {
          const levelStyles = getLevelStyles(answerLevel.level);

          return (
            <Accordion
              key={answerLevel.level}
              expanded={expanded.includes(answerLevel.level)}
              onChange={() => handleToggle(answerLevel.level)}
              sx={{
                mb: SPACING.toUnits(SPACING.sm),
                border: `1px solid ${levelStyles.main}`,
                borderRadius: `${SPACING.toUnits(SPACING.borderRadius / 2)}px !important`,
                overflow: 'hidden',
                '&:before': {
                  display: 'none',
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`answer-level-${answerLevel.level}-content`}
                id={`answer-level-${answerLevel.level}-header`}
                sx={{
                  bgcolor: `${levelStyles.main}15`, // 15% opacity
                  '&:hover': {
                    bgcolor: `${levelStyles.main}20`, // 20% opacity on hover
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip
                    label={`Level ${answerLevel.level}`}
                    size="small"
                    sx={{
                      bgcolor: levelStyles.main,
                      color: 'white',
                      mr: SPACING.toUnits(SPACING.sm),
                      fontSize: TYPOGRAPHY.fontSize.caption
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontSize: TYPOGRAPHY.fontSize.regularText,
                      fontWeight: TYPOGRAPHY.fontWeight.medium
                    }}
                  >
                    {levelStyles.text} Answer
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontSize: TYPOGRAPHY.fontSize.regularText,
                    lineHeight: 1.6,
                    '& code': {
                      ...globalStyles.code
                    },
                  }}
                >
                  {answerLevel.content}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </Box>
  );
};

export default AnswerLevels;