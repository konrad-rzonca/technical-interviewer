import fs from 'fs';
import path from 'path';
import catalog from '../questionCatalog.json';
import {getAllQuestions} from '../questionLoader';
import {ANSWER_LEVELS, SKILL_LEVELS} from '../../utils/answerConstants';

const QUESTIONS_DIR = path.join(process.cwd(), 'src', 'data', 'questions');

const getJsonFiles = (dir = QUESTIONS_DIR) => {
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return getJsonFiles(entryPath);
    }
    return entry.name.endsWith('.json') ? [entryPath] : [];
  });
};

// The path as the catalog writes it. Comparisons with it are case-sensitive,
// because the bundled app looks files up by exact name on every OS.
const toCatalogPath = file =>
    path.relative(QUESTIONS_DIR, file).split(path.sep).join('/');

const findDuplicates = values => [
  ...new Set(values.filter((value, index) => values.indexOf(value) !== index))];

const isBlank = value => typeof value !== 'string' || value.trim() === '';

const normalizeText = value => value.toLowerCase().replace(/\s+/g, ' ').trim();

describe('Question Data Validation', () => {
  let allQuestions;
  let allQuestionIds;

  beforeAll(() => {
    allQuestions = getAllQuestions();
    allQuestionIds = new Set(allQuestions.map(q => q.id));
  });

  test('questions are loaded', () => {
    expect(allQuestions.length).toBeGreaterThan(0);
  });

  test('raw question JSON files are parseable UTF-8 without BOM', () => {
    const issues = [];

    getJsonFiles().forEach(file => {
      const content = fs.readFileSync(file, 'utf8');

      if (content.charCodeAt(0) === 0xFEFF) {
        issues.push(`${toCatalogPath(file)}: starts with a UTF-8 BOM`);
      }

      try {
        JSON.parse(content);
      } catch (error) {
        issues.push(`${toCatalogPath(file)}: ${error.message}`);
      }
    });

    expect(issues).toEqual([]);
  });

  test('the catalog lists every question file once, under a named subcategory',
      () => {
        const issues = [];
        const filesOnDisk = getJsonFiles().map(toCatalogPath);
        const listedFiles = catalog.flatMap(category =>
            category.sets.flatMap(set =>
                set.subcategories.flatMap(subcategory => subcategory.files)));

        filesOnDisk.filter(file => !listedFiles.includes(file)).
            forEach(file => issues.push(`${file}: not in the catalog`));
        listedFiles.filter(file => !filesOnDisk.includes(file)).
            forEach(file => issues.push(`${file}: in the catalog, no such file`));
        findDuplicates(listedFiles).
            forEach(file => issues.push(`${file}: listed more than once`));
        findDuplicates(catalog.map(category => category.id)).
            forEach(id => issues.push(`category id ${id}: used more than once`));
        findDuplicates(catalog.flatMap(
            category => category.sets.map(set => set.id))).
            forEach(id => issues.push(`set id ${id}: used more than once`));

        catalog.forEach(category => {
          if (isBlank(category.id) || isBlank(category.name)) {
            issues.push(`category ${category.id}: needs an id and a name`);
          }
          category.sets.forEach(set => {
            const where = `${category.id} / ${set.id}`;
            if (isBlank(set.id) || isBlank(set.name)) {
              issues.push(`${where}: the set needs an id and a name`);
            }
            findDuplicates(set.subcategories.map(({name}) => name)).
                forEach(name => issues.push(
                    `${where}: subcategory ${name} is listed more than once`));
            set.subcategories.forEach(subcategory => {
              if (isBlank(subcategory.name)) {
                issues.push(`${where}: a subcategory has no name`);
              }
              if (subcategory.files.length === 0) {
                issues.push(`${where} / ${subcategory.name}: lists no files`);
              }
            });
          });
        });

        expect(issues).toEqual([]);
      });

  // Reads the files rather than getAllQuestions(), so it sees exactly what an
  // author wrote.
  test('each question in the files has the required structure', () => {
    const skillLevels = Object.values(SKILL_LEVELS);
    const insightLevels = Object.values(ANSWER_LEVELS);
    const issues = [];

    getJsonFiles().forEach(file => {
      const {questions} = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!Array.isArray(questions)) {
        issues.push(`${toCatalogPath(file)}: questions is not an array`);
        return;
      }

      questions.forEach((question, index) => {
        const where = `${toCatalogPath(file)} ${question.id ?? `#${index}`}`;

        ['id', 'question'].forEach(field => {
          if (isBlank(question[field])) {
            issues.push(`${where}: ${field} is missing or empty`);
          }
        });

        if (!skillLevels.includes(question.skillLevel)) {
          issues.push(`${where}: skillLevel ${question.skillLevel} is not ${
              skillLevels.join(', ')}`);
        }

        const insights = Array.isArray(question.answerInsights)
            ? question.answerInsights
            : [];
        const levels = insights.map(insight => insight?.category);
        if (levels.join() !== insightLevels.join()) {
          issues.push(`${where}: answerInsights levels are [${
              levels.join(', ')}], expected [${insightLevels.join(', ')}]`);
        }

        insights.forEach(insight => {
          const points = insight?.points;
          if (!Array.isArray(points) || points.length < 1 ||
              points.length > 4) {
            issues.push(`${where} ${insight?.category}: needs 1 to 4 points`);
            return;
          }
          points.forEach((point, pointIndex) => {
            ['title', 'description'].forEach(field => {
              if (isBlank(point?.[field])) {
                issues.push(`${where} ${insight.category} point ${
                    pointIndex}: ${field} is missing or empty`);
              }
            });
          });
        });
      });
    });

    expect(issues).toEqual([]);
  });

  test('related questions exist, each once, and not the question itself',
      () => {
        const issues = [];

        allQuestions.forEach(({id, relatedQuestions = []}) => {
          if (!Array.isArray(relatedQuestions)) {
            issues.push(`${id}: relatedQuestions is not a list`);
            return;
          }
          findDuplicates(relatedQuestions).forEach(relatedId =>
              issues.push(`${id}: lists ${relatedId} more than once`));
          if (relatedQuestions.includes(id)) {
            issues.push(`${id}: lists itself`);
          }
          relatedQuestions.filter(relatedId => !allQuestionIds.has(relatedId)).
              forEach(relatedId => issues.push(`${id}: no question ${relatedId}`));
        });

        expect(issues).toEqual([]);
      });

  test('question ids are unique', () => {
    expect(findDuplicates(allQuestions.map(({id}) => id))).toEqual([]);
  });

  test('short titles are unique, ignoring case and spacing', () => {
    const shortTitles = allQuestions.filter(({shortTitle}) => shortTitle).
        map(({shortTitle}) => normalizeText(shortTitle));
    expect(findDuplicates(shortTitles)).toEqual([]);
  });

  test('question texts are unique, ignoring case and spacing', () => {
    const texts = allQuestions.map(({question}) => normalizeText(question));
    expect(findDuplicates(texts)).toEqual([]);
  });
});
