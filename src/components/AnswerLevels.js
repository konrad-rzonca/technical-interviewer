// src/components/AnswerLevels.js
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

  // Define difficulty level colors
  const getLevelColor = (level) => {
    switch (level) {
      case 1:
        return { color: '#4caf50', text: 'Basic' }; // Green
      case 2:
        return { color: '#ff9800', text: 'Intermediate' }; // Orange
      case 3:
        return { color: '#f44336', text: 'Advanced' }; // Red
      default:
        return { color: '#9e9e9e', text: 'Unknown' }; // Grey
    }
  };

  if (!answerLevels || answerLevels.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No answer levels available for this question.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Click to reveal different levels of answer detail:
      </Typography>
      
      {answerLevels
        .sort((a, b) => a.level - b.level)
        .map((answerLevel) => {
          const levelInfo = getLevelColor(answerLevel.level);
          return (
            <Accordion
              key={answerLevel.level}
              expanded={expanded.includes(answerLevel.level)}
              onChange={() => handleToggle(answerLevel.level)}
              sx={{ 
                mb: 1,
                border: `1px solid ${levelInfo.color}`,
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
                  bgcolor: `${levelInfo.color}20`, // 20% opacity
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={`Level ${answerLevel.level}`}
                    size="small"
                    sx={{ 
                      bgcolor: levelInfo.color,
                      color: 'white',
                      mr: 1,
                    }}
                  />
                  <Typography variant="subtitle1">
                    {levelInfo.text} Answer
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography 
                  variant="body1" 
                  component="div"
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    '& code': {
                      fontFamily: 'monospace',
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                      p: 0.5,
                      borderRadius: 1,
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