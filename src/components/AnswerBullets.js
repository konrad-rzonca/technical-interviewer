// src/components/AnswerBullets.js - Refactored
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Popper,
  Fade,
  ClickAwayListener
} from '@mui/material';
import { SPACING, TYPOGRAPHY, COLORS } from '../utils/theme';

// Function to extract bullet points from answer content
const extractBulletPoints = (content) => {
  // Split by line breaks or obvious bullet points
  const lines = content.split(/\n|•|^\s*-\s*/m).filter(line => line.trim().length > 0);

  // For shorter answers, create artificial bullet points
  if (lines.length <= 1 && content.length > 15) {
    // Split by periods or semicolons
    const sentences = content.split(/[.;]/).filter(s => s.trim().length > 0);
    if (sentences.length > 1) {
      return sentences.map(s => s.trim());
    }

    // As a fallback, split into phrases of reasonable length
    if (content.length > 80) {
      let result = [];
      let current = '';
      const words = content.split(' ');

      words.forEach(word => {
        if ((current + ' ' + word).length > 60) {
          result.push(current.trim());
          current = word;
        } else {
          current += (current ? ' ' : '') + word;
        }
      });

      if (current) {
        result.push(current.trim());
      }

      return result;
    }
  }

  return lines;
};

const AnswerBullets = ({ answerLevels }) => {
  const [selectedBullets, setSelectedBullets] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [allBulletPoints, setAllBulletPoints] = useState([]);

  useEffect(() => {
    if (!answerLevels || answerLevels.length === 0) return;

    // Use the most detailed answer level to extract bullet points
    const detailedAnswer = answerLevels.sort((a, b) => b.level - a.level)[0].content;
    const bulletPoints = extractBulletPoints(detailedAnswer);
    setAllBulletPoints(bulletPoints);

    // Reset selected bullets
    setSelectedBullets([]);
  }, [answerLevels]);

  const handleBulletClick = (index) => {
    setSelectedBullets(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleBulletHover = (event, point) => {
    // On very small screens, we'll use click instead of hover
    if (window.innerWidth < 600) return;

    setTooltipContent(point);
    setAnchorEl(event.currentTarget);
  };

  const handleBulletLeave = () => {
    // On very small screens, we'll use click instead of hover
    if (window.innerWidth < 600) return;

    // Immediately hide tooltip without delay
    setAnchorEl(null);
  };

  const handleTooltipClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // On small screens, clicking a bullet will toggle a tooltip
  const handleMobileBulletClick = (event, point) => {
    if (window.innerWidth >= 600) return;

    if (anchorEl === event.currentTarget) {
      setAnchorEl(null);
    } else {
      setTooltipContent(point);
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          mb: SPACING.toUnits(SPACING.sm),
          fontWeight: TYPOGRAPHY.fontWeight.medium,
          color: 'text.secondary',
          fontSize: TYPOGRAPHY.fontSize.regularText
        }}
      >
        Answer Key Points
      </Typography>

      <Box
        className="answer-bullets"
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: SPACING.toUnits(SPACING.xs)
        }}
      >
        {allBulletPoints.map((point, index) => (
          <Box
            key={index}
            className={`answer-bullet ${selectedBullets.includes(index) ? 'selected' : ''}`}
            onClick={() => handleBulletClick(index)}
            onMouseEnter={(e) => handleBulletHover(e, point)}
            onMouseLeave={handleBulletLeave}
            onTouchStart={(e) => handleMobileBulletClick(e, point)}
            sx={{
              fontSize: TYPOGRAPHY.fontSize.small,
              padding: `${SPACING.toUnits(SPACING.xs)} ${SPACING.toUnits(SPACING.sm)}`,
              borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
              backgroundColor: selectedBullets.includes(index) ? `${COLORS.primary.main}08` : COLORS.grey[100],
              border: selectedBullets.includes(index) ? `1px solid ${COLORS.primary.main}20` : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: `${COLORS.primary.main}08`,
              }
            }}
          >
            {point.length > 40 ? point.substring(0, 40) + '...' : point}
          </Box>
        ))}
      </Box>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        sx={{ zIndex: 1200, maxWidth: 300 }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Fade {...TransitionProps} timeout={100}>
              <Paper elevation={3} sx={{ p: SPACING.toUnits(SPACING.sm), mt: SPACING.toUnits(SPACING.xs) }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
                >
                  {tooltipContent}
                </Typography>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  );
};

export default AnswerBullets;