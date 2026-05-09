import React, {useState} from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {ThemeProvider} from '@mui/material';
import PreparationPanel from '../preparation/PreparationPanel';
import {createAppTheme} from '../../themes';
import {
  createInitialSelectedSubcategories,
  createSelectedSetsState,
  getQuestionsForFilterState,
} from '../../hooks/useQuestionFilters';
import {getQuestionSets} from '../../data/questionLoader';
import {
  buildPreparationQueue,
  createEmptyPreparationState,
} from '../../utils/preparationProgress';

const theme = createAppTheme();

const setViewport = (width) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: width,
  });

  window.matchMedia = jest.fn().mockImplementation(query => {
    const minWidth = query.match(/min-width:\s*([0-9.]+)px/);
    const maxWidth = query.match(/max-width:\s*([0-9.]+)px/);
    const matchesMin = !minWidth || width >= Number(minWidth[1]);
    const matchesMax = !maxWidth || width <= Number(maxWidth[1]);

    return {
      matches: matchesMin && matchesMax,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });
};

const getCoreJavaQuestions = () => getQuestionsForFilterState({
  selectedCategory: 'core-java',
  selectedSets: createSelectedSetsState(getQuestionSets('core-java')),
  selectedSubcategories: createInitialSelectedSubcategories(),
});

const getFirstPointTitle = question =>
    question.answerInsights.flatMap(insight => insight.points).
        find(point => point?.title)?.title;

const renderPreparationPanel = () => {
  const Harness = () => {
    const [preparationState, setPreparationState] = useState(() =>
        createEmptyPreparationState());

    return (
        <ThemeProvider theme={theme}>
          <PreparationPanel
              preparationState={preparationState}
              updatePreparationState={updates => setPreparationState(prev => ({
                ...prev,
                ...updates,
              }))}
              onClearPreparationState={() => setPreparationState(
                  createEmptyPreparationState())}
              selectedCategory="core-java"
              onCategorySelect={jest.fn()}
          />
        </ThemeProvider>
    );
  };

  return render(<Harness/>);
};

describe('PreparationPanel', () => {
  beforeEach(() => {
    setViewport(1280);
    window.confirm = jest.fn(() => true);
  });

  test('keeps answer concepts hidden until reveal and gates success outcomes', async () => {
    const [firstQueueItem] = buildPreparationQueue(getCoreJavaQuestions(), {});
    const firstQuestion = firstQueueItem.question;
    const firstPointTitle = getFirstPointTitle(firstQuestion);

    renderPreparationPanel();

    expect(await screen.findByText(firstQuestion.question)).toBeInTheDocument();
    expect(screen.queryByText(firstPointTitle)).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: /success/i})).toBeDisabled();
    expect(screen.getByRole('button', {name: /easy/i})).toBeDisabled();

    fireEvent.click(screen.getByRole('button', {name: /reveal concepts/i}));

    expect(await screen.findByText(firstPointTitle)).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /success/i})).
        not.toBeDisabled();
    expect(screen.getByRole('button', {name: /easy/i})).not.toBeDisabled();
  });

  test('fail records progress and advances to another question without reveal', async () => {
    const [firstQueueItem, secondQueueItem] = buildPreparationQueue(
        getCoreJavaQuestions(),
        {},
    );
    const firstQuestion = firstQueueItem.question;
    const secondQuestion = secondQueueItem.question;

    renderPreparationPanel();

    expect(await screen.findByText(firstQuestion.question)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: /fail/i}));

    await waitFor(() => {
      expect(screen.getByText(secondQuestion.question)).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Failed 1')).toBeInTheDocument();
  });
});
