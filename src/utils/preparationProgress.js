export const PREPARATION_OUTCOMES = {
  FAIL: 'fail',
  SUCCESS: 'success',
  EASY: 'easy',
};

export const PREPARATION_STATUS = {
  COMPLETED: 'completed',
  FAILED: 'failed',
  DUE: 'due',
  IN_PROGRESS: 'in-progress',
  UNSEEN: 'unseen',
};

const SUCCESS_REVIEW_DELAYS = {
  1: 1,
  2: 3,
};

export const createEmptyPreparationState = () => ({
  progressMap: {},
});

export const createEmptyProgressRecord = () => ({
  attempts: 0,
  successStreak: 0,
  failCount: 0,
  successCount: 0,
  easyCount: 0,
  lastOutcome: null,
  lastPracticedAt: null,
  nextReviewAt: null,
  completedAt: null,
});

export const normalizeProgressRecord = (record = {}) => ({
  ...createEmptyProgressRecord(),
  ...record,
  attempts: Number(record.attempts || 0),
  successStreak: Number(record.successStreak || 0),
  failCount: Number(record.failCount || 0),
  successCount: Number(record.successCount || 0),
  easyCount: Number(record.easyCount || 0),
});

export const addDays = (date, dayCount) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + dayCount);
  return nextDate;
};

const toDate = value => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const recordPreparationOutcome = (
    progressMap = {},
    questionId,
    outcome,
    options = {},
) => {
  if (!questionId) {
    return progressMap;
  }

  const now = toDate(options.now) || new Date();
  const timestamp = now.toISOString();
  const previous = normalizeProgressRecord(progressMap[questionId]);
  const nextRecord = {
    ...previous,
    attempts: previous.attempts + 1,
    lastOutcome: outcome,
    lastPracticedAt: timestamp,
  };

  if (outcome === PREPARATION_OUTCOMES.EASY) {
    nextRecord.easyCount = previous.easyCount + 1;
    nextRecord.successStreak = Math.max(previous.successStreak, 3);
    nextRecord.completedAt = timestamp;
    nextRecord.nextReviewAt = null;
  } else if (outcome === PREPARATION_OUTCOMES.SUCCESS) {
    const successStreak = previous.successStreak + 1;

    nextRecord.successCount = previous.successCount + 1;
    nextRecord.successStreak = successStreak;
    nextRecord.completedAt = successStreak >= 3 ? timestamp : null;
    nextRecord.nextReviewAt = successStreak >= 3
        ? null
        : addDays(now, SUCCESS_REVIEW_DELAYS[successStreak] || 3).
            toISOString();
  } else if (outcome === PREPARATION_OUTCOMES.FAIL) {
    nextRecord.failCount = previous.failCount + 1;
    nextRecord.successStreak = 0;
    nextRecord.completedAt = null;
    nextRecord.nextReviewAt = timestamp;
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
  const now = toDate(options.now) || new Date();
  const record = normalizeProgressRecord(progressMap[questionId]);

  if (record.completedAt) {
    return PREPARATION_STATUS.COMPLETED;
  }

  if (!record.attempts) {
    return PREPARATION_STATUS.UNSEEN;
  }

  if (record.lastOutcome === PREPARATION_OUTCOMES.FAIL) {
    return PREPARATION_STATUS.FAILED;
  }

  const nextReviewAt = toDate(record.nextReviewAt);
  if (nextReviewAt && nextReviewAt <= now) {
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
    } else {
      stats.unseen += 1;
    }

    return stats;
  }, initialStats);
};

const STATUS_PRIORITY = {
  [PREPARATION_STATUS.FAILED]: 0,
  [PREPARATION_STATUS.DUE]: 1,
  [PREPARATION_STATUS.UNSEEN]: 2,
  [PREPARATION_STATUS.IN_PROGRESS]: 3,
  [PREPARATION_STATUS.COMPLETED]: 4,
};

export const buildPreparationQueue = (
    questions = [],
    progressMap = {},
    options = {},
) => {
  const includeScheduled = Boolean(options.includeScheduled);
  const includeCompleted = Boolean(options.includeCompleted);

  return questions.
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
};

export const findNextQueueQuestion = (queueItems = [], currentQuestionId) => {
  if (queueItems.length === 0) {
    return null;
  }

  return queueItems.find(item => item.question.id !== currentQuestionId)?.
      question || queueItems[0].question;
};
