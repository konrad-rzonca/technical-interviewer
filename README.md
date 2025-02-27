# Technical Interview Platform

A modern React application for conducting technical interviews with a focus on optimal UX for recruiters and interviewers.

## Project Overview

This platform is designed to help recruiters conduct technical interviews efficiently by providing a structured database of questions organized by category and subcategory. It focuses solely on the interviewer experience and does not handle candidate information.

### Key Features

- **Category Organization**: Questions are hierarchically organized by category and subcategory for easy navigation
- **Question Sets**: Multiple sets of questions contributed by different developers
- **Answer Insights**: Three levels of sophistication for each answer (Basic, Intermediate, Advanced)
- **Interview Tools**: Note-taking and 1-5 rating system per question
- **Learning Mode**: Option to hide answer details until hovered or clicked for self-assessment
- **Related Questions**: Suggested follow-up questions with answered status and category info

## UI Organization

The application follows a three-panel layout for optimal experience:

- **Left Panel**: Categories and subcategories, with collapsible sections and question set selection
- **Middle Panel**: Current question view with answer insights and candidate evaluation
- **Right Panel**: Related questions with answered status and category information

## Category Structure

Questions are organized in a hierarchical structure:

```
├── Core Java
│   ├── Fundamentals
│   ├── Memory Management
│   ├── Collections
│   └── Exceptions
├── Concurrency and Multithreading
├── Software Design
│   ├── Design Patterns
│   ├── Microservices
│   └── REST API
├── Databases
│   ├── SQL
│   ├── NoSQL
│   └── Transactions
├── Frameworks
│   ├── Spring
│   └── Hibernate
├── Data Structures & Algorithms
└── Engineering Practices
    ├── Git
    ├── CI/CD
    └── Testing
```

## Question Sets

Questions are grouped into sets (e.g., "Konrad Basic Set") that can be enabled or disabled. This allows:

- Multiple contributors to add their own question sets
- Selective use of questions from different authors
- Flexible organization of interview sessions

## Answer Insights Structure

Each question includes three levels of answer insights:

1. **Basic**: Fundamental understanding that any candidate should have
2. **Intermediate**: Deeper knowledge expected from experienced developers
3. **Advanced**: Sophisticated understanding showing expert-level knowledge

Each insight category contains multiple points with titles and detailed descriptions.

## Learning Mode

The platform includes a Learning Mode that hides answer details until:
- The mouse hovers over a specific answer point
- A point is clicked (making it persistently visible)

This feature helps interviewers practice or assess their own knowledge of topics before conducting interviews.

## File Structure

```
interview-platform/
├── package.json
├── README.md
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   ├── components/
│   │   ├── InterviewPanel.js
│   │   ├── AnswerLevelHorizontal.js
│   │   └── [other components]
│   ├── data/
│   │   ├── questionLoader.js
│   │   └── questions/
│   │       ├── java/
│   │       │   ├── core-java/
│   │       │   │   ├── fundamentals.json
│   │       │   │   └── memory-management.json
│   │       │   ├── concurrency-multithreading/
│   │       │   │   └── concurrency-basics.json
│   │       │   ├── software-design/
│   │       │   └── [other directories]
│   │       ├── python/            # Future expansion
│   │       └── javascript/        # Future expansion
│   └── styles/
│       └── main.css
```

## Question Format

Questions are stored in JSON files organized by category and subcategory. Each file contains questions for a specific subcategory.

### JSON File Structure

```json
{
  "category": "Core Java",
  "subcategory": "Fundamentals",
  "questions": [
    {
      "id": "java-equals-vs-operator",
      "skillLevel": "beginner",
      "shortTitle": "== vs .equals()",
      "question": "What is the difference between '==' and '.equals()' in Java?",
      "answerInsights": [
        {
          "category": "Basic",
          "points": [
            {
              "title": "Operator vs Method",
              "description": "== is an operator, while .equals() is a method that belongs to the Object class."
            },
            // More points...
          ]
        },
        // Intermediate and Advanced sections...
      ],
      "relatedQuestions": ["java-hashcode", "java-object-class"]
    },
    // More questions...
  ]
}
```

## Key UI Features

### Category Panel

- Expandable subcategories
- Multi-select filtering for subcategories
- Question set selection via dropdown

### Question Navigation

- Horizontal list of questions with skill level indicators
- Current question highlighted
- Previous/next navigation arrows

### Answer Insights

- Color-coded by level (green for basic, amber for intermediate, orange for advanced)
- Click to select important points
- Hover for detailed explanations

### Related Questions

- One-click navigation to related topics
- Visual indication of already answered questions
- Category and subcategory information 

### Candidate Evaluation

- 1-5 star rating system
- Notes section for detailed feedback
- Persistent rating and notes across session

## Technical Details

### State Management

- Question state is managed using React's useState and useEffect
- Category, subcategory, and set selections control question filtering
- Selections, notes, and ratings persist during the session

### Tooltips and Hover Interactions

- Immediate tooltip display/hiding for better UX
- Learning mode with selective visibility of answers
- Subtle visual indicators with semi-transparent styling

## Installation and Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Browser Compatibility

The application is designed to work in modern browsers (Chrome, Firefox, Safari, Edge).

## License
This project is licensed under the MIT License - see the [LICENSE](misc/LICENSE.txt) file for details.