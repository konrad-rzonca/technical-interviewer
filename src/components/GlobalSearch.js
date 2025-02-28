// src/components/GlobalSearch.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Popover,
  List,
  ListItem,
  Typography,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  ClickAwayListener,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import TagIcon from '@mui/icons-material/Tag';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightIcon from '@mui/icons-material/Highlight';

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

  // Highlight matching text in search results
  const highlightMatch = (text, term) => {
    if (!term || !text) return text;

    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase()
        ? <span key={i} style={{ backgroundColor: 'rgba(255, 213, 79, 0.5)', fontWeight: 'bold' }}>{part}</span>
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
              borderRadius: 2,
              background: 'white',
              '&:hover': {
                bgcolor: 'white',
              }
            }
          }}
          sx={{
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
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
              mt: 0.5,
              zIndex: 1301,
              p: 2,
              borderRadius: 2
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              Advanced Filters
            </Typography>

            {/* Skill Level Filter */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="skill-level-filter-label">Skill Level</InputLabel>
              <Select
                labelId="skill-level-filter-label"
                value={filters.skillLevel}
                label="Skill Level"
                onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            {/* Answered Status Filter */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel id="answered-filter-label">Answered Status</InputLabel>
              <Select
                labelId="answered-filter-label"
                value={filters.answered}
                label="Answered Status"
                onChange={(e) => handleFilterChange('answered', e.target.value)}
              >
                <MenuItem value="all">All Questions</MenuItem>
                <MenuItem value="answered">Answered Only</MenuItem>
                <MenuItem value="unanswered">Unanswered Only</MenuItem>
              </Select>
            </FormControl>

            {/* Category Filter */}
            <Typography variant="body2" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {categories.map(category => (
                <Chip
                  key={category.id}
                  label={category.name}
                  size="small"
                  onClick={() => handleToggleCategory(category.id)}
                  color={filters.categories.includes(category.id) ? "primary" : "default"}
                  variant={filters.categories.includes(category.id) ? "filled" : "outlined"}
                />
              ))}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleApplyFilters}
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
              mt: 0.5,
              zIndex: 1300,
              maxHeight: 500,
              overflow: 'auto',
              borderRadius: 2
            }}
          >
            {/* Recent searches */}
            {searchHistory.length > 0 && searchTerm.length < 3 && (
              <>
                <Box sx={{ p: 1, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <HistoryIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Recent Searches
                  </Typography>
                </Box>
                <List disablePadding>
                  {searchHistory.map((term, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => setSearchTerm(term)}
                      sx={{ py: 0.75 }}
                    >
                      <Typography variant="body2">
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
                <Box sx={{ p: 1, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <HighlightIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Questions
                  </Typography>
                </Box>
                <List disablePadding>
                  {searchResults.questions.map((question) => (
                    <ListItem
                      key={question.id}
                      button
                      onClick={() => handleSelectQuestion(question)}
                      sx={{
                        py: 1,
                        borderLeft: `3px solid ${getSkillLevelColor(question.skillLevel)}`,
                        backgroundColor: gradesMap[question.id] ? 'rgba(102, 187, 106, 0.05)' : 'transparent'
                      }}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {highlightMatch(question.shortTitle || question.question, searchTerm)}
                          </Typography>
                          {gradesMap[question.id] && (
                            <CheckCircleIcon fontSize="small" sx={{ color: '#66bb6a', ml: 1 }} />
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', mt: 0.5, gap: 0.5 }}>
                          <Chip
                            size="small"
                            label={question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)}
                            sx={{
                              height: 20,
                              fontSize: '0.7rem',
                              backgroundColor: `${getSkillLevelColor(question.skillLevel)}20`,
                              color: getSkillLevelColor(question.skillLevel),
                            }}
                          />
                          <Chip
                            size="small"
                            label={getCategoryName(question.categoryId, categories)}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </>
            )}

            {/* Category Results */}
            {searchResults.categories.length > 0 && (
              <>
                <Box sx={{ p: 1, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TagIcon fontSize="small" sx={{ mr: 0.5 }} />
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
                        py: 1,
                        borderLeft: category.id === selectedCategory ? '3px solid #2196f3' : '3px solid transparent',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: category.id === selectedCategory ? 500 : 400 }}>
                        {highlightMatch(category.name, searchTerm)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* No results */}
            {searchResults.questions.length === 0 && searchResults.categories.length === 0 && searchTerm.trim() && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
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

// Helper function to get skill level color
function getSkillLevelColor(level) {
  switch (level) {
    case 'beginner': return '#66bb6a'; // green
    case 'intermediate': return '#ffb300'; // amber/yellow
    case 'advanced': return '#fb8c00'; // deeper orange
    default: return '#9e9e9e'; // gray
  }
}

export default GlobalSearch;