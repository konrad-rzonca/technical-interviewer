import React from 'react';
import { Box, Typography, Tooltip, Rating } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Memoized component to prevent unnecessary re-renders
const QuestionItem = React.memo(({
  question,
  isAnswered,
  rating,
  isSelected,
  levelColor,
  getBorderOpacity,
  getDotColor,
  onSelect,
  isSmallScreen
}) => {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography sx={{ fontSize: '1rem', mb: 1 }}>
            {question.question}
          </Typography>
          {isAnswered && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rating
                value={rating}
                readOnly
                size="small"
                sx={{ color: '#66bb6a' }}
              />
            </Box>
          )}
        </Box>
      }
      placement="top"
      arrow
    >
      <Box
        onClick={() => onSelect(question)}
        sx={{
          p: 1,
          borderRadius: 1,
          cursor: 'pointer',
          backgroundColor: isSelected
            ? `${levelColor}15`
            : (isAnswered ? 'rgba(102, 187, 106, 0.06)'
              : 'white'),
          border: isSelected
            ? `1px solid ${levelColor}${getBorderOpacity(question.skillLevel)}`
            : (isAnswered ? '1px solid rgba(102, 187, 106, 0.20)'
              : '1px solid #e0e0e0'),
          position: 'relative',
          paddingLeft: '24px',
          paddingRight: isAnswered ? '24px' : '8px',
          '&:hover': {
            backgroundColor: `${levelColor}10`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          },
          minHeight: '36px',
          mb: 0.5,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Skill level indicator dot */}
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: getDotColor(question.skillLevel),
            position: 'absolute',
            left: 8,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />

        {/* Answered indicator */}
        {isAnswered && (
          <Box
            sx={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#66bb6a'
            }}
          >
            <CheckCircleIcon fontSize="small" style={{ fontSize: '14px' }} />
          </Box>
        )}

        <Typography
          variant="body2"
          sx={{
            fontWeight: isSelected ? 500 : 400,
            textAlign: 'left',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: isSmallScreen ? '0.8rem' : '0.875rem',
            paddingRight: '2px'
          }}
        >
          {question.shortTitle || question.question.split(' ').slice(0, 5).join(' ')}
        </Typography>
      </Box>
    </Tooltip>
  );
});

export default QuestionItem;