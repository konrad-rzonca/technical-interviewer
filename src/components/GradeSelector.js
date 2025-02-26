// src/components/GradeSelector.js
import React from 'react';
import {
  Box,
  Rating,
  Typography,
  Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const labels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

const descriptions = {
  1: 'Candidate showed little understanding of the concept.',
  2: 'Candidate understood basics but had significant gaps.',
  3: 'Candidate demonstrated solid understanding of core concepts.',
  4: 'Candidate showed strong knowledge with minor gaps.',
  5: 'Candidate demonstrated comprehensive understanding and insights.'
};

const GradeSelector = ({ questionId, currentGrade, onGradeChange }) => {
  const handleGradeChange = (event, newValue) => {
    onGradeChange(questionId, newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Rating
          name={`grade-${questionId}`}
          value={currentGrade}
          precision={1}
          onChange={handleGradeChange}
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          size="large"
        />
        <Box sx={{ ml: 2 }}>
          {currentGrade !== 0 ? (
            <Tooltip title={descriptions[currentGrade]} arrow placement="right">
              <Typography variant="body2" color="text.primary">
                {labels[currentGrade]}
              </Typography>
            </Tooltip>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Not rated
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* Rating guide */}
      <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1, width: '100%' }}>
        <Typography variant="caption" component="div" sx={{ fontWeight: 'bold' }}>
          Rating Guide:
        </Typography>
        {Object.entries(labels).map(([value, label]) => (
          <Box key={value} sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Rating
              value={parseInt(value)}
              readOnly
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="caption">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GradeSelector;