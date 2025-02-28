// src/components/VirtualizedQuestionList.js - Refactored
import React, { useRef, useState, useEffect } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { Box, Typography, useTheme } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';
import QuestionItem from './QuestionItem';
import { getSkillLevelStyles } from '../utils/styleHooks';
import { SPACING, TYPOGRAPHY, LAYOUT } from '../utils/theme';

// Memoized row component for virtualized list
const QuestionRow = React.memo(({ data, index, style }) => {
  const {
    questions,
    currentQuestion,
    gradesMap,
    onQuestionSelect,
    isSmallScreen
  } = data;

  const question = questions[index];

  return (
    <div style={style}>
      <QuestionItem
        question={question}
        currentQuestion={currentQuestion}
        gradesMap={gradesMap}
        onQuestionSelect={onQuestionSelect}
        isSmallScreen={isSmallScreen}
      />
    </div>
  );
}, areEqual);

const VirtualizedQuestionList = ({
  questions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  level,
  isSmallScreen
}) => {
  const theme = useTheme();
  const listRef = useRef(null);

  // State to track if list is empty
  const isEmpty = questions.length === 0;

  // Get style information for this level
  const levelStyles = getSkillLevelStyles(level);

  // Virtualization constants
  const ITEM_HEIGHT = LAYOUT.ITEM_HEIGHT; // Height of each question item 

  // Find the index of the current question
  const currentIndex = currentQuestion
    ? questions.findIndex(q => q.id === currentQuestion.id)
    : -1;

  // Scroll to the current question when it changes
  useEffect(() => {
    if (currentIndex !== -1 && listRef.current) {
      listRef.current.scrollToItem(currentIndex, 'smart');
    }
  }, [currentIndex]);

  // Define labels for different skill levels
  const levelLabels = {
    beginner: "Basic",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };

  if (isEmpty) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          py: SPACING.toUnits(SPACING.sm),
          textAlign: 'center',
          fontSize: TYPOGRAPHY.fontSize.regularText
        }}
      >
        No {levelLabels[level]?.toLowerCase() || 'matching'} questions available
      </Typography>
    );
  }

  return (
    <Box sx={{
      height: '100%',
      minHeight: `${SPACING.toUnits(SPACING.lg) * 8}px`,
      maxHeight: `${SPACING.toUnits(SPACING.xl) * 10}px`,
      flex: 1
    }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={questions.length}
            itemSize={ITEM_HEIGHT}
            itemData={{
              questions,
              currentQuestion,
              gradesMap,
              onQuestionSelect,
              isSmallScreen
            }}
            overscanCount={5} // Render some extra items above and below for smoother scrolling
          >
            {QuestionRow}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};

export default VirtualizedQuestionList;