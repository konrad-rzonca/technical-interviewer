// src/components/GlobalSearch.js - Refactored
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import HighlightIcon from '@mui/icons-material/Highlight';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import TagIcon from '@mui/icons-material/Tag';
import TuneIcon from '@mui/icons-material/Tune';
import {
  Badge,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { getSkillLevelStyles } from '../utils/styleHooks';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

// This component provides a unified search across questions, categories, and content
const GlobalSearch = ({
  questions = [],
  categories = [],
  onQuestionSelect,
  onCategorySelect,
  gradesMap = {},
  selectedCategory = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    questions: [],
    categories: []
  });
  const [searchHistory, setSearchHistory] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    skillLevel: 'all',
    answered: 'all',
    categories: []
  });

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Search questions and categories based on the search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({ questions: [], categories: [] });
      return;
    }

    const term = searchTerm.toLowerCase();

    // Filter questions based on search term and active filters
    const filteredQuestions = questions.filter(question => {
      // Text search
      const matchesText =
        question.question.toLowerCase().includes(term) ||
        (question.shortTitle && question.shortTitle.toLowerCase().includes(term));

      if (!matchesText) return false;

      // Apply skill level filter
      if (filters.skillLevel !== 'all' && question.skillLevel !== filters.skillLevel) {
        return false;
      }

      // Apply answered filter
      if (filters.answered === 'answered' && !gradesMap[question.id]) {
        return false;
      } else if (filters.answered === 'unanswered' && gradesMap[question.id]) {
        return false;
      }

      // Apply category filter
      if (filters.categories.length > 0 && !filters.categories.includes(question.categoryId)) {
        return false;
      }

      return true;
    }).slice(0, 10); // Limit to top 10 for performance

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
      category.name.toLowerCase().includes(term) ||
      category.subcategories.some(subcat => subcat.toLowerCase().includes(term))
    ).slice(0, 5); // Limit to top 5

    setSearchResults({
      questions: filteredQuestions,
      categories: filteredCategories
    });
  }, [searchTerm, questions, categories, filters, gradesMap]);

  // Add search term to search history when selecting a result
  const addToSearchHistory = (term) => {
    if (!term || term.length < 3) return;

    // Add to history, removing duplicates and limiting to last 10 searches
    setSearchHistory(prev => {
      const newHistory = prev.filter(item => item !== term);
      return [term, ...newHistory].slice(0, 10);
    });
  };

  // Handle selecting a search result
  const handleSelectQuestion = (question) => {
    addToSearchHistory(searchTerm);
    onQuestionSelect(question);
    setShowResults(false);
    setSearchTerm('');
  };

  // Handle selecting a category
  const handleSelectCategory = (categoryId) => {
    addToSearchHistory(searchTerm);
    onCategorySelect(categoryId);
    setShowResults(false);
    setSearchTerm('');
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowResults(value.trim().length > 0);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  // Toggle advanced filters
  const handleToggleFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Update filter values
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Toggle category in filter
  const handleToggleCategory = (categoryId) => {
    setFilters(prev => {
      const categories = [...prev.categories];
      const index = categories.indexOf(categoryId);

      if (index === -1) {
        categories.push(categoryId);
      } else {
        categories.splice(index, 1);
      }

      return {
        ...prev,
        categories
      };
    });
  };

  // Apply selected filters
  const handleApplyFilters = () => {
    setShowAdvancedFilters(false);
  };

  // Reset filters to default
  const handleResetFilters = () => {
    setFilters({
      skillLevel: 'all',
      answered: 'all',
      categories: []
    });
  };

  // Count active filters
  const activeFilterCount =
    (filters.skillLevel !== 'all' ? 1 : 0) +
    (filters.answered !== 'all' ? 1 : 0) +
    filters.categories.length;

  // Get skill level color based on level name
  const getSkillLevelColor = (level) => {
    const styles = getSkillLevelStyles(level);
    return styles.main;
  };

  // Highlight matching text in search results
  const highlightMatch = (text, term) => {
    if (!term || !text) return text;

    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase()
        ? <span key={i} style={{ backgroundColor: `${COLORS.warning.light}`, fontWeight: 'bold' }}>{part}</span>
        : part
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setShowResults(false)}>
      <Box ref={searchContainerRef} sx={{ position: 'relative', width: '100%', maxWidth: 600 }}>
        <TextField
          ref={searchInputRef}
          placeholder="Search questions, categories..."
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={() => searchTerm.trim() && setShowResults(true)}
          onFocus={() => searchTerm.trim() && setShowResults(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {searchTerm && (
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}
                <Tooltip title="Advanced Filters">
                  <IconButton
                    size="small"
                    onClick={handleToggleFilters}
                    color={activeFilterCount > 0 ? "primary" : "default"}
                  >
                    <Badge badgeContent={activeFilterCount} color="primary">
                      <TuneIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
            sx: {
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
              background: 'white',
              '&:hover': {
                bgcolor: 'white',
              }
            }
          }}
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
            },
            '& .MuiInputBase-input': {
              fontSize: TYPOGRAPHY.fontSize.regularText
            }
          }}
        />

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: SPACING.toUnits(SPACING.md),
              zIndex: 1301,
              p: SPACING.toUnits(SPACING.sm),
              borderRadius: SPACING.toUnits(SPACING.borderRadius)
            }}
          >
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ fontSize: TYPOGRAPHY.fontSize.regularText, fontWeight: TYPOGRAPHY.fontWeight.medium }}
            >
              Advanced Filters
            </Typography>

            {/* Skill Level Filter */}
            <FormControl fullWidth size="small" sx={{ mb: SPACING.toUnits(SPACING.sm) }}>
              <InputLabel id="skill-level-filter-label">Skill Level</InputLabel>
              <Select
                labelId="skill-level-filter-label"
                value={filters.skillLevel}
                label="Skill Level"
                onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
                sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            {/* Answered Status Filter */}
            <FormControl fullWidth size="small" sx={{ mb: SPACING.toUnits(SPACING.sm) }}>
              <InputLabel id="answered-filter-label">Answered Status</InputLabel>
              <Select
                labelId="answered-filter-label"
                value={filters.answered}
                label="Answered Status"
                onChange={(e) => handleFilterChange('answered', e.target.value)}
                sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
              >
                <MenuItem value="all">All Questions</MenuItem>
                <MenuItem value="answered">Answered Only</MenuItem>
                <MenuItem value="unanswered">Unanswered Only</MenuItem>
              </Select>
            </FormControl>

            {/* Category Filter */}
            <Typography
              variant="body2"
              gutterBottom
              sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
            >
              Categories
            </Typography>
            <Box sx={{
              mb: SPACING.toUnits(SPACING.sm),
              display: 'flex',
              flexWrap: 'wrap',
              gap: SPACING.toUnits(SPACING.sm)
            }}>
              {categories.map(category => (
                <Chip
                  key={category.id}
                  label={category.name}
                  size="small"
                  onClick={() => handleToggleCategory(category.id)}
                  color={filters.categories.includes(category.id) ? "primary" : "default"}
                  variant={filters.categories.includes(category.id) ? "filled" : "outlined"}
                  sx={{ fontSize: TYPOGRAPHY.fontSize.caption }}
                />
              ))}
            </Box>

            {/* Action buttons */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: SPACING.toUnits(SPACING.sm)
            }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleResetFilters}
                sx={{ fontSize: TYPOGRAPHY.fontSize.button }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilters}
                sx={{ fontSize: TYPOGRAPHY.fontSize.button }}
              >
                Apply Filters
              </Button>
            </Box>
          </Paper>
        )}

        {/* Search Results Dropdown */}
        {showResults && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: SPACING.toUnits(SPACING.xs),
              zIndex: 1300,
              maxHeight: 500,
              overflow: 'auto',
              borderRadius: SPACING.toUnits(SPACING.borderRadius)
            }}
          >
            {/* Recent searches */}
            {searchHistory.length > 0 && searchTerm.length < 3 && (
              <>
                <Box sx={{
                  p: SPACING.toUnits(SPACING.sm),
                  bgcolor: COLORS.grey[100]
                }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: TYPOGRAPHY.fontSize.regularText,
                      fontWeight: TYPOGRAPHY.fontWeight.medium
                    }}
                  >
                    <HistoryIcon fontSize="small" sx={{ mr: SPACING.toUnits(SPACING.xs) }} />
                    Recent Searches
                  </Typography>
                </Box>
                <List disablePadding>
                  {searchHistory.map((term, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => setSearchTerm(term)}
                      sx={{ py: SPACING.toUnits(SPACING.sm) }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
                      >
                        {term}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </>
            )}

            {/* Question Results */}
            {searchResults.questions.length > 0 && (
              <>
                <Box sx={{
                  p: SPACING.toUnits(SPACING.sm),
                  bgcolor: COLORS.grey[100]
                }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: TYPOGRAPHY.fontSize.regularText,
                      fontWeight: TYPOGRAPHY.fontWeight.medium
                    }}
                  >
                    <HighlightIcon fontSize="small" sx={{ mr: SPACING.toUnits(SPACING.xs) }} />
                    Questions
                  </Typography>
                </Box>
                <List disablePadding>
                  {searchResults.questions.map((question) => {
                    const skillLevelColor = getSkillLevelColor(question.skillLevel);

                    return (
                      <ListItem
                        key={question.id}
                        button
                        onClick={() => handleSelectQuestion(question)}
                        sx={{
                          py: SPACING.toUnits(SPACING.sm),
                          borderLeft: `3px solid ${skillLevelColor}`,
                          backgroundColor: gradesMap[question.id] ? `${COLORS.success.main}05` : 'transparent'
                        }}
                      >
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                          }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                                fontSize: TYPOGRAPHY.fontSize.regularText
                              }}
                            >
                              {highlightMatch(question.shortTitle || question.question, searchTerm)}
                            </Typography>
                            {gradesMap[question.id] && (
                              <CheckCircleIcon
                                fontSize="small"
                                sx={{
                                  color: COLORS.success.main,
                                  ml: SPACING.toUnits(SPACING.sm)
                                }}
                              />
                            )}
                          </Box>
                          <Box sx={{
                            display: 'flex',
                            mt: SPACING.toUnits(SPACING.xs),
                            gap: SPACING.toUnits(SPACING.xs)
                          }}>
                            <Chip
                              size="small"
                              label={question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)}
                              sx={{
                                height: 20,
                                fontSize: TYPOGRAPHY.fontSize.small,
                                backgroundColor: `${skillLevelColor}20`,
                                color: skillLevelColor,
                              }}
                            />
                            <Chip
                              size="small"
                              label={getCategoryName(question.categoryId, categories)}
                              sx={{
                                height: 20,
                                fontSize: TYPOGRAPHY.fontSize.small
                              }}
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </ListItem>
                    )
                  })}
                </List>
                <Divider />
              </>
            )}

            {/* Category Results */}
            {searchResults.categories.length > 0 && (
              <>
                <Box sx={{
                  p: SPACING.toUnits(SPACING.sm),
                  bgcolor: COLORS.grey[100]
                }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: TYPOGRAPHY.fontSize.regularText,
                      fontWeight: TYPOGRAPHY.fontWeight.medium
                    }}
                  >
                    <TagIcon fontSize="small" sx={{ mr: SPACING.toUnits(SPACING.xs) }} />
                    Categories
                  </Typography>
                </Box>
                <List disablePadding>
                  {searchResults.categories.map((category) => (
                    <ListItem
                      key={category.id}
                      button
                      onClick={() => handleSelectCategory(category.id)}
                      sx={{
                        py: SPACING.toUnits(SPACING.sm),
                        borderLeft: category.id === selectedCategory ? `3px solid ${COLORS.primary.main}` : '3px solid transparent',
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: category.id === selectedCategory ? TYPOGRAPHY.fontWeight.medium : TYPOGRAPHY.fontWeight.regular,
                          fontSize: TYPOGRAPHY.fontSize.regularText
                        }}
                      >
                        {highlightMatch(category.name, searchTerm)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* No results */}
            {searchResults.questions.length === 0 && searchResults.categories.length === 0 && searchTerm.trim() && (
              <Box sx={{
                p: SPACING.toUnits(SPACING.sm),
                textAlign: 'center'
              }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}
                >
                  No results found for "{searchTerm}"
                </Typography>
              </Box>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

// Helper function to get category name by ID
function getCategoryName(categoryId, categories) {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : 'Unknown';
}

export default GlobalSearch;