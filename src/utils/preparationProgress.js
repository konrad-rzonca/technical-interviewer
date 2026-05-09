export const PREPARATION_OUTCOMES = {
  FAIL: 'fail',
  SUCCESS: 'success',
  EASY: 'easy',
  SKIP: 'skip',
};

export const PREPARATION_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  DUE: 'due',
  IN_PROGRESS: 'in-progress',
  SKIPPED: 'skipped',
  UNSEEN: 'unseen',
};

const SUCCESS_REVIEW_GAPS = {
  1: 12,
  2: 24,
};

const FAILED_RETRY_GAP = 8;

export const createEmptyPreparationState = () => ({
  progressMap: {},
  practiceSequence: 0,
});

export const createEmptyProgressRecord = () => ({
  attempts: 0,
  successStreak: 0,
  failCount: 0,
  successCount: 0,
  easyCount: 0,
  skipCount: 0,
  lastOutcome: null,
  lastPracticedSequence: null,
  nextReviewSequence: null,
  completedAtSequence: null,
  skipped: false,
});

const toNumberOrNull = value => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

export const normalizeProgressRecord = (record = {}) => ({
  ...createEmptyProgressRecord(),
  ...record,
  attempts: Number(record.attempts || 0),
  successStreak: Number(record.successStreak || 0),
  failCount: Number(record.failCount || 0),
  successCount: Number(record.successCount || 0),
  easyCount: Number(record.easyCount || 0),
  skipCount: Number(record.skipCount || 0),
  lastPracticedSequence: toNumberOrNull(record.lastPracticedSequence),
  nextReviewSequence: toNumberOrNull(record.nextReviewSequence),
  completedAtSequence: toNumberOrNull(record.completedAtSequence),
  skipped: Boolean(record.skipped),
});

export const getNextPracticeSequence = (preparationState = {}) =>
    Number(preparationState.practiceSequence || 0) + 1;

const getPracticeSequence = (options = {}) =>
    Number(options.practiceSequence || 0);

export const recordPreparationOutcome = (
    progressMap = {},
    questionId,
    outcome,
    options = {},
) => {
  if (!questionId) {
    return progressMap;
  }

  const practiceSequence = getPracticeSequence(options);
  const previous = normalizeProgressRecord(progressMap[questionId]);
  const nextRecord = {
    ...previous,
    attempts: previous.attempts + 1,
    lastOutcome: outcome,
    lastPracticedSequence: practiceSequence,
    skipped: false,
  };

  if (outcome === PREPARATION_OUTCOMES.EASY) {
    nextRecord.easyCount = previous.easyCount + 1;
    nextRecord.successStreak = Math.max(previous.successStreak, 3);
    nextRecord.completedAtSequence = practiceSequence;
    nextRecord.nextReviewSequence = null;
  } else if (outcome === PREPARATION_OUTCOMES.SUCCESS) {
    const successStreak = previous.successStreak + 1;

    nextRecord.successCount = previous.successCount + 1;
    nextRecord.successStreak = successStreak;
    nextRecord.completedAtSequence = successStreak >= 3
        ? practiceSequence
        : null;
    nextRecord.nextReviewSequence = successStreak >= 3
        ? null
        : practiceSequence + (SUCCESS_REVIEW_GAPS[successStreak] || 24);
  } else if (outcome === PREPARATION_OUTCOMES.FAIL) {
    nextRecord.failCount = previous.failCount + 1;
    nextRecord.successStreak = 0;
    nextRecord.completedAtSequence = null;
    nextRecord.nextReviewSequence = practiceSequence +
        (options.failedRetryGap || FAILED_RETRY_GAP);
  } else if (outcome === PREPARATION_OUTCOMES.SKIP) {
    nextRecord.skipCount = previous.skipCount + 1;
    nextRecord.successStreak = 0;
    nextRecord.completedAtSequence = null;
    nextRecord.nextReviewSequence = null;
    nextRecord.skipped = true;
  } else {
    return progressMap;
  }

  return {
    ...progressMap,
    [questionId]: nextRecord,
  };
};

