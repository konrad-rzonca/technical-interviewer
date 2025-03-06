// src/components/VirtualizedQuestionList.js
import React, {memo} from 'react';
import {FixedSizeList as List} from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import QuestionItem from './QuestionItem';
import {scrollbarStyles} from '../utils/styles';
import {SPACING, TYPOGRAPHY} from '../themes/baseTheme';

// Row height for question items (with small margin)
const ITEM_HEIGHT = 48;
// Minimum visible rows before enabling virtualization
const MIN_ROWS_FOR_VIRTUALIZATION = 10;

// Render empty state with optimized performance
const EmptyState = memo(({levelLabel}) => (
    <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          py: SPACING.toUnits(SPACING.sm),
          textAlign: 'center',
          fontSize: TYPOGRAPHY.fontSize.regularText,
        }}
    >
      No {levelLabel.toLowerCase()} questions available
    </Typography>
));

// Row renderer for virtualized list
const QuestionRow = memo(({data, index, style}) => {
  const {
    questions,
    currentQuestion,
    gradesMap,
    onQuestionSelect,
    isSmallScreen,
  } = data;
  const question = questions[index];

  return (
      <div style={{...style, paddingBottom: '8px'}}>
        <QuestionItem
            question={question}
            currentQuestion={currentQuestion}
            gradesMap={gradesMap}
            onQuestionSelect={onQuestionSelect}
            isSmallScreen={isSmallScreen}
        />
      </div>
  );
});

// Virtualized question list component
const VirtualizedQuestionList = ({
  questions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  isSmallScreen,
  levelLabel,
  maxHeight = 400,
}) => {
  // Empty state handling
  if (!questions || questions.length === 0) {
    return <EmptyState levelLabel={levelLabel}/>;
  }

  // Only virtualize if we have more than the minimum number of items
  const shouldVirtualize = questions.length > MIN_ROWS_FOR_VIRTUALIZATION;

  // Itemized list rendering - used for small lists
  const renderStaticList = () => (
      <Box
          sx={{
            maxHeight,
            overflowY: 'auto',
            ...scrollbarStyles,
          }}
      >
        {questions.map((question) => (
            <QuestionItem
                key={question.id}
                question={question}
                currentQuestion={currentQuestion}
                gradesMap={gradesMap}
                onQuestionSelect={onQuestionSelect}
                isSmallScreen={isSmallScreen}
            />
        ))}
      </Box>
  );

  // Create a stable data reference for the virtualized list
  const itemData = {
    questions,
    currentQuestion,
    gradesMap,
    onQuestionSelect,
    isSmallScreen,
  };

  // Virtualized list rendering - used for larger lists
  const renderVirtualizedList = () => (
      <Box
          sx={{
            height: Math.min(questions.length * ITEM_HEIGHT, maxHeight),
            maxHeight,
            width: '100%',
          }}
      >
        <AutoSizer>
          {({height, width}) => (
              <List
                  height={height}
                  width={width}
                  itemCount={questions.length}
                  itemSize={ITEM_HEIGHT}
                  itemData={itemData}
                  overscanCount={5}
                  style={{
                    ...scrollbarStyles,
                    scrollbarWidth: 'thin',
                  }}
              >
                {QuestionRow}
              </List>
          )}
        </AutoSizer>
      </Box>
  );

  return shouldVirtualize ? renderVirtualizedList() : renderStaticList();
};

// Memoize the component with a custom equality check
export default memo(VirtualizedQuestionList, (prevProps, nextProps) => {
  // Different length means different questions
  if (prevProps.questions.length !== nextProps.questions.length) {
    return false;
  }

  // Check if current question changed
  if (prevProps.currentQuestion?.id !== nextProps.currentQuestion?.id) {
    return false;
  }

  // Only check grades that matter for this list's questions
  for (const question of prevProps.questions) {
    if (prevProps.gradesMap[question.id] !== nextProps.gradesMap[question.id]) {
      return false;
    }
  }

  // Check other props
  if (
      prevProps.isSmallScreen !== nextProps.isSmallScreen ||
      prevProps.levelLabel !== nextProps.levelLabel ||
      prevProps.maxHeight !== nextProps.maxHeight
  ) {
    return false;
  }

  return true;
});