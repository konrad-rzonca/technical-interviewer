export const getActiveSetIds = (selectedSets = {}, availableSets = []) => {
  if (!Array.isArray(availableSets) || availableSets.length === 0) {
    return [];
  }

  const hasInitializedSelection = availableSets.every(set =>
      Object.prototype.hasOwnProperty.call(selectedSets, set.id),
  );

  if (!hasInitializedSelection) {
    return availableSets.map(set => set.id);
  }

  return availableSets.
      filter(set => selectedSets[set.id]).
      map(set => set.id);
};

export const filterQuestionsBySelectedSets = (
    questions = [], selectedSets = {}, availableSets = []) => {
  const activeSetIds = getActiveSetIds(selectedSets, availableSets);

  if (activeSetIds.length === 0) {
    return [];
  }

  const activeSetIdSet = new Set(activeSetIds);
  return questions.filter(question => activeSetIdSet.has(question.setId));
};
