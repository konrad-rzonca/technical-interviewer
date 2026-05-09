import {
  buildPreparationQueue,
  getQuestionPreparationStatus,
  PREPARATION_OUTCOMES,
  PREPARATION_STATUS,
  recordPreparationOutcome,
} from './preparationProgress';

const NOW = new Date('2026-05-09T12:00:00.000Z');

describe('preparation progress', () => {
  test('easy completes a question immediately', () => {
    const progressMap = recordPreparationOutcome(
        {},
        'q1',
        PREPARATION_OUTCOMES.EASY,
        {now: NOW},
    );

    expect(progressMap.q1).toMatchObject({
      attempts: 1,
      successStreak: 3,
      easyCount: 1,
      lastOutcome: PREPARATION_OUTCOMES.EASY,
      completedAt: NOW.toISOString(),
      nextReviewAt: null,
    });
    expect(getQuestionPreparationStatus('q1', progressMap, {now: NOW})).
        toBe(PREPARATION_STATUS.COMPLETED);
  });

  test('three consecutive successes complete a question', () => {
    let progressMap = {};

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.SUCCESS,
        {now: NOW},
    );
    expect(progressMap.q1.successStreak).toBe(1);
    expect(progressMap.q1.completedAt).toBeNull();
    expect(progressMap.q1.nextReviewAt).toBe(
        '2026-05-10T12:00:00.000Z',
    );

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.SUCCESS,
        {now: new Date('2026-05-10T12:00:00.000Z')},
    );
    expect(progressMap.q1.successStreak).toBe(2);
    expect(progressMap.q1.completedAt).toBeNull();
    expect(progressMap.q1.nextReviewAt).toBe(
        '2026-05-13T12:00:00.000Z',
    );

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.SUCCESS,
        {now: new Date('2026-05-13T12:00:00.000Z')},
    );
    expect(progressMap.q1.successStreak).toBe(3);
    expect(progressMap.q1.completedAt).toBe('2026-05-13T12:00:00.000Z');
    expect(progressMap.q1.nextReviewAt).toBeNull();
  });

  test('fail resets the success streak and reopens a completed question', () => {
    let progressMap = recordPreparationOutcome(
        {},
        'q1',
        PREPARATION_OUTCOMES.EASY,
        {now: NOW},
    );

    progressMap = recordPreparationOutcome(
        progressMap,
        'q1',
        PREPARATION_OUTCOMES.FAIL,
        {now: new Date('2026-05-10T12:00:00.000Z')},
    );

    expect(progressMap.q1).toMatchObject({
      attempts: 2,
      successStreak: 0,
      failCount: 1,
      lastOutcome: PREPARATION_OUTCOMES.FAIL,
      completedAt: null,
      nextReviewAt: '2026-05-10T12:00:00.000Z',
    });
    expect(getQuestionPreparationStatus('q1', progressMap, {now: NOW})).
        toBe(PREPARATION_STATUS.FAILED);
  });

  test('queue prioritizes failed, due, and unseen questions and excludes completed questions', () => {
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
        {now: NOW},
    );
    progressMap = recordPreparationOutcome(
        progressMap,
        'due',
        PREPARATION_OUTCOMES.SUCCESS,
        {now: new Date('2026-05-08T12:00:00.000Z')},
    );
    progressMap = recordPreparationOutcome(
        progressMap,
        'failed',
        PREPARATION_OUTCOMES.FAIL,
        {now: NOW},
    );
    progressMap = recordPreparationOutcome(
        progressMap,
        'scheduled',
        PREPARATION_OUTCOMES.SUCCESS,
        {now: NOW},
    );

    expect(buildPreparationQueue(questions, progressMap, {now: NOW}).map(
        item => item.question.id,
    )).toEqual(['failed', 'due', 'unseen']);
  });
});
