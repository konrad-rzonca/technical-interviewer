import React from 'react';
import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import GlobalSearch, {getHighlightedParts} from '../GlobalSearch';

const renderSearch = (props = {}) => {
  const defaultProps = {
    questions: [],
    categories: [],
    onQuestionSelect: jest.fn(),
    onCategorySelect: jest.fn(),
    gradesMap: {},
    selectedCategory: '',
  };

  return {
    ...render(<GlobalSearch {...defaultProps} {...props}/>),
    props: {...defaultProps, ...props},
  };
};

describe('GlobalSearch', () => {
  test('highlights regex metacharacters as literal text', () => {
    expect(getHighlightedParts('Java (basics)', '(')).toEqual([
      {text: 'Java ', highlighted: false},
      {text: '(', highlighted: true},
      {text: 'basics)', highlighted: false},
    ]);
  });

  test('does not crash for regex metacharacter input', () => {
    renderSearch({
      questions: [
        {
          id: 'question1',
          question: 'What does ( mean in regex?',
          shortTitle: 'Regex ( basics',
          skillLevel: 'basic',
          subcategoryName: 'Regex',
          categoryId: 'engineering',
        },
      ],
    });

    fireEvent.change(screen.getByPlaceholderText(
        'Search questions, categories...',
    ), {target: {value: '('}});

    expect(screen.getByText('Questions')).toBeInTheDocument();
    expect(screen.getByText('Regex')).toBeInTheDocument();
  });

  test('calls category selection when a category result is chosen', () => {
    const onCategorySelect = jest.fn();

    renderSearch({
      categories: [
        {
          id: 'databases',
          name: 'Databases',
          subcategories: ['SQL'],
        },
      ],
      onCategorySelect,
    });

    fireEvent.change(screen.getByPlaceholderText(
        'Search questions, categories...',
    ), {target: {value: 'Data'}});
    fireEvent.click(screen.getByText((_, element) =>
        element.tagName.toLowerCase() === 'p' &&
        element.textContent === 'Databases',
    ));

    expect(onCategorySelect).toHaveBeenCalledWith('databases');
  });
});
