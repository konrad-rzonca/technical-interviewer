import {
  buildPreparationQueue,
  getNextPracticeSequence,
  getQuestionPreparationStatus,
  PREPARATION_OUTCOMES,
  PREPARATION_STATUS,
  recordPreparationOutcome,
} from './preparationProgress';

describe('preparation progress', () => {
  test('easy completes a question immediately without clock time', () => {
    const progressMap = recordPreparationOutcome(
        {},
        'q1',
        PREPARATION_OUTCOMES.EASY,
        {practiceSequence: 1},
    );

    expect(progressMap.q1).toMatchObject({
      attempts: 1,
      successStreak: 3,
      easyCount: 1,
      lastOutcome: PREPARATION_OUTCOMES.EASY,
      lastPracticedSequence: 1,
      completedAtSequence: 1,
      nextReviewSequence: null,
    });
    expect(progressMap.q1.completedAt).toBeUndefined();
    expect(progressMap.q1.nextReviewAt).toBeUndefined();
    expect(getQuestionPreparationStatus(
        'q1',
        progressMap,
        {practiceSequence: 1},
    )).toBe(PREPARATION_STATUS.COMPLETED);
  });

  test('three consecutive successes complete a question after sequence gaps', () => {
    let progressMap = {};

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.SUCCESS,
        {practiceSequence: 1},
    );
    expect(progressMap.q1.successStreak).toBe(1);
    expect(progressMap.q1.completedAtSequence).toBeNull();
    expect(progressMap.q1.nextReviewSequence).toBe(13);

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.SUCCESS,
        {practiceSequence: 13},
    );
    expect(progressMap.q1.successStreak).toBe(2);
    expect(progressMap.q1.completedAtSequence).toBeNull();
    expect(progressMap.q1.nextReviewSequence).toBe(37);

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.SUCCESS,
        {practiceSequence: 37},
    );
    expect(progressMap.q1.successStreak).toBe(3);
    expect(progressMap.q1.completedAtSequence).toBe(37);
    expect(progressMap.q1.nextReviewSequence).toBeNull();
  });

  test('fail resets the success streak and reopens a completed question by sequence', () => {
    let progressMap = recordPreparationOutcome(
        {},
        'q1',
        PREPARATION_OUTCOMES.EASY,
        {practiceSequence: 1},
    );

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.FAIL,
        {practiceSequence: 2},
    );

    expect(progressMap.q1).toMatchObject({
      attempts: 2,
      successStreak: 0,
      failCount: 1,
      lastOutcome: PREPARATION_OUTCOMES.FAIL,
      completedAtSequence: null,
      nextReviewSequence: 10,
    });
    expect(getQuestionPreparationStatus(
        'q1',
        progressMap,
        {practiceSequence: 2},
    )).toBe(PREPARATION_STATUS.FAILED);
  });

  test('skip moves a question to skipped status without completing it', () => {
    const progressMap = recordPreparationOutcome(
        {},
        'q1',
        PREPARATION_OUTCOMES.SKIP,
        {practiceSequence: 3},
    );

    expect(progressMap.q1).toMatchObject({
      attempts: 1,
      skipCount: 1,
      skipped: true,
      successStreak: 0,
      completedAtSequence: null,
      nextReviewSequence: null,
    });
    expect(getQuestionPreparationStatus(
        'q1',
        progressMap,
        {practiceSequence: 3},
    )).toBe(PREPARATION_STATUS.SKIPPED);
  });

  test('queue prioritizes due and unseen questions before ready failed questions', () => {
    const questions = [
      {id: 'unseen', question: 'Unseen'},
      {id: 'completed', question: 'Completed'},
      {id: 'due', question: 'Due'},
      {id: 'failed', question: 'Failed'},
      {id: 'scheduled', question: 'Scheduled'},
    ];
    let progressMap = {};

    progressMap = recordPreparationOutcome(
        progressMap,
        'completed',
        PREPARATION_OUTCOMES.EASY,
        {practiceSequence: 1},
    );
    progressMap = recordPreparationOutcome(
        progressMap,
        'due',
        PREPARATION_OUTCOMES.SUCCESS,
        {practiceSequence: 2},
    );
    progressMap = recordPreparationOutcome(
        progressMap,
        'failed',
        PREPARATION_OUTCOMES.FAIL,
        {practiceSequence: 3},
    );
    progressMap = recordPreparationOutcome(
        progressMap,
        'scheduled',
        PREPARATION_OUTCOMES.SUCCESS,
        {practiceSequence: 30},
    );

    expect(buildPreparationQueue(
        questions,
        progressMap,
        {practiceSequence: 14},
    ).map(item => item.question.id)).toEqual(['due', 'unseen', 'failed']);
  });

  test('queue defers failed questions while other questions are available', () => {
    const questions = [
      {id: 'unseen', question: 'Unseen'},
      {id: 'failed', question: 'Failed'},
    ];
    const progressMap = recordPreparationOutcome(
        {},
        'failed',
        PREPARATION_OUTCOMES.FAIL,
        {practiceSequence: 1},
    );

    expect(buildPreparationQueue(
        questions,
        progressMap,
        {practiceSequence: 1},
    ).map(item => item.question.id)).toEqual(['unseen']);
  });

  test('queue shows deferred failed questions when only failed questions remain', () => {
    const questions = [
      {id: 'failed', question: 'Failed'},
    ];
    const progressMap = recordPreparationOutcome(
        {},
        'failed',
        PREPARATION_OUTCOMES.FAIL,
        {practiceSequence: 1},
    );

    expect(buildPreparationQueue(
        questions,
        progressMap,
        {practiceSequence: 1},
    ).map(item => item.question.id)).toEqual(['failed']);
  });

  test('queue defers skipped questions until only skipped questions remain', () => {
    const questions = [
      {id: 'unseen', question: 'Unseen'},
      {id: 'skipped', question: 'Skipped'},
    ];
    const progressMap = recordPreparationOutcome(
        {},
        'skipped',
        PREPARATION_OUTCOMES.SKIP,
        {practiceSequence: 1},
    );

    expect(buildPreparationQueue(
        questions,
        progressMap,
        {practiceSequence: 1},
    ).map(item => item.question.id)).toEqual(['unseen']);

    expect(buildPreparationQueue(
        [questions[1]],
        progressMap,
        {practiceSequence: 1},
    ).map(item => item.question.id)).toEqual(['skipped']);
  });

  test('next practice sequence increments from preparation state', () => {
    expect(getNextPracticeSequence({practiceSequence: 7})).toBe(8);
  });
});
