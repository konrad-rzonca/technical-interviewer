import React, { useRef, useState, useEffect } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { Box, Typography, Grid, useTheme } from '@mui/material';
import AutoSizer from 'react-virtualized-auto-sizer';
import QuestionItem from './QuestionItem';

// Memoized row component for virtualized list
const QuestionRow = React.memo(({ data, index, style }) => {
  const {
    questions,
    currentQuestion,
    gradesMap,
    onQuestionSelect,
    levelColor,
    getBorderOpacity,
    getDotColor,
    isSmallScreen
  } = data;

  const question = questions[index];
  const isAnswered = gradesMap[question.id] !== undefined;
  const rating = gradesMap[question.id] || 0;
  const isSelected = currentQuestion && currentQuestion.id === question.id;

  return (
    <div style={style}>
      <QuestionItem
        question={question}
        isAnswered={isAnswered}
        rating={rating}
        isSelected={isSelected}
        levelColor={levelColor}
        getBorderOpacity={getBorderOpacity}
        getDotColor={getDotColor}
        onSelect={onQuestionSelect}
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
  levelColor,
  level,
  getBorderOpacity,
  getDotColor,
  isSmallScreen
}) => {
  const theme = useTheme();
  const listRef = useRef(null);

  // State to track if list is empty
  const isEmpty = questions.length === 0;

  // Virtualization constants
  const ITEM_HEIGHT = 44; // Height of each question item (36px + margins)

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
      <Typography variant="body2" sx={{ color: 'text.secondary', py: 1, textAlign: 'center' }}>
        No {levelLabels[level]?.toLowerCase() || 'matching'} questions available
      </Typography>
    );
  }

  return (
    <Box sx={{
      height: '100%',
      minHeight: '150px',
      maxHeight: '400px',
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
              levelColor,
              getBorderOpacity,
              getDotColor,
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