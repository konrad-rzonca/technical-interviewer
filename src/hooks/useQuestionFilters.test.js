import {
  createInitialSelectedSubcategories,
  createSelectedSetsState,
  getQuestionsForFilterState,
} from './useQuestionFilters';
import {getQuestionSets} from '../data/questionLoader';

describe('shared question filters', () => {
  test('returns questions for the selected category and selected sets', () => {
    const selectedSubcategories = createInitialSelectedSubcategories();
    const selectedSets = createSelectedSetsState(getQuestionSets('core-java'));

    const questions = getQuestionsForFilterState({
      selectedCategory: 'core-java',
      selectedSets,
      selectedSubcategories,
    });

    expect(questions.length).toBeGreaterThan(0);
    expect(questions.every(question => question.categoryId === 'core-java')).
        toBe(true);
  });

  test('respects deselected question sets', () => {
    const selectedSubcategories = createInitialSelectedSubcategories();
    const selectedSets = Object.fromEntries(
        getQuestionSets('core-java').map(set => [set.id, false]),
    );

    expect(getQuestionsForFilterState({
      selectedCategory: 'core-java',
      selectedSets,
      selectedSubcategories,
    })).toEqual([]);
  });

  test('filters to one explicit subcategory when selected', () => {
    const selectedSubcategories = createInitialSelectedSubcategories();
    const selectedSets = createSelectedSetsState(getQuestionSets('core-java'));

    const questions = getQuestionsForFilterState({
      selectedCategory: 'core-java',
      selectedSets,
      selectedSubcategories,
      subcategoryFilter: 'Collections',
    });

    expect(questions.length).toBeGreaterThan(0);
    expect(questions.every(question =>
        question.subcategoryName === 'Collections')).toBe(true);
  });
});
