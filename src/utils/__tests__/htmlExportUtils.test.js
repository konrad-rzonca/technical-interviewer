import {
  createFilenameSlug,
  exportInterviewData,
} from '../htmlExportUtils';

describe('html export utilities', () => {
  test('escapes exported user and question content while preserving newlines', async () => {
    const html = await exportInterviewData(
        {
          notesMap: {
            question1: '<b>strong note</b>\nsecond line',
          },
          gradesMap: {},
          selectedAnswerPointsMap: {
            question1: {'0-0': true},
          },
        },
        [
          {
            id: 'question1',
            question: 'Question with <script>alert(1)</script>',
            skillLevel: 'basic',
            categoryId: 'custom-<category>',
            subcategoryName: 'Sub <One>',
            answerInsights: [
              {
                category: 'Basic',
                points: [
                  {
                    title: '<img src=x onerror=alert(1)>',
                    description: '',
                  },
                ],
              },
            ],
          },
        ],
        {
          candidateName: 'Ada <Lovelace>',
          comments: 'Great <candidate>\nHire',
        },
        {generateHtmlOnly: true},
    );

    expect(html).toContain('Ada &lt;Lovelace&gt;');
    expect(html).toContain('Great &lt;candidate&gt;<br>Hire');
    expect(html).toContain(
        'Question with &lt;script&gt;alert(1)&lt;/script&gt;',
    );
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('&lt;b&gt;strong note&lt;/b&gt;<br>second line');
    expect(html).toContain('Sub &lt;One&gt;');
    expect(html).not.toContain('Ada <Lovelace>');
    expect(html).not.toContain('<b>strong note</b>');
  });

  test('creates safe filename slugs', () => {
    expect(createFilenameSlug('Ada <Lovelace> / Senior')).toBe(
        'ada-lovelace-senior',
    );
  });
});
