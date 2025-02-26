// src/components/RelatedQuestions.js
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { getQuestionById } from '../data/questionLoader';

const RelatedQuestions = ({ relatedQuestionIds }) => {
  // Get related question details
  const relatedQuestions = relatedQuestionIds
    .map((id) => getQuestionById(id))
    .filter(Boolean); // Filter out any undefined results

  if (!relatedQuestions || relatedQuestions.length === 0) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <List dense>
        {relatedQuestions.map((question) => (
          <ListItem key={question.id} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={question.question}
              secondary={
                <Box component="span" sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    •
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {question.subcategory}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default RelatedQuestions;