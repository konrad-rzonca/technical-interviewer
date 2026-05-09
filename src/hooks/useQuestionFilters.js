import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  categories,
  getFilteredQuestions,
  getQuestionsByCategory,
  getQuestionSets,
  sortQuestionsByOrder,
} from '../data/questionLoader';
import {filterQuestionsBySelectedSets} from '../utils/questionFilters';

export const createInitialSelectedSubcategories = (
    categoryList = categories,
) => {
  const initialSelectedSubcategories = {};

  categoryList.forEach(category => {
    if (category.subcategories?.length > 0) {
      initialSelectedSubcategories[category.id] = {};
      category.subcategories.forEach(subcategory => {
        initialSelectedSubcategories[category.id][subcategory] = true;
      });
    }
  });

  return initialSelectedSubcategories;
};

export const createSelectedSetsState = (sets = []) => {
  const selectedSets = {};

  sets.forEach(set => {
    selectedSets[set.id] = true;
  });

  return selectedSets;
};

export const getQuestionsForFilterState = ({
  selectedCategory,
  selectedSets = {},
  selectedSubcategories = {},
  subcategoryFilter = null,
}) => {
  if (!selectedCategory) {
    return [];
  }

  let baseQuestions;

  if (subcategoryFilter) {
    baseQuestions = getFilteredQuestions(selectedCategory, subcategoryFilter);
  } else if (selectedSubcategories[selectedCategory]) {
    const activeSubcategories = Object.entries(
        selectedSubcategories[selectedCategory],
    ).
        filter(([_, isSelected]) => isSelected).
        map(([subcategory]) => subcategory);

    if (activeSubcategories.length === 0) {
      baseQuestions = [];
    } else {
      baseQuestions = activeSubcategories.flatMap(subcategory =>
          getFilteredQuestions(selectedCategory, subcategory),
      );
      baseQuestions = sortQuestionsByOrder(baseQuestions);
    }
  } else {
    baseQuestions = getQuestionsByCategory(selectedCategory);
  }

  return filterQuestionsBySelectedSets(
      baseQuestions,
      selectedSets,
      getQuestionSets(selectedCategory),
  );
};

export const useQuestionFilters = ({
  selectedCategory,
  onCategorySelect = () => {},
  categoryContextSubcategory = null,
} = {}) => {
  const previousSelectedCategoryRef = useRef(selectedCategory);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSets, setSelectedSets] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState(() =>
      createInitialSelectedSubcategories(),
  );
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);

  const activeCategories = categories;

  const availableSets = useMemo(() => {
    if (!selectedCategory) return [];
    return getQuestionSets(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedSets(createSelectedSetsState(availableSets));
  }, [availableSets]);

  useEffect(() => {
    if (!selectedCategory ||
        previousSelectedCategoryRef.current === selectedCategory) {
      return;
    }

    setExpandedCategory(selectedCategory);
    setSubcategoryFilter(categoryContextSubcategory || null);
    previousSelectedCategoryRef.current = selectedCategory;
  }, [categoryContextSubcategory, selectedCategory]);

  const questions = useMemo(() => getQuestionsForFilterState({
    selectedCategory,
    selectedSets,
    selectedSubcategories,
    subcategoryFilter,
  }), [
    selectedCategory,
    selectedSets,
    selectedSubcategories,
    subcategoryFilter,
  ]);

  const handleCategorySelect = useCallback((
      categoryId,
      explicitExpandedState = null,
  ) => {
    if (categoryId === selectedCategory) {
      setExpandedCategory(
          explicitExpandedState !== null
              ? explicitExpandedState
              : expandedCategory === categoryId
                  ? null
                  : categoryId,
      );
      return false;
    }

    const category = categories.find(c => c.id === categoryId);
    onCategorySelect(categoryId);
    setExpandedCategory(
        explicitExpandedState !== null
            ? explicitExpandedState
            : category && category.subcategories.length > 0
                ? categoryId
                : null,
    );
    setSubcategoryFilter(null);
    return true;
  }, [expandedCategory, onCategorySelect, selectedCategory]);

  const handleSubcategorySelect = useCallback(subcategory => {
    setSubcategoryFilter(currentFilter =>
        currentFilter === subcategory ? null : subcategory,
    );
  }, []);

  const handleSubcategoryToggle = useCallback((categoryId, subcategory) => {
    setSelectedSubcategories(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [subcategory]: !prev[categoryId]?.[subcategory],
      },
    }));
    setSubcategoryFilter(null);
  }, []);

  const handleSetToggle = useCallback(setId => {
    setSelectedSets(prev => ({
      ...prev,
      [setId]: !prev[setId],
    }));
  }, []);

  const handleSelectAllSets = useCallback(() => {
    setSelectedSets(createSelectedSetsState(availableSets));
  }, [availableSets]);

  const handleDeselectAllSets = useCallback(() => {
    const newSelection = {};
    availableSets.forEach(set => {
      newSelection[set.id] = false;
    });
    setSelectedSets(newSelection);
  }, [availableSets]);

  const handleSelectAllSubcategories = useCallback(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newSelection = {};
    category.subcategories.forEach(subcategory => {
      newSelection[subcategory] = true;
    });

    setSelectedSubcategories(prev => ({
      ...prev,
      [categoryId]: newSelection,
    }));
    setSubcategoryFilter(null);
  }, []);

  const handleDeselectAllSubcategories = useCallback(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newSelection = {};
    category.subcategories.forEach(subcategory => {
      newSelection[subcategory] = false;
    });

    setSelectedSubcategories(prev => ({
      ...prev,
      [categoryId]: newSelection,
    }));
    setSubcategoryFilter(null);
  }, []);

  return {
    activeCategories,
    availableSets,
    expandedCategory,
    questions,
    selectedSets,
    selectedSubcategories,
    subcategoryFilter,
    handleCategorySelect,
    handleDeselectAllSets,
    handleDeselectAllSubcategories,
    handleSelectAllSets,
    handleSelectAllSubcategories,
    handleSetToggle,
    handleSubcategorySelect,
    handleSubcategoryToggle,
    setExpandedCategory,
    setSubcategoryFilter,
  };
};

export default useQuestionFilters;