export const getQuestionPreparationStatus = (
    questionId,
    progressMap = {},
    options = {},
) => {
  const practiceSequence = getPracticeSequence(options);
  const record = normalizeProgressRecord(progressMap[questionId]);

  if (record.completedAtSequence) {
    return PREPARATION_STATUS.COMPLETED;
  }

  if (record.skipped || record.lastOutcome === PREPARATION_OUTCOMES.SKIP) {
    return PREPARATION_STATUS.SKIPPED;
  }

  if (!record.attempts) {
    return PREPARATION_STATUS.UNSEEN;
  }

  if (record.lastOutcome === PREPARATION_OUTCOMES.FAIL) {
    return PREPARATION_STATUS.FAILED;
  }

  if (record.nextReviewSequence &&
      record.nextReviewSequence <= practiceSequence) {
    return PREPARATION_STATUS.DUE;
  }

  return PREPARATION_STATUS.IN_PROGRESS;
};

export const getPreparationStats = (
    questions = [],
    progressMap = {},
    options = {},
) => {
  const initialStats = {
    total: questions.length,
    completed: 0,
    failed: 0,
    due: 0,
    inProgress: 0,
    skipped: 0,
    unseen: 0,
  };

  return questions.reduce((stats, question) => {
    const status = getQuestionPreparationStatus(
        question.id,
        progressMap,
        options,
    );

    if (status === PREPARATION_STATUS.COMPLETED) {
      stats.completed += 1;
    } else if (status === PREPARATION_STATUS.FAILED) {
      stats.failed += 1;
    } else if (status === PREPARATION_STATUS.DUE) {
      stats.due += 1;
    } else if (status === PREPARATION_STATUS.IN_PROGRESS) {
      stats.inProgress += 1;
    } else if (status === PREPARATION_STATUS.SKIPPED) {
      stats.skipped += 1;
    } else {
      stats.unseen += 1;
    }

    return stats;
  }, initialStats);
};

const STATUS_PRIORITY = {
  [PREPARATION_STATUS.DUE]: 0,
  [PREPARATION_STATUS.UNSEEN]: 1,
  [PREPARATION_STATUS.FAILED]: 2,
  [PREPARATION_STATUS.IN_PROGRESS]: 3,
  [PREPARATION_STATUS.SKIPPED]: 4,
  [PREPARATION_STATUS.COMPLETED]: 5,
};

const isFailedQuestionReady = (item, progressMap, options = {}) => {
  if (item.status !== PREPARATION_STATUS.FAILED) {
    return true;
  }

  const practiceSequence = getPracticeSequence(options);
  const nextReviewSequence = normalizeProgressRecord(
      progressMap[item.question.id],
  ).nextReviewSequence;

  return !nextReviewSequence || nextReviewSequence <= practiceSequence;
};

export const buildPreparationQueue = (
    questions = [],
    progressMap = {},
    options = {},
) => {
  const includeScheduled = Boolean(options.includeScheduled);
  const includeCompleted = Boolean(options.includeCompleted);

  const queueItems = questions.
      map(question => ({
        question,
        status: getQuestionPreparationStatus(
            question.id,
            progressMap,
            options,
        ),
      })).
      filter(item => {
        if (!includeCompleted &&
            item.status === PREPARATION_STATUS.COMPLETED) {
          return false;
        }

        if (!includeScheduled &&
            item.status === PREPARATION_STATUS.IN_PROGRESS) {
          return false;
        }

        return true;
      }).
      sort((a, b) => {
        const priorityDiff = STATUS_PRIORITY[a.status] -
            STATUS_PRIORITY[b.status];
        if (priorityDiff !== 0) return priorityDiff;

        const titleA = a.question.shortTitle || a.question.question;
        const titleB = b.question.shortTitle || b.question.question;
        return titleA.localeCompare(titleB);
      });

  const primaryItems = queueItems.filter(item =>
      item.status !== PREPARATION_STATUS.FAILED &&
      item.status !== PREPARATION_STATUS.SKIPPED);
  const failedItems = queueItems.filter(item =>
      item.status === PREPARATION_STATUS.FAILED);
  const readyFailedItems = failedItems.filter(item =>
      isFailedQuestionReady(item, progressMap, options));
  const skippedItems = queueItems.filter(item =>
      item.status === PREPARATION_STATUS.SKIPPED);

  if (primaryItems.length > 0 || readyFailedItems.length > 0) {
    return [
      ...primaryItems,
      ...readyFailedItems,
    ];
  }

  if (failedItems.length > 0) {
    return [
      ...failedItems,
      ...skippedItems,
    ];
  }

  return skippedItems;
};

export const findNextQueueQuestion = (queueItems = [], currentQuestionId) => {
  if (queueItems.length === 0) {
    return null;
  }

  return queueItems.find(item => item.question.id !== currentQuestionId)?.
      question || queueItems[0].question;
};
