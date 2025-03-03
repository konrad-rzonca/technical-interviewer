// src/components/GlobalSearch.js - Updated for new layout without advanced filters
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import HighlightIcon from '@mui/icons-material/Highlight';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import TagIcon from '@mui/icons-material/Tag';
import {getSkillLevelStyles} from '../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../themes/baseTheme';

// SearchResultItem component for questions
const QuestionResultItem = React.memo(
    ({question, searchTerm, onClick, answered, categories}) => {
      const skillLevelColor = getSkillLevelStyles(question.skillLevel).main;

      // Find category name for this question
      const categoryName = useMemo(() => {
        const category = categories.find(c => c.id === question.categoryId);
        return category ? category.name : 'Unknown';
      }, [question.categoryId, categories]);

      // Highlight matching text in search results
      const highlightMatch = (text, term) => {
        if (!term || !text) return text;

        const parts = text.split(new RegExp(`(${term})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === term.toLowerCase()
                ? <span key={i} style={{
                  backgroundColor: `${COLORS.intermediate.light}`,
                  fontWeight: 'bold',
                }}>{part}</span>
                : part,
        );
      };

      return (
          <ListItem
              button
              onClick={() => onClick(question)}
              sx={{
                py: SPACING.toUnits(SPACING.sm),
                borderLeft: `3px solid ${skillLevelColor}`,
                backgroundColor: answered
                    ? `${COLORS.basic.main}05`
                    : 'transparent',
              }}
          >
            <Box sx={{width: '100%'}}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <Typography
                    variant="body2"
                    sx={{
                      fontWeight: TYPOGRAPHY.fontWeight.medium,
                      fontSize: TYPOGRAPHY.fontSize.regularText,
                    }}
                >
                  {highlightMatch(question.shortTitle || question.question,
                      searchTerm)}
                </Typography>
                {answered && (
                    <CheckCircleIcon
                        fontSize="small"
                        sx={{
                          color: COLORS.basic.main,
                          ml: SPACING.toUnits(SPACING.sm),
                        }}
                    />
                )}
              </Box>
              <Box sx={{
                display: 'flex',
                mt: SPACING.toUnits(SPACING.xs),
                gap: SPACING.toUnits(SPACING.xs),
              }}>
                <Chip
                    size="small"
                    label={question.skillLevel.charAt(0).toUpperCase() +
                        question.skillLevel.slice(1)}
                    sx={{
                      height: 20,
                      fontSize: TYPOGRAPHY.fontSize.small,
                      backgroundColor: `${skillLevelColor}20`,
                      color: skillLevelColor,
                    }}
                />
                <Chip
                    size="small"
                    label={categoryName}
                    sx={{
                      height: 20,
                      fontSize: TYPOGRAPHY.fontSize.small,
                    }}
                    variant="outlined"
                />
              </Box>
            </Box>
          </ListItem>
      );
    });

// Main GlobalSearch component
const GlobalSearch = ({
  questions = [],
  categories = [],
  onQuestionSelect,
  onCategorySelect,
  gradesMap = {},
  selectedCategory = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState({
    questions: [],
    categories: [],
  });
  const [searchHistory, setSearchHistory] = useState([]);

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Search questions and categories based on the search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults({questions: [], categories: []});
      return;
    }

    const term = searchTerm.toLowerCase();

    // Filter questions based on search term
    const filteredQuestions = questions.filter(question => {
      // Text search
      return question.question.toLowerCase().includes(term) ||
          (question.shortTitle &&
              question.shortTitle.toLowerCase().includes(term));
    }).slice(0, 10); // Limit to top 10 for performance

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(term) ||
        category.subcategories.some(
            subcat => subcat.toLowerCase().includes(term)),
    ).slice(0, 5); // Limit to top 5

    setSearchResults({
      questions: filteredQuestions,
      categories: filteredCategories,
    });
  }, [searchTerm, questions, categories, gradesMap]);

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

  // Highlight matching text in search results
  const highlightMatch = (text, term) => {
    if (!term || !text) return text;

    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase()
            ? <span key={i} style={{
              backgroundColor: `${COLORS.intermediate.light}`,
              fontWeight: 'bold',
            }}>{part}</span>
            : part,
    );
  };

  return (
      <ClickAwayListener onClickAway={() => setShowResults(false)}>
        <Box ref={searchContainerRef}
             sx={{
               position: 'relative',
               width: '100%',
               minWidth: isSmallScreen ? 200 : 300,
               maxWidth: isSmallScreen ? 300 : 600,
             }}>
          <TextField
              ref={searchInputRef}
              placeholder="Search questions, categories..."
              fullWidth
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              onClick={() => searchTerm.trim() && setShowResults(true)}
              onFocus={() => searchTerm.trim() && setShowResults(true)}
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon/>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                      {searchTerm && (
                          <IconButton size="small" onClick={handleClearSearch}>
                            <ClearIcon fontSize="small"/>
                          </IconButton>
                      )}
                    </InputAdornment>
                ),
                sx: {
                  borderRadius: SPACING.toUnits(SPACING.borderRadius),
                  background: 'white',
                  height: '40px', // Fixed height for the search input
                  '&:hover': {
                    bgcolor: 'white',
                  },
                },
              }}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: SPACING.toUnits(SPACING.borderRadius),
                },
                '& .MuiInputBase-input': {
                  fontSize: TYPOGRAPHY.fontSize.regularText,
                  py: 1,
                },
              }}
          />

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
                    borderRadius: SPACING.toUnits(SPACING.borderRadius),
                  }}
              >
                {/* Recent searches */}
                {searchHistory.length > 0 && searchTerm.length < 3 && (
                    <>
                      <Box sx={{
                        p: SPACING.toUnits(SPACING.sm),
                        bgcolor: COLORS.grey[100],
                      }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: TYPOGRAPHY.fontSize.regularText,
                              fontWeight: TYPOGRAPHY.fontWeight.medium,
                            }}
                        >
                          <HistoryIcon fontSize="small"
                                       sx={{mr: SPACING.toUnits(SPACING.xs)}}/>
                          Recent Searches
                        </Typography>
                      </Box>
                      <List disablePadding>
                        {searchHistory.map((term, index) => (
                            <ListItem
                                key={index}
                                button
                                onClick={() => setSearchTerm(term)}
                                sx={{py: SPACING.toUnits(SPACING.sm)}}
                            >
                              <Typography
                                  variant="body2"
                                  sx={{fontSize: TYPOGRAPHY.fontSize.regularText}}
                              >
                                {term}
                              </Typography>
                            </ListItem>
                        ))}
                      </List>
                      <Divider/>
                    </>
                )}

                {/* Question Results */}
                {searchResults.questions.length > 0 && (
                    <>
                      <Box sx={{
                        p: SPACING.toUnits(SPACING.sm),
                        bgcolor: COLORS.grey[100],
                      }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: TYPOGRAPHY.fontSize.regularText,
                              fontWeight: TYPOGRAPHY.fontWeight.medium,
                            }}
                        >
                          <HighlightIcon fontSize="small" sx={{
                            mr: SPACING.toUnits(SPACING.xs),
                          }}/>
                          Questions
                        </Typography>
                      </Box>
                      <List disablePadding>
                        {searchResults.questions.map((question) => (
                            <QuestionResultItem
                                key={question.id}
                                question={question}
                                searchTerm={searchTerm}
                                onClick={handleSelectQuestion}
                                answered={!!gradesMap[question.id]}
                                categories={categories}
                            />
                        ))}
                      </List>
                      <Divider/>
                    </>
                )}

                {/* Category Results */}
                {searchResults.categories.length > 0 && (
                    <>
                      <Box sx={{
                        p: SPACING.toUnits(SPACING.sm),
                        bgcolor: COLORS.grey[100],
                      }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: TYPOGRAPHY.fontSize.regularText,
                              fontWeight: TYPOGRAPHY.fontWeight.medium,
                            }}
                        >
                          <TagIcon fontSize="small"
                                   sx={{mr: SPACING.toUnits(SPACING.xs)}}/>
                          Categories
                        </Typography>
                      </Box>
                      <List disablePadding>
                        {searchResults.categories.map((category) => (
                            <ListItem
                                key={category.id}
                                button
                                onClick={() => handleSelectCategory(
                                    category.id)}
                                sx={{
                                  py: SPACING.toUnits(SPACING.sm),
                                  borderLeft: category.id === selectedCategory
                                      ? `3px solid ${COLORS.primary.main}`
                                      : '3px solid transparent',
                                }}
                            >
                              <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: category.id === selectedCategory
                                        ? TYPOGRAPHY.fontWeight.medium
                                        : TYPOGRAPHY.fontWeight.regular,
                                    fontSize: TYPOGRAPHY.fontSize.regularText,
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
                {searchResults.questions.length === 0 &&
                    searchResults.categories.length === 0 &&
                    searchTerm.trim() && (
                        <Box sx={{
                          p: SPACING.toUnits(SPACING.sm),
                          textAlign: 'center',
                        }}>
                          <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{fontSize: TYPOGRAPHY.fontSize.regularText}}
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

export default React.memo(GlobalSearch);