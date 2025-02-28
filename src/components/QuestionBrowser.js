// src/components/QuestionBrowser.js - Refactored
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
import { SPACING, TYPOGRAPHY, COLORS } from '../utils/theme';
import { getSkillLevelStyles, useTitleStyles } from '../utils/styleHooks';

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

  // Get title styles from hooks
  const titleStyles = useTitleStyles();

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

  // Get chip color for a skill level
  const getSkillLevelChipStyle = (level) => {
    const levelStyles = getSkillLevelStyles(level);
    return {
      backgroundColor: levelStyles.background,
      color: levelStyles.main,
      borderColor: levelStyles.border
    };
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={titleStyles}>
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
          sx={{
            fontSize: TYPOGRAPHY.fontSize.regularText,
            mb: SPACING.toUnits(SPACING.md)
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.id}
              value={language.id}
              disabled={!language.enabled}
              sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
            >
              {language.name} {!language.enabled && "(Coming Soon)"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Categories */}
      <Typography
        variant="subtitle2"
        sx={{
          mt: SPACING.toUnits(SPACING.sm),
          mb: SPACING.toUnits(SPACING.xs),
          fontSize: TYPOGRAPHY.fontSize.h6,
          fontWeight: TYPOGRAPHY.fontWeight.medium
        }}
      >
        Categories
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: SPACING.toUnits(SPACING.xs),
        mb: SPACING.toUnits(SPACING.sm)
      }}>
        {categories.map((category) => {
          const count = countQuestionsByCategory(selectedLanguage, category.id);
          const isSelected = selectedCategory === category.id;

          return (
            <Chip
              key={category.id}
              label={category.name}
              icon={<CodeIcon />}
              onClick={() => handleCategoryChange(category.id)}
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              className="category-chip"
              sx={{
                mb: SPACING.toUnits(SPACING.xs),
                fontSize: TYPOGRAPHY.fontSize.caption,
                fontWeight: isSelected ? TYPOGRAPHY.fontWeight.medium : TYPOGRAPHY.fontWeight.regular
              }}
            />
          );
        })}
      </Box>

      {/* Skill Level Filter (only show when category is selected) */}
      {selectedCategory && (
        <>
          <Typography
            variant="subtitle2"
            sx={{
              mt: SPACING.toUnits(SPACING.sm),
              mb: SPACING.toUnits(SPACING.xs),
              fontSize: TYPOGRAPHY.fontSize.h6,
              fontWeight: TYPOGRAPHY.fontWeight.medium
            }}
          >
            Skill Level Filter
          </Typography>
          <Paper sx={{
            mb: SPACING.toUnits(SPACING.sm),
            p: SPACING.toUnits(SPACING.sm)
          }}>
            <ToggleButtonGroup
              value={selectedSkillLevel}
              exclusive
              onChange={handleSkillLevelChange}
              aria-label="skill level filter"
              size="small"
              fullWidth
              sx={{ '& .MuiToggleButton-root': { fontSize: TYPOGRAPHY.fontSize.regularText } }}
            >
              <ToggleButton value="all">
                All
              </ToggleButton>
              {skillLevels.map((level) => {
                const counts = getSkillLevelCounts(selectedCategory);
                const count = counts[level.id] || 0;
                return (
                  <ToggleButton key={level.id} value={level.id} disabled={count === 0}>
                    <Badge
                      badgeContent={count}
                      color="primary"
                      sx={{ mr: SPACING.toUnits(SPACING.xs) }}
                    >
                      {level.name}
                    </Badge>
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          </Paper>
        </>
      )}

      <Divider sx={{ my: SPACING.toUnits(SPACING.sm) }} />

      {/* Questions List */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: SPACING.toUnits(SPACING.xs)
      }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontSize: TYPOGRAPHY.fontSize.h6,
            fontWeight: TYPOGRAPHY.fontWeight.medium
          }}
        >
          Questions ({questions.length})
        </Typography>
        {questions.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FilterListIcon
              fontSize="small"
              sx={{ mr: SPACING.toUnits(SPACING.xs), color: COLORS.text.secondary }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: TYPOGRAPHY.fontSize.caption }}
            >
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Categories'}
              {selectedSkillLevel !== 'all' ? ` • ${skillLevels.find(l => l.id === selectedSkillLevel)?.name}` : ''}
            </Typography>
          </Box>
        )}
      </Box>

      <List sx={{
        maxHeight: '50vh',
        overflow: 'auto',
        ...globalStyles?.scrollbar
      }}>
        {questions.length > 0 ? (
          questions.map((question) => {
            const isAnswered = gradesMap && gradesMap[question.id];
            const levelStyles = getSkillLevelStyles(question.skillLevel);

            return (
              <ListItem
                key={question.id}
                button
                onClick={() => onQuestionSelect(question)}
                sx={{
                  borderLeft: isAnswered ? `4px solid ${COLORS.success.main}` : `4px solid ${levelStyles.main}`,
                  bgcolor: isAnswered ? `${COLORS.success.main}10` : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: isAnswered ? `${COLORS.success.main}15` : `${levelStyles.main}10`,
                  },
                  borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
                  mb: SPACING.toUnits(SPACING.xs)
                }}
                className="question-list-item"
              >
                {isAnswered && (
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText
                  primary={
                    <Typography sx={{
                      fontSize: TYPOGRAPHY.fontSize.regularText,
                      fontWeight: TYPOGRAPHY.fontWeight.regular
                    }}>
                      {question.question.length > 60
                        ? `${question.question.substring(0, 60)}...`
                        : question.question}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: SPACING.toUnits(SPACING.xs) }}>
                      <Chip
                        size="small"
                        label={question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)}
                        sx={{
                          mr: SPACING.toUnits(SPACING.xs),
                          mb: SPACING.toUnits(SPACING.xs),
                          fontSize: TYPOGRAPHY.fontSize.small,
                          ...getSkillLevelChipStyle(question.skillLevel)
                        }}
                      />
                      {question.tags && question.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{
                            mr: SPACING.toUnits(SPACING.xs),
                            mb: SPACING.toUnits(SPACING.xs),
                            fontSize: TYPOGRAPHY.fontSize.small
                          }}
                        />
                      ))}
                    </Box>
                  }
                />
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}>
                  No questions available
                </Typography>
              }
              secondary={
                <Typography sx={{ fontSize: TYPOGRAPHY.fontSize.caption, color: COLORS.text.secondary }}>
                  {selectedCategory
                    ? "Try changing filters or selecting a different category"
                    : "Select a category to see questions"}
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default QuestionBrowser;