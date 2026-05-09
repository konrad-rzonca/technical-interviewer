import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '@mui/material';
import InterviewPanel from '../InterviewPanel';
import MainLayout from '../MainLayout';
import {getQuestionsByCategory} from '../../data/questionLoader';
import {createAppTheme} from '../../themes';

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

const renderWithTheme = (ui) => render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>,
);

describe('navigation wiring', () => {
  beforeEach(() => {
    window.ResizeObserver = class ResizeObserver {
      observe() {}

      unobserve() {}

      disconnect() {}
    };
  });

  test('mobile hamburger calls the app-level drawer opener', async () => {
    setViewport(500);
    const onMobileDrawerOpen = jest.fn();

    renderWithTheme(
        <MemoryRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
          <MainLayout
              questions={[]}
              categories={[]}
              gradesMap={{}}
              settings={{
                learningMode: false,
                hideAnsweredQuestions: false,
                hideAnsweredInRelated: false,
              }}
              onSettingChange={jest.fn()}
              onQuestionSelect={jest.fn()}
              onCategorySelect={jest.fn()}
              onClearData={jest.fn()}
              interviewState={{gradesMap: {}}}
              selectedCategory="core-java"
              onMobileDrawerOpen={onMobileDrawerOpen}
          >
            <div/>
          </MainLayout>
        </MemoryRouter>,
    );

    fireEvent.click(await screen.findByLabelText('Open mobile navigation'));

    expect(onMobileDrawerOpen).toHaveBeenCalledTimes(1);
  });

  test('interview panel selects from the app-level category prop', async () => {
    setViewport(1280);
    const updateInterviewState = jest.fn();
    const firstDatabaseQuestion = getQuestionsByCategory('databases')[0];

    renderWithTheme(
        <InterviewPanel
            interviewState={{
              currentQuestion: null,
              notesMap: {},
              gradesMap: {},
              selectedAnswerPointsMap: {},
            }}
            updateInterviewState={updateInterviewState}
            onAnswerPointSelect={jest.fn()}
            settings={{
              learningMode: false,
              hideAnsweredQuestions: false,
              hideAnsweredInRelated: false,
            }}
            onSettingChange={jest.fn()}
            selectedCategory="databases"
            onCategorySelect={jest.fn()}
            mobileDrawerOpen={false}
            onMobileDrawerClose={jest.fn()}
        />,
    );

    await waitFor(() => {
      expect(updateInterviewState).toHaveBeenCalledWith({
        currentQuestion: firstDatabaseQuestion,
      });
    });
  });
});
