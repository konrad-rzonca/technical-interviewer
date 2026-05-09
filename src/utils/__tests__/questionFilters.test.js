import {filterQuestionsBySelectedSets} from '../questionFilters';

describe('question set filtering', () => {
  const availableSets = [
    {id: 'set-a'},
    {id: 'set-b'},
  ];

  const questions = [
    {id: 'question-a', setId: 'set-a'},
    {id: 'question-b', setId: 'set-b'},
  ];

  test('defaults to all sets before selection state initializes', () => {
    expect(filterQuestionsBySelectedSets(questions, {}, availableSets)).
        toEqual(questions);
  });

  test('returns only questions from active sets', () => {
    expect(filterQuestionsBySelectedSets(
        questions,
        {'set-a': true, 'set-b': false},
        availableSets,
    )).toEqual([{id: 'question-a', setId: 'set-a'}]);
  });

  test('returns no questions when all sets are deselected', () => {
    expect(filterQuestionsBySelectedSets(
        questions,
        {'set-a': false, 'set-b': false},
        availableSets,
    )).toEqual([]);
  });
});
