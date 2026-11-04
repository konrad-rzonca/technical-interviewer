# Technical Interview Platform

A web app for running a technical interview for a Java developer role. You pick questions by category and skill level, see what a good answer covers, rate each answer from 1 to 5, take notes, and export a summary at the end. The Prepare page lets you study the same questions on your own.

What you enter stays in your browser's local storage and is never sent anywhere.

## Features

- **Questions by category and level.** Each question is Basic, Intermediate or Advanced. Filter by category, subcategory and question set in the left sidebar, or, on a wide screen, search every question from the top bar.
- **Answer insights.** Each question lists the points a candidate may raise, at three depths: Basic, Intermediate and Advanced. Hover a point to read its explanation. Click a point to mark that the candidate covered it.
- **Rating and notes.** Rate each answer from 1 to 5 and write notes on it. The question list and the related questions show which questions you have rated.
- **Related questions.** The right sidebar suggests follow-up questions.
- **Export.** Export the interview as an HTML or PDF summary with the candidate's name, your ratings, notes, marked points and your recommendation. Before the next candidate, clear the data with Clear All Interview Data in the top bar.
- **Settings.** Learning Mode hides each point's title until you click it, so you can test yourself. Other settings hide rated questions from the question list or from the related questions.
- **Prepare.** Go through the questions one at a time: answer in your head, reveal the concepts, then mark how you did. The page tracks your progress on each question and brings back the ones that are due.
- **Best Practices.** Guidance on running a technical interview.

## Run It

You need Node.js 20 or later.

```bash
npm install
npm start
```

The app opens at `http://localhost:3000/technical-interviewer`.

`npm run build` runs the question data tests, then writes the production site to `build/`. Serve it under `/technical-interviewer/`.

## Add Questions

Questions are JSON files under `src/data/questions/java/`, grouped by category. A file shows up in the app once `src/data/questionCatalog.json` lists it. Add its path, relative to `src/data/questions/`, to its subcategory's `files`, or add a subcategory with a `name` and `files`. The app shows subcategories in catalog order. The `category` and `subcategory` fields at the top of a question file are labels for the reader and do not decide where it appears.

### File Format

```json
{
  "category": "Core Java",
  "subcategory": "Fundamentals",
  "questions": [
    {
      "id": "java-integer-caching",
      "skillLevel": "intermediate",
      "shortTitle": "Integer Caching",
      "question": "Why can == return true for two Integer objects holding 100, but false for two holding 1000?",
      "answerInsights": [
        {
          "category": "Basic",
          "points": [
            {
              "title": "Reference Comparison",
              "description": "`==` on two **Integer** objects compares references, not values. Use `equals()` to compare values."
            }
          ]
        },
        {
          "category": "Intermediate",
          "points": [
            {
              "title": "The Cache",
              "description": "Autoboxing calls `Integer.valueOf()`, which returns a cached object for values from -128 to 127. Larger values get a new object each time."
            }
          ]
        },
        {
          "category": "Advanced",
          "points": [
            {
              "title": "Tuning the Cache",
              "description": "The JVM option `-XX:AutoBoxCacheMax` raises the upper bound of the cache."
            }
          ]
        }
      ],
      "relatedQuestions": ["java-autoboxing-unboxing-core-java-f-17"]
    }
  ]
}
```

- `skillLevel` is `basic`, `intermediate` or `advanced`.
- `answerInsights` has exactly three entries, `Basic`, `Intermediate` and `Advanced`, in that order, each with one to four points. Every point needs a `title` and a `description`.
- `id`, `shortTitle` and `question` must be unique across all questions. `shortTitle` and `question` are compared ignoring case. `shortTitle` is the label in the question list.
- `relatedQuestions` lists the ids of other existing questions, each once.
- The catalog lists every question file exactly once, and each subcategory once per set.

Run the tests to check these rules:

```bash
npm test -- --watchAll=false
```

### Writing Questions

- Ask about one concept per question. Fold closely related topics into its answer insights instead of writing separate questions.
- Set the skill level by how hard and how widely known the concept is: everyday, essential concepts are basic, harder or more specialized ones are advanced.
- Phrase questions the way you would ask them aloud, and vary the openings ("Can you explain...", "In your experience...", "How would you..."). No more than three questions in a row should start the same way.
- Make the insights a guide for the follow-up discussion, and link related questions. When a point is not obvious, explain it in detail, with an example where one helps.
- Keep questions and insights clear and short, focused on key concepts and practical problem-solving.
- In descriptions, `\n` starts a new line, single backticks mark inline code, double asterisks mark bold, and triple backticks open a code block. Put the language, such as `java`, right after the opening backticks to highlight the code.

## License

MIT. See [LICENSE](misc/LICENSE.txt).
