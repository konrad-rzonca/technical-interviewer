// src/hooks/useCategoryState.js
import {useCallback, useEffect, useReducer} from 'react';
import {
  categories,
  getFilteredQuestions,
  getQuestionsByCategory,
  getQuestionSets,
  sortQuestionsByOrder,
} from '../data/questionLoader';

// Action types
const ACTIONS = {
  SET_CATEGORY: 'SET_CATEGORY',
  SET_EXPANDED_CATEGORY: 'SET_EXPANDED_CATEGORY',
  SET_SUBCATEGORY_FILTER: 'SET_SUBCATEGORY_FILTER',
  TOGGLE_SUBCATEGORY: 'TOGGLE_SUBCATEGORY',
  SELECT_ALL_SUBCATEGORIES: 'SELECT_ALL_SUBCATEGORIES',
  DESELECT_ALL_SUBCATEGORIES: 'DESELECT_ALL_SUBCATEGORIES',
  SET_AVAILABLE_SETS: 'SET_AVAILABLE_SETS',
  TOGGLE_SET: 'TOGGLE_SET',
  SELECT_ALL_SETS: 'SELECT_ALL_SETS',
  DESELECT_ALL_SETS: 'DESELECT_ALL_SETS',
  SET_FILTERED_QUESTIONS: 'SET_FILTERED_QUESTIONS',
  SET_QUESTIONS: 'SET_QUESTIONS',
  HIDE_ANSWERED_FILTER: 'HIDE_ANSWERED_FILTER',
};

// Initial state
const initialState = {
  activeCategories: categories,
  selectedCategory: '',
  expandedCategory: null,
  subcategoryFilter: null,
  selectedSubcategories: {},
  availableSets: [],
  selectedSets: {},
  questions: [],
  filteredQuestions: [],
};

// Reducer function
function categoryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case ACTIONS.SET_EXPANDED_CATEGORY:
      return {
        ...state,
        expandedCategory: action.payload,
      };

    case ACTIONS.SET_SUBCATEGORY_FILTER:
      return {
        ...state,
        subcategoryFilter: action.payload,
      };

    case ACTIONS.TOGGLE_SUBCATEGORY:
      const {categoryId, subcategory} = action.payload;
      return {
        ...state,
        selectedSubcategories: {
          ...state.selectedSubcategories,
          [categoryId]: {
            ...state.selectedSubcategories[categoryId],
            [subcategory]: !state.selectedSubcategories[categoryId]?.[subcategory],
          },
        },
      };

    case ACTIONS.SELECT_ALL_SUBCATEGORIES: {
      const categoryId = action.payload;
      const category = categories.find(c => c.id === categoryId);
      if (!category) return state;

      const newSubcategories = {...state.selectedSubcategories};
      if (!newSubcategories[categoryId]) {
        newSubcategories[categoryId] = {};
      }

      if (category.subcategories && Array.isArray(category.subcategories)) {
        category.subcategories.forEach(subcategory => {
          newSubcategories[categoryId][subcategory] = true;
        });
      }

      return {
        ...state,
        selectedSubcategories: newSubcategories,
      };
    }

    case ACTIONS.DESELECT_ALL_SUBCATEGORIES: {
      const categoryId = action.payload;
      const category = categories.find(c => c.id === categoryId);
      if (!category) return state;

      const newSubcategories = {...state.selectedSubcategories};
      if (!newSubcategories[categoryId]) {
        newSubcategories[categoryId] = {};
      }

      category.subcategories.forEach(subcategory => {
        newSubcategories[categoryId][subcategory] = false;
      });

      return {
        ...state,
        selectedSubcategories: newSubcategories,
      };
    }

    case ACTIONS.SET_AVAILABLE_SETS:
      return {
        ...state,
        availableSets: action.payload,
      };

    case ACTIONS.TOGGLE_SET:
      return {
        ...state,
        selectedSets: {
          ...state.selectedSets,
          [action.payload]: !state.selectedSets[action.payload],
        },
      };

    case ACTIONS.SELECT_ALL_SETS: {
      const newSets = {};
      state.availableSets.forEach(set => {
        newSets[set.id] = true;
      });

      return {
        ...state,
        selectedSets: {
          ...state.selectedSets,
          ...newSets,
        },
      };
    }

    case ACTIONS.DESELECT_ALL_SETS: {
      const newSets = {};
      state.availableSets.forEach(set => {
        newSets[set.id] = false;
      });

      return {
        ...state,
        selectedSets: {
          ...state.selectedSets,
          ...newSets,
        },
      };
    }

    case ACTIONS.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
      };

    case ACTIONS.SET_FILTERED_QUESTIONS:
      return {
        ...state,
        filteredQuestions: action.payload,
      };

    case ACTIONS.HIDE_ANSWERED_FILTER: {
      const {
        questions,
        hideAnswered,
        gradesMap,
        updateCurrentQuestion,
      } = action.payload;

      if (!hideAnswered) {
        return {
          ...state,
          filteredQuestions: questions,
        };
      }

      const filtered = questions.filter(question => !gradesMap[question.id]);

      if (updateCurrentQuestion) {
        updateCurrentQuestion(filtered);
      }

      return {
        ...state,
        filteredQuestions: filtered,
      };
    }

    default:
      return state;
  }
}

