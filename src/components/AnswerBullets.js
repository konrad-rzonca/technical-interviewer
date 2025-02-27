// src/components/AnswerBullets.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Popper,
  Fade,
  ClickAwayListener
} from '@mui/material';

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
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500, color: 'text.secondary' }}>
        Answer Key Points
      </Typography>

      <Box className="answer-bullets">
        {allBulletPoints.map((point, index) => (
          <Box
            key={index}
            className={`answer-bullet ${selectedBullets.includes(index) ? 'selected' : ''}`}
            onClick={() => handleBulletClick(index)}
            onMouseEnter={(e) => handleBulletHover(e, point)}
            onMouseLeave={handleBulletLeave}
            onTouchStart={(e) => handleMobileBulletClick(e, point)}
            sx={{
              fontSize: '0.85rem',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: selectedBullets.includes(index) ? 'rgba(33, 150, 243, 0.08)' : '#f5f5f5',
              border: selectedBullets.includes(index) ? '1px solid rgba(33, 150, 243, 0.2)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
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
              <Paper elevation={3} sx={{ p: 2, mt: 0.5 }}>
                <Typography variant="body2">{tooltipContent}</Typography>
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  );
};

export default AnswerBullets;