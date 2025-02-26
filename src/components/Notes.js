// src/components/Notes.js
import React from 'react';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';

const Notes = ({ questionId, notes, onNotesChange }) => {
  // Handle notes change
  const handleChange = (event) => {
    onNotesChange(questionId, event.target.value);
  };

  return (
    <Box sx={{ mt: 1 }}>
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
      />
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Notes are saved automatically and persist throughout the interview session.
      </Typography>
    </Box>
  );
};

export default Notes;