/**
 * Custom hook for managing category and question state
 * Handles selection, filtering, and question loading
 */
export function useCategoryState(interviewState, updateInterviewState) {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  // Initialize subcategory selection and category
  useEffect(() => {
    if (categories.length === 0) return;

    const initialSelectedSubcategories = {};

    categories.forEach(category => {
      if (category.subcategories?.length > 0) {
        initialSelectedSubcategories[category.id] = {};
        category.subcategories.forEach(subcategory => {
          initialSelectedSubcategories[category.id][subcategory] = true;
        });
      }
    });

    const defaultCategoryId = categories[0]?.id || '';

    // Set selected subcategories for all categories
    categories.forEach(category => {
      if (category.id) {
        dispatch({
          type: ACTIONS.SELECT_ALL_SUBCATEGORIES,
          payload: category.id,
        });
      }
    });

    // Set initial category
    dispatch({
      type: ACTIONS.SET_CATEGORY,
      payload: defaultCategoryId,
    });

    // Set expanded category
    if (defaultCategoryId && categories[0]?.subcategories?.length > 0) {
      dispatch({
        type: ACTIONS.SET_EXPANDED_CATEGORY,
        payload: defaultCategoryId,
      });
    }
  }, []);

  // Load available question sets whenever selected category changes
  useEffect(() => {
    if (state.selectedCategory) {
      const sets = getQuestionSets(state.selectedCategory);

      dispatch({
        type: ACTIONS.SET_AVAILABLE_SETS,
        payload: sets,
      });

      // Initialize all sets as selected
      const initialSelection = {};
      sets.forEach(set => {
        initialSelection[set.id] = true;
      });

      // Only update if there are new sets
      if (sets.length > 0) {
        dispatch({
          type: ACTIONS.SELECT_ALL_SETS,
        });
      }
    }
  }, [state.selectedCategory]);

  // Load questions based on selected category, subcategories, and sets
  useEffect(() => {
    if (state.selectedCategory) {
      let baseQuestions = [];

      if (state.subcategoryFilter) {
        // Filter by specific subcategory if selected
        baseQuestions = getFilteredQuestions(
            state.selectedCategory,
            state.subcategoryFilter,
        );
      } else if (state.selectedSubcategories[state.selectedCategory]) {
        // Filter by multiple selected subcategories
        const activeSubcategories = Object.entries(
            state.selectedSubcategories[state.selectedCategory],
        ).
            filter(([_, isSelected]) => isSelected).
            map(([subcategory, _]) => subcategory);

        if (activeSubcategories.length > 0) {
          // Get questions from all active subcategories
          baseQuestions = [];
          activeSubcategories.forEach(subcategory => {
            const subcategoryQuestions = getFilteredQuestions(
                state.selectedCategory,
                subcategory,
            );
            baseQuestions.push(...subcategoryQuestions);
          });

          // Sort the combined questions for consistent ordering
          baseQuestions = sortQuestionsByOrder(baseQuestions);
        }
      } else {
        // Get all questions for the category if no subcategory filtering
        baseQuestions = getQuestionsByCategory(state.selectedCategory);
      }

      // If we have questions but no current question selected, select the first one
      if (baseQuestions.length > 0 && !interviewState.currentQuestion) {
        updateInterviewState({currentQuestion: baseQuestions[0]});
      }

      dispatch({
        type: ACTIONS.SET_QUESTIONS,
        payload: baseQuestions,
      });

      dispatch({
        type: ACTIONS.SET_FILTERED_QUESTIONS,
        payload: baseQuestions,
      });
    }
  }, [
    state.selectedCategory,
    state.selectedSets,
    state.selectedSubcategories,
    state.subcategoryFilter,
    interviewState.currentQuestion,
    updateInterviewState,
  ]);

  // Handle category selection - optimized with useCallback
  const handleCategorySelect = useCallback(
      (categoryId, explicitExpandedState = null) => {
        if (categoryId === state.selectedCategory) {
          // Toggle expansion if the category is already selected
          dispatch({
            type: ACTIONS.SET_EXPANDED_CATEGORY,
            payload: explicitExpandedState !== null
                ? explicitExpandedState
                : state.expandedCategory === categoryId
                    ? null
                    : categoryId,
          });
          return;
        }

        dispatch({
          type: ACTIONS.SET_CATEGORY,
          payload: categoryId,
        });

        const category = categories.find(c => c.id === categoryId);

        // If explicitExpandedState is provided, use it, otherwise use default logic
        dispatch({
          type: ACTIONS.SET_EXPANDED_CATEGORY,
          payload: explicitExpandedState !== null
              ? explicitExpandedState
              : category && category.subcategories.length > 0
                  ? categoryId
                  : null,
        });

        dispatch({
          type: ACTIONS.SET_SUBCATEGORY_FILTER,
          payload: null,
        });

        updateInterviewState({currentQuestion: null});
      },
      [state.selectedCategory, state.expandedCategory, updateInterviewState],
  );

  // Subcategory handlers - optimized with useCallback
  const handleSubcategorySelect = useCallback(subcategory => {
    dispatch({
      type: ACTIONS.SET_SUBCATEGORY_FILTER,
      payload: state.subcategoryFilter === subcategory ? null : subcategory,
    });
  }, [state.subcategoryFilter]);

  const handleSubcategoryToggle = useCallback((categoryId, subcategory) => {
    dispatch({
      type: ACTIONS.TOGGLE_SUBCATEGORY,
      payload: {categoryId, subcategory},
    });

    dispatch({
      type: ACTIONS.SET_SUBCATEGORY_FILTER,
      payload: null,
    });
  }, []);

  // Set selection handlers - optimized with useCallback
  const handleSetToggle = useCallback(setId => {
    dispatch({
      type: ACTIONS.TOGGLE_SET,
      payload: setId,
    });
  }, []);

  const handleSelectAllSets = useCallback(() => {
    dispatch({
      type: ACTIONS.SELECT_ALL_SETS,
    });
  }, []);

  const handleDeselectAllSets = useCallback(() => {
    dispatch({
      type: ACTIONS.DESELECT_ALL_SETS,
    });
  }, []);

  // Subcategory selection handlers - optimized with useCallback
  const handleSelectAllSubcategories = useCallback(categoryId => {
    dispatch({
      type: ACTIONS.SELECT_ALL_SUBCATEGORIES,
      payload: categoryId,
    });

    dispatch({
      type: ACTIONS.SET_SUBCATEGORY_FILTER,
      payload: null,
    });
  }, []);

  const handleDeselectAllSubcategories = useCallback(categoryId => {
    dispatch({
      type: ACTIONS.DESELECT_ALL_SUBCATEGORIES,
      payload: categoryId,
    });

    dispatch({
      type: ACTIONS.SET_SUBCATEGORY_FILTER,
      payload: null,
    });
  }, []);

  // Apply hide answered questions filter
  const applyAnsweredFilter = useCallback((hideAnswered, gradesMap) => {
    dispatch({
      type: ACTIONS.HIDE_ANSWERED_FILTER,
      payload: {
        questions: state.questions,
        hideAnswered,
        gradesMap,
        updateCurrentQuestion: (filtered) => {
          // If current question is filtered out, select first visible question
          if (
              filtered.length > 0 &&
              interviewState.currentQuestion &&
              gradesMap[interviewState.currentQuestion.id]
          ) {
            updateInterviewState({currentQuestion: filtered[0]});
          }
        },
      },
    });
  }, [state.questions, interviewState.currentQuestion, updateInterviewState]);

  return {
    // State
    activeCategories: state.activeCategories,
    selectedCategory: state.selectedCategory,
    expandedCategory: state.expandedCategory,
    subcategoryFilter: state.subcategoryFilter,
    selectedSubcategories: state.selectedSubcategories,
    availableSets: state.availableSets,
    selectedSets: state.selectedSets,
    questions: state.questions,
    filteredQuestions: state.filteredQuestions,

    // Actions
    handleCategorySelect,
    handleSubcategorySelect,
    handleSubcategoryToggle,
    handleSelectAllSubcategories,
    handleDeselectAllSubcategories,
    handleSetToggle,
    handleSelectAllSets,
    handleDeselectAllSets,
    applyAnsweredFilter,
  };
}