// src/components/GradeSelector.js - Refactored
import React from 'react';
import {
  Box,
  Rating,
  Typography,
  Tooltip
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { SPACING, TYPOGRAPHY, COLORS } from '../utils/theme';

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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      mt: SPACING.toUnits(SPACING.sm)
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        mb: SPACING.toUnits(SPACING.sm)
      }}>
        <Rating
          name={`grade-${questionId}`}
          value={currentGrade}
          precision={1}
          onChange={handleGradeChange}
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          size="large"
        />
        <Box sx={{ ml: SPACING.toUnits(SPACING.sm) }}>
          {currentGrade !== 0 ? (
            <Tooltip title={descriptions[currentGrade]} arrow placement="right">
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
              >
                {labels[currentGrade]}
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
            >
              Not rated
            </Typography>
          )}
        </Box>
      </Box>

      {/* Rating guide */}
      <Box sx={{
        mt: SPACING.toUnits(SPACING.sm),
        p: SPACING.toUnits(SPACING.md),
        bgcolor: 'background.paper',
        borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
        width: '100%'
      }}>
        <Typography
          variant="caption"
          component="div"
          sx={{
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            fontSize: TYPOGRAPHY.fontSize.caption
          }}
        >
          Rating Guide:
        </Typography>
        {Object.entries(labels).map(([value, label]) => (
          <Box
            key={value}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt: SPACING.toUnits(SPACING.xs)
            }}
          >
            <Rating
              value={parseInt(value)}
              readOnly
              size="small"
              sx={{ mr: SPACING.toUnits(SPACING.sm) }}
            />
            <Typography
              variant="caption"
              sx={{ fontSize: TYPOGRAPHY.fontSize.caption }}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GradeSelector;