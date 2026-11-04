import {LEVEL_ORDER} from '../utils/answerConstants';
import catalog from './questionCatalog.json';

// Returns a copy sorted by skill level, then by title.
export const sortQuestionsByOrder = (questions) => {
  return [...questions].sort((a, b) => {
    const levelDiff = LEVEL_ORDER[a.skillLevel] - LEVEL_ORDER[b.skillLevel];
    if (levelDiff !== 0) return levelDiff;

    const titleA = a.shortTitle || a.question;
    const titleB = b.shortTitle || b.question;
    return titleA.localeCompare(titleB);
  });
};

// Webpack bundles every JSON file under ./questions/ for this require, listed
// in the catalog or not. A catalog path that matches no file, letter case
// included, builds without error and throws when the app loads.
// src/data/__tests__/questionValidation.test.js catches it, and `prebuild`
// runs that test.
const loadQuestionFile = path => require(`./questions/${path}`);

const questions = catalog.flatMap(category =>
    category.sets.flatMap(set =>
        set.subcategories.flatMap(subcategory =>
            subcategory.files.flatMap(path =>
                loadQuestionFile(path).questions.map(question => ({
                  ...question,
                  categoryId: category.id,
                  subcategoryName: subcategory.name,
                  setId: set.id,
                }))))));

// A category's subcategories in the order its sets first list them
export const categories = catalog.map(({id, name, sets}) => ({
  id,
  name,
  subcategories: [
    ...new Set(sets.flatMap(set => set.subcategories.map(({name}) => name)))],
}));

export const getAllQuestions = () => sortQuestionsByOrder(questions);

export const getQuestionsByCategory = (categoryId) =>
    sortQuestionsByOrder(
        questions.filter(question => question.categoryId === categoryId));

// Each filter that is null matches every question.
export const getFilteredQuestions = (
    categoryId = null, subcategory = null, skillLevel = null) => {
  let filtered = questions;

  if (categoryId) {
    filtered = filtered.filter(q => q.categoryId === categoryId);
  }

  if (subcategory) {
    filtered = filtered.filter(q => q.subcategoryName === subcategory);
  }

  if (skillLevel) {
    filtered = filtered.filter(q => q.skillLevel === skillLevel);
  }

  return sortQuestionsByOrder(filtered);
};

// Returns {id, name} for each of the category's sets, or [] for an unknown id.
export const getQuestionSets = (categoryId) => {
  const category = catalog.find(({id}) => id === categoryId);
  return category ? category.sets.map(({id, name}) => ({id, name})) : [];
};

export const getQuestionById = (id) => {
  return questions.find(question => question.id === id);
};

// Returns the existing related questions, sorted, without the question itself.
export const getRelatedQuestions = (questionId) => {
  const question = getQuestionById(questionId);
  if (!question || !question.relatedQuestions) return [];

  const relatedQs = question.relatedQuestions.map(id => getQuestionById(id)).
      filter(Boolean).
      filter(q => q.id !== questionId);

  return sortQuestionsByOrder(relatedQs);
};

export const getCategoryById = (categoryId) => {
  return categories.find(category => category.id === categoryId);
};

export const getCategoryForQuestion = (question) => {
  if (!question) return null;
  return getCategoryById(question.categoryId);
};
