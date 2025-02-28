// src/components/Notes.js - Refactored
import React from 'react';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';
import { SPACING, TYPOGRAPHY } from '../utils/theme';

const Notes = ({ questionId, notes, onNotesChange }) => {
  // Handle notes change
  const handleChange = (event) => {
    onNotesChange(questionId, event.target.value);
  };

  return (
    <Box sx={{ mt: SPACING.toUnits(SPACING.sm) }}>
      <TextField
        id={`notes-${questionId}`}
        label="Add notes about candidate's response"
        multiline
        rows={8}
        fullWidth
        variant="outlined"
        value={notes}
        onChange={handleChange}
        placeholder="Take notes on the candidate's answer quality, reasoning approach, communication skills, etc."
        sx={{
          '& .MuiInputBase-root': {
            fontSize: TYPOGRAPHY.fontSize.regularText
          }
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mt: SPACING.toUnits(SPACING.sm),
          display: 'block',
          fontSize: TYPOGRAPHY.fontSize.caption
        }}
      >
        Notes are saved automatically and persist throughout the interview session.
      </Typography>
    </Box>
  );
};

export default Notes;