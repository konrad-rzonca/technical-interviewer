// src/components/QuestionBrowser.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Chip,
  ListItemIcon,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Badge
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import CodeIcon from '@mui/icons-material/Code';
import {
  languages,
  skillLevels,
  getFilteredQuestions,
  getCategoriesForLanguage,
  countQuestionsByCategory,
  getSkillLevelDistribution
} from '../data/questionLoader';

const QuestionBrowser = ({
  selectedLanguage,
  onLanguageChange,
  onQuestionSelect,
  gradesMap
}) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);

  // Load categories based on selected language
  useEffect(() => {
    const availableCategories = getCategoriesForLanguage(selectedLanguage);
    setCategories(availableCategories);

    // Reset category selection when language changes
    setSelectedCategory('');
    setSelectedSkillLevel('all');
  }, [selectedLanguage]);

  // Load questions based on filters
  useEffect(() => {
    const filteredQuestions = getFilteredQuestions(
      selectedLanguage,
      selectedCategory,
      selectedSkillLevel === 'all' ? null : selectedSkillLevel
    );
    setQuestions(filteredQuestions);
  }, [selectedLanguage, selectedCategory, selectedSkillLevel]);

  // Handle language change
  const handleLanguageChange = (event) => {
    onLanguageChange(event.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle skill level filter change
  const handleSkillLevelChange = (event, newSkillLevel) => {
    if (newSkillLevel !== null) {
      setSelectedSkillLevel(newSkillLevel);
    }
  };

  // Get skill level counts for a category
  const getSkillLevelCounts = (categoryId) => {
    if (!categoryId) return {};
    return getSkillLevelDistribution(selectedLanguage, categoryId);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Question Browser
      </Typography>

      {/* Language Selector */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={selectedLanguage}
          label="Language"
          onChange={handleLanguageChange}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.id}
              value={language.id}
              disabled={!language.enabled}
            >
              {language.name} {!language.enabled && "(Coming Soon)"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Categories */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
        Categories
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {categories.map((category) => {
          const count = countQuestionsByCategory(selectedLanguage, category.id);
          return (
            <Chip
              key={category.id}
              label={category.name}
              icon={<CodeIcon />}
              onClick={() => handleCategoryChange(category.id)}
              color={selectedCategory === category.id ? "primary" : "default"}
              variant={selectedCategory === category.id ? "filled" : "outlined"}
              className="category-chip"
              sx={{ mb: 1 }}
            />
          );
        })}
      </Box>

      {/* Skill Level Filter (only show when category is selected) */}
      {selectedCategory && (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Skill Level Filter
          </Typography>
          <Paper sx={{ mb: 2, p: 1 }}>
            <ToggleButtonGroup
              value={selectedSkillLevel}
              exclusive
              onChange={handleSkillLevelChange}
              aria-label="skill level filter"
              size="small"
              fullWidth
            >
              <ToggleButton value="all">
                All
              </ToggleButton>
              {skillLevels.map((level) => {
                const counts = getSkillLevelCounts(selectedCategory);
                const count = counts[level.id] || 0;
                return (
                  <ToggleButton key={level.id} value={level.id} disabled={count === 0}>
                    <Badge badgeContent={count} color="primary" sx={{ mr: 1 }}>
                      {level.name}
                    </Badge>
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Paper>
        </>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Questions List */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">
          Questions ({questions.length})
        </Typography>
        {questions.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Categories'}
              {selectedSkillLevel !== 'all' ? ` • ${skillLevels.find(l => l.id === selectedSkillLevel)?.name}` : ''}
            </Typography>
          </Box>
        )}
      </Box>

      <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
        {questions.length > 0 ? (
          questions.map((question) => (
            <ListItem
              key={question.id}
              button
              onClick={() => onQuestionSelect(question)}
              sx={{
                borderLeft: gradesMap[question.id] ? '4px solid #4caf50' : 'none',
                bgcolor: gradesMap[question.id] ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
              }}
              className="question-list-item"
            >
              {gradesMap[question.id] && (
                <ListItemIcon sx={{ minWidth: '36px' }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText
                primary={question.question.length > 60
                  ? `${question.question.substring(0, 60)}...`
                  : question.question}
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      size="small"
                      label={question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)}
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                    {question.tags && question.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText
              primary="No questions available"
              secondary={selectedCategory ? "Try changing filters or selecting a different category" : "Select a category to see questions"}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default QuestionBrowser;