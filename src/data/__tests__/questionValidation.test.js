// src/data/__tests__/questionValidation.test.js
import {getAllQuestions, getQuestionById} from '../questionLoader';
import {ANSWER_LEVELS, SKILL_LEVELS} from '../../utils/answerConstants';

describe('Question Data Validation', () => {
  let allQuestions;
  let allQuestionIds;

  beforeAll(() => {
    allQuestions = getAllQuestions();
    allQuestionIds = new Set(allQuestions.map(q => q.id));

    // Log summary for context
    console.log(
        `Testing ${allQuestions.length} questions across all categories`);
  });

  test('questions are loaded successfully', () => {
    expect(allQuestions).toBeDefined();
    expect(Array.isArray(allQuestions)).toBe(true);
    expect(allQuestions.length).toBeGreaterThan(0);
  });

  test('each question has required structure', () => {
    const requiredFields = [
      'id',
      'skillLevel',
      'question',
      'answerInsights',
      'categoryId',
      'subcategoryName'];
    const issues = [];

    allQuestions.forEach(question => {
      const missingFields = requiredFields.filter(
          field => !question.hasOwnProperty(field));

      if (missingFields.length > 0) {
        issues.push({
          questionId: question.id || 'UNKNOWN',
          issue: 'Missing required fields',
          details: missingFields,
        });
        return; // Skip further checks if required fields are missing
      }

      // Type validation
      if (typeof question.id !== 'string') {
        issues.push({
          questionId: question.id || 'UNKNOWN',
          issue: 'ID is not a string',
        });
      }

      if (typeof question.skillLevel !== 'string') {
        issues.push({
          questionId: question.id,
          issue: 'skillLevel is not a string',
        });
      }

      if (typeof question.question !== 'string') {
        issues.push({
          questionId: question.id,
          issue: 'question is not a string',
        });
      }

      if (!Array.isArray(question.answerInsights)) {
        issues.push({
          questionId: question.id,
          issue: 'answerInsights is not an array',
        });
      }

      // Skill level validation
      const validSkillLevels = Object.values(SKILL_LEVELS);
      if (!validSkillLevels.includes(question.skillLevel)) {
        issues.push({
          questionId: question.id,
          issue: 'Invalid skillLevel',
          details: question.skillLevel,
          validValues: validSkillLevels,
        });
      }

      // Answer insights structure
      const requiredCategories = Object.values(ANSWER_LEVELS);
      const actualCategories = question.answerInsights.map(
          insight => insight.category);

      // Check all three categories exist
      if (question.answerInsights.length !== 3) {
        issues.push({
          questionId: question.id,
          issue: 'Wrong number of answerInsights categories',
          details: `Expected 3, got ${question.answerInsights.length}`,
        });
      }

      // Check for required categories
      requiredCategories.forEach(requiredCategory => {
        if (!actualCategories.includes(requiredCategory)) {
          issues.push({
            questionId: question.id,
            issue: `Missing required answer category: ${requiredCategory}`,
            details: `Found: ${actualCategories.join(', ')}`,
          });
        }
      });

      // Check category order matches ANSWER_LEVELS order
      const isCorrectOrder = requiredCategories.every((category, index) =>
          !question.answerInsights[index] ||
          question.answerInsights[index].category === category,
      );

      if (!isCorrectOrder) {
        issues.push({
          questionId: question.id,
          issue: 'answerInsights categories in wrong order',
          details: `Expected: ${requiredCategories.join(
              ', ')}, Found: ${actualCategories.join(', ')}`,
        });
      }

      // Validate points structure
      question.answerInsights.forEach(insight => {
        if (!insight.points) {
          issues.push({
            questionId: question.id,
            category: insight.category,
            issue: 'Missing points array in answerInsight',
          });
          return;
        }

        if (!Array.isArray(insight.points)) {
          issues.push({
            questionId: question.id,
            category: insight.category,
            issue: 'points is not an array',
          });
          return;
        }

        insight.points.forEach((point, pointIndex) => {
          if (!point.title) {
            issues.push({
              questionId: question.id,
              category: insight.category,
              pointIndex,
              issue: 'Point missing title',
            });
          }

          if (!point.description) {
            issues.push({
              questionId: question.id,
              category: insight.category,
              pointIndex,
              issue: 'Point missing description',
            });
          }
        });
      });
    });

    // Detailed error reporting for failed tests
    if (issues.length > 0) {
      console.error('Question structure issues:',
          JSON.stringify(issues, null, 2));
    }

    expect(issues).toHaveLength(0);
  });

  test('all relatedQuestions references are valid', () => {
    const invalidReferences = [];

    allQuestions.forEach(question => {
      if (question.relatedQuestions &&
          Array.isArray(question.relatedQuestions)) {
        // Check for duplicate references
        const uniqueRelatedIds = new Set(question.relatedQuestions);
        if (uniqueRelatedIds.size !== question.relatedQuestions.length) {
          invalidReferences.push({
            questionId: question.id,
            issue: 'Duplicate related question IDs',
            relatedQuestions: question.relatedQuestions,
            shortTitle: question.shortTitle || 'N/A',
            category: question.categoryId,
            subcategory: question.subcategoryName,
          });
        }

        // Check for self-references
        if (question.relatedQuestions.includes(question.id)) {
          invalidReferences.push({
            questionId: question.id,
            issue: 'Question references itself in relatedQuestions',
            shortTitle: question.shortTitle || 'N/A',
            category: question.categoryId,
            subcategory: question.subcategoryName,
          });
        }

        // Check each reference is valid
        question.relatedQuestions.forEach(relatedId => {
          if (!allQuestionIds.has(relatedId)) {
            invalidReferences.push({
              questionId: question.id,
              issue: 'Invalid related question reference',
              invalidId: relatedId,
              shortTitle: question.shortTitle || 'N/A',
              category: question.categoryId,
              subcategory: question.subcategoryName,
            });
          }
        });
      }
    });

    // Format error information for assertion message
    if (invalidReferences.length > 0) {
      let errorDetails = '\n\nINVALID RELATED QUESTION REFERENCES:\n\n';

      invalidReferences.forEach((ref, idx) => {
        errorDetails += `${idx + 1}. Question ID: ${ref.questionId}\n`;
        errorDetails += `   Short Title: ${ref.shortTitle}\n`;
        errorDetails += `   Category: ${ref.category} / ${ref.subcategory}\n`;
        errorDetails += `   Issue: ${ref.issue}\n`;

        if (ref.invalidId) {
          errorDetails += `   Invalid Reference: ${ref.invalidId}\n`;
        }

        if (ref.relatedQuestions) {
          errorDetails += `   Related Questions: ${ref.relatedQuestions.join(
              ', ')}\n`;
        }

        errorDetails += '\n';
      });

      // First log to console for complete information
      console.error(errorDetails);

      // Then fail the test with the same detailed message
      expect(invalidReferences).toHaveLength(
          0,
          `Found ${invalidReferences.length} invalid related question references:${errorDetails}`,
      );
    } else {
      expect(invalidReferences).toHaveLength(0);
    }
  });

  test('no duplicate question IDs exist', () => {
    const questionIdMap = {};

    // Build a map of all IDs to their questions for detailed reporting
    allQuestions.forEach(question => {
      if (!questionIdMap[question.id]) {
        questionIdMap[question.id] = [];
      }
      questionIdMap[question.id].push({
        shortTitle: question.shortTitle || 'N/A',
        questionText: question.question.substring(0, 50) +
            (question.question.length > 50 ? '...' : ''),
        category: question.categoryId,
        subcategory: question.subcategoryName,
      });
    });

    // Find all duplicate IDs
    const duplicateIds = Object.entries(questionIdMap).
        filter(([_, instances]) => instances.length > 1).
        map(([id, instances]) => ({
          id,
          count: instances.length,
          instances: instances,
        }));

    // Format error information for assertion message
    if (duplicateIds.length > 0) {
      let errorDetails = '\n\nDUPLICATE QUESTION IDs FOUND:\n\n';

      duplicateIds.forEach(dup => {
        errorDetails += `ID "${dup.id}" appears ${dup.count} times:\n`;
        dup.instances.forEach((instance, idx) => {
          errorDetails += `  ${idx + 1}. ${instance.shortTitle}\n`;
          errorDetails += `     Question: ${instance.questionText}\n`;
          errorDetails += `     Category: ${instance.category} / ${instance.subcategory}\n`;
        });
        errorDetails += '\n';
      });

      errorDetails += 'Fix these duplicates by providing unique IDs for each question.\n';

      // First log to console
      console.error(errorDetails);

      // Then fail the test with the same detailed message
      expect(duplicateIds).toHaveLength(
          0,
          `Found ${duplicateIds.length} question IDs with duplicates:${errorDetails}`,
      );
    } else {
      expect(duplicateIds).toHaveLength(0);
    }
  });

  test('all short titles are unique', () => {
    // Only consider questions that have a shortTitle
    const questionsWithShortTitles = allQuestions.filter(q => q.shortTitle);

    // Build a map of short titles to their questions
    const shortTitleMap = {};
    questionsWithShortTitles.forEach(question => {
      if (!shortTitleMap[question.shortTitle]) {
        shortTitleMap[question.shortTitle] = [];
      }
      shortTitleMap[question.shortTitle].push({
        id: question.id,
        questionShortTitle: question.shortTitle,
        category: question.categoryId,
        subcategory: question.subcategoryName,
      });
    });

    // Find all duplicate short titles
    const duplicateShortTitles = Object.entries(shortTitleMap).
        filter(([_, instances]) => instances.length > 1).
        map(([shortTitle, instances]) => ({
          shortTitle,
          count: instances.length,
          instances: instances,
        }));

    // Format error information for assertion message
    if (duplicateShortTitles.length > 0) {
      let errorDetails = '\n\nDUPLICATE SHORT TITLES FOUND:\n\n';

      duplicateShortTitles.forEach(dup => {
        errorDetails += `Short title "${dup.shortTitle}" appears ${dup.count} times:\n`;
        dup.instances.forEach((instance, idx) => {
          errorDetails += `  ${idx + 1}. ID: ${instance.id}\n`;
          errorDetails += `     Question: ${instance.questionText}\n`;
          errorDetails += `     Category: ${instance.category} / ${instance.subcategory}\n`;
        });
        errorDetails += '\n';
      });

      errorDetails += 'Make short titles unique to improve navigation and readability.\n';

      // First log to console
      console.error(errorDetails);

      // Then fail the test with the same detailed message
      expect(duplicateShortTitles).toHaveLength(
          0,
          `Found ${duplicateShortTitles.length} duplicate short titles:${errorDetails}`,
      );
    } else {
      expect(duplicateShortTitles).toHaveLength(0);
    }
  });

  test('consistency between questions and their references', () => {
    // Check that if question A references B, then B should reference A
    const nonMutualReferences = [];

    allQuestions.forEach(questionA => {
      if (questionA.relatedQuestions &&
          Array.isArray(questionA.relatedQuestions)) {
        questionA.relatedQuestions.forEach(relatedId => {
          const questionB = getQuestionById(relatedId);

          if (questionB &&
              (!questionB.relatedQuestions ||
                  !Array.isArray(questionB.relatedQuestions) ||
                  !questionB.relatedQuestions.includes(questionA.id))) {
            nonMutualReferences.push({
              source: questionA.id,
              target: relatedId,
              issue: 'Non-mutual reference',
            });
          }
        });
      }
    });

    // This test is informational rather than a hard requirement
    // We report issues but don't fail the test
    if (nonMutualReferences.length > 0) {
      console.warn(
          'Info: Found non-mutual question references. Consider adding mutual references for better navigation:',
          JSON.stringify(nonMutualReferences, null, 2),
      );
    }

    // Uncomment to enforce mutual references
    // expect(nonMutualReferences).toHaveLength(0);
  });

  test('question IDs follow naming convention', () => {
    // Expected format: technology-short-description-category-subcategory-number
    // e.g. java-concurrent-hashmap-cm-cc-2

    const idPattern = /^[a-z]+-[a-z0-9-]+-[a-z]+-[a-z]+-\d+$/;
    const questionIdsWithInvalidFormat = [];

    allQuestions.forEach(question => {
      if (!idPattern.test(question.id)) {
        questionIdsWithInvalidFormat.push({
          id: question.id,
          shortTitle: question.shortTitle || 'N/A',
          category: question.categoryId,
          subcategory: question.subcategoryName,
        });
      }
    });

    // Only report this as a warning, not a failure, as there might be exceptions
    if (questionIdsWithInvalidFormat.length > 0) {
      console.warn('\nQUESTION IDs NOT FOLLOWING NAMING CONVENTION:');
      console.warn(
          'Expected format: technology-short-description-category-subcategory-number');

      questionIdsWithInvalidFormat.forEach((q, idx) => {
        console.warn(`\n${idx + 1}. ID: ${q.id}`);
        console.warn(`   Short Title: ${q.shortTitle}`);
        console.warn(`   Category: ${q.category} / ${q.subcategory}`);
      });

      console.warn(
          '\nConsider standardizing ID format for better organization.');

      // This test is informational and doesn't fail the suite
      // Uncomment the line below to enforce the naming convention
      // expect(questionIdsWithInvalidFormat).toHaveLength(0);
    }
  });

  test('all questions have valid category and subcategory values', () => {
    // Get unique categories and subcategories from questions
    const categoriesInQuestions = new Set(allQuestions.map(q => q.categoryId));
    const subcategoriesByCategory = {};

    // Build a map of categories to their subcategories
    allQuestions.forEach(question => {
      if (!subcategoriesByCategory[question.categoryId]) {
        subcategoriesByCategory[question.categoryId] = new Set();
      }
      subcategoriesByCategory[question.categoryId].add(
          question.subcategoryName);
    });

    const invalidCategoryQuestions = [];
    const invalidSubcategoryQuestions = [];

    // Check if any questions have missing or undefined categories/subcategories
    allQuestions.forEach(question => {
      // Check for missing or invalid category
      if (!question.categoryId || question.categoryId.trim() === '') {
        invalidCategoryQuestions.push({
          id: question.id,
          shortTitle: question.shortTitle || 'N/A',
          questionText: question.question.substring(0, 50) + '...',
          issue: 'Missing or empty categoryId',
        });
      }

      // Check for missing or invalid subcategory
      if (!question.subcategoryName || question.subcategoryName.trim() === '') {
        invalidSubcategoryQuestions.push({
          id: question.id,
          shortTitle: question.shortTitle || 'N/A',
          categoryId: question.categoryId,
          questionText: question.question.substring(0, 50) + '...',
          issue: 'Missing or empty subcategoryName',
        });
      }
    });

    // Format error information for assertion message
    let errorDetails = '';

    if (invalidCategoryQuestions.length > 0) {
      errorDetails += '\nQUESTIONS WITH INVALID CATEGORIES:\n\n';
      invalidCategoryQuestions.forEach((q, idx) => {
        errorDetails += `${idx + 1}. ID: ${q.id}\n`;
        errorDetails += `   Short Title: ${q.shortTitle}\n`;
        errorDetails += `   Question: ${q.questionText}\n`;
        errorDetails += `   Issue: ${q.issue}\n\n`;
      });
    }

    if (invalidSubcategoryQuestions.length > 0) {
      errorDetails += '\nQUESTIONS WITH INVALID SUBCATEGORIES:\n\n';
      invalidSubcategoryQuestions.forEach((q, idx) => {
        errorDetails += `${idx + 1}. ID: ${q.id}\n`;
        errorDetails += `   Short Title: ${q.shortTitle}\n`;
        errorDetails += `   Category: ${q.categoryId}\n`;
        errorDetails += `   Question: ${q.questionText}\n`;
        errorDetails += `   Issue: ${q.issue}\n\n`;
      });
    }

    // Log to console first
    if (errorDetails) {
      console.error(errorDetails);
    }

    // Check for category issues with detailed message
    expect(invalidCategoryQuestions).toHaveLength(
        0,
        invalidCategoryQuestions.length > 0
            ?
            `Found ${invalidCategoryQuestions.length} questions with invalid categories:${errorDetails}`
            : '',
    );

    // Check for subcategory issues with detailed message
    expect(invalidSubcategoryQuestions).toHaveLength(
        0,
        invalidSubcategoryQuestions.length > 0
            ?
            `Found ${invalidSubcategoryQuestions.length} questions with invalid subcategories:${errorDetails}`
            : '',
    );
  });
});