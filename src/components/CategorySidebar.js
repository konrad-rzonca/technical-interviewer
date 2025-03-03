// src/components/CategorySidebar.js
import CategoryIcon from '@mui/icons-material/Category';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import GridViewIcon from '@mui/icons-material/GridView';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, {useMemo, useState} from 'react';

import {useTitleStyles} from '../utils/styles';
import {COLORS, TYPOGRAPHY} from '../utils/theme';

// Constants for styling
const CATEGORY_ITEM_PADDING = 1.2; // Reduced padding

// Utility function for category item styles (not a hook)
const getCategoryItemStyles = (isSelected) => ({
  p: CATEGORY_ITEM_PADDING,
  mb: 0.75, // Reduced margin
  borderRadius: 1,
  cursor: 'pointer',
  backgroundColor: isSelected ? `${COLORS.primary.main}08` : 'transparent',
  border: isSelected
      ? `1px solid ${COLORS.primary.main}20`
      : '1px solid transparent',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: `${COLORS.primary.main}04`,
  },
});

// Utility function for subcategory item styles (not a hook)
const getSubcategoryItemStyles = (isSelected) => ({
  p: 0,
  mb: 0.5, // Reduced margin
  bgcolor: isSelected ? `${COLORS.primary.main}08` : 'transparent',
  borderRadius: 1,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
  pr: 1,
});

// SubcategoryItem component for better organization
const SubcategoryItem = React.memo(({
  subcategory,
  isSelected,
  isChecked,
  onSelect,
  onToggle,
}) => {
  return (
      <ListItem
          dense
          sx={getSubcategoryItemStyles(isSelected)}
      >
        <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between', // Use space-between for better spacing
              width: '100%',
              p: 0.6,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
                borderRadius: 1,
              },
            }}
            onClick={() => onSelect(subcategory)}
        >
          <Typography
              variant="body2"
              sx={isSelected
                  ? {fontWeight: 500, fontSize: TYPOGRAPHY.fontSize.body1}
                  : {fontWeight: 400, fontSize: TYPOGRAPHY.fontSize.body1}}
          >
            {subcategory}
          </Typography>

          <Checkbox
              size="medium"
              checked={isChecked}
              onChange={() => onToggle(subcategory)}
              onClick={(e) => e.stopPropagation()}
              sx={{p: 0.5}}
          />
        </Box>
      </ListItem>
  );
});

const CategorySidebar = ({
  categories,
  selectedCategory,
  expandedCategory,
  selectedSubcategories,
  subcategoryFilter,
  availableSets,
  selectedSets,
  onCategorySelect,
  onSubcategorySelect,
  onSubcategoryToggle,
  onSelectAllSubcategories,
  onDeselectAllSubcategories,
  onSetToggle,
  onSelectAllSets,
  onDeselectAllSets,
  isCollapsed,
  onToggle, // Added onToggle prop
}) => {
  const [setMenuAnchor, setSetMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get title styles from hooks
  const titleStyles = useTitleStyles();

  const handleSetMenuOpen = (event) => {
    setSetMenuAnchor(event.currentTarget);
  };

  const handleSetMenuClose = () => {
    setSetMenuAnchor(null);
  };

  // Count selected sets - memoized
  const selectedSetCount = useMemo(() =>
          Object.values(selectedSets).filter(Boolean).length,
      [selectedSets],
  );

  // Get subcategory count for a category - memoized
  const getActiveSubcategoryCount = useMemo(() => (categoryId) => {
    if (!selectedSubcategories[categoryId]) return 0;
    return Object.values(selectedSubcategories[categoryId]).
        filter(Boolean).length;
  }, [selectedSubcategories]);

  // Menu content styles
  const menuPaperStyles = useMemo(() => ({
    maxHeight: 300,
    width: 350,
  }), []);

  // Category section rendering
  const renderCategorySection = (category) => {
    const isSelected = selectedCategory === category.id;
    const activeSubcategoryCount = getActiveSubcategoryCount(category.id);

    return (
        <Box key={category.id}>
          <Box
              onClick={() => onCategorySelect(category.id)}
              sx={getCategoryItemStyles(isSelected)}
          >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Typography
                  variant="body1"
                  sx={isSelected
                      ? {fontWeight: 500, fontSize: TYPOGRAPHY.fontSize.body1}
                      : {fontWeight: 400, fontSize: TYPOGRAPHY.fontSize.body1}}
              >
                {category.name}
              </Typography>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center'}}>
              {/* Sets dropdown */}
              <Tooltip title="Select Question Sets">
                <IconButton
                    size="medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategorySelect(category.id);
                      handleSetMenuOpen(e);
                    }}
                    sx={{mr: 2}} // Reduced margin
                >
                  <FolderOpenIcon/>
                </IconButton>
              </Tooltip>

              {/* Expand/collapse if it has subcategories */}
              {category.subcategories.length > 0 && (
                  <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newExpandedCategory = expandedCategory ===
                        category.id ? null : category.id;
                        onCategorySelect(category.id, newExpandedCategory);
                      }}
                  >
                    {expandedCategory === category.id ?
                        <ExpandLessIcon fontSize="small"/> :
                        <ExpandMoreIcon fontSize="small"/>
                    }
                  </IconButton>
              )}
            </Box>
          </Box>

          {/* Subcategories collapsible section */}
          {category.subcategories.length > 0 && (
              <Collapse
                  in={expandedCategory === category.id}
                  timeout={0} // Set timeout to 0 to disable animation
                  unmountOnExit // Fully unmount when collapsed for better performance
              >
                <List dense sx={{ml: 2.5, mt: 0, mb: 1}}>
                  <ListItem
                      dense
                      sx={{p: 0, mb: 0.5}}
                  >
                    <Button
                        size="small"
                        onClick={() => onSelectAllSubcategories(category.id)}
                        sx={{
                          mr: 0.75,
                          minWidth: 'auto',
                          fontSize: TYPOGRAPHY.fontSize.caption,
                        }}
                    >
                      All
                    </Button>
                    <Button
                        size="small"
                        onClick={() => onDeselectAllSubcategories(category.id)}
                        sx={{
                          minWidth: 'auto',
                          fontSize: TYPOGRAPHY.fontSize.caption,
                        }}
                    >
                      None
                    </Button>
                  </ListItem>

                  {category.subcategories.map((subcategory) => (
                      <SubcategoryItem
                          key={subcategory}
                          subcategory={subcategory}
                          isSelected={subcategoryFilter === subcategory}
                          isChecked={selectedSubcategories[category.id]?.[subcategory] ||
                              false}
                          onSelect={() => onSubcategorySelect(subcategory)}
                          onToggle={() => onSubcategoryToggle(category.id,
                              subcategory)}
                      />
                  ))}
                </List>
              </Collapse>
          )}
        </Box>
    );
  };

  // Collapsed view rendering
  const renderCollapsedView = () => {
    return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 1, // Added top padding
        }}>
          <Tooltip title="Categories" placement="right">
            <Box sx={{mb: 1.5, textAlign: 'center'}}>
              <CategoryIcon color="primary" sx={{fontSize: '1.6rem'}}/>
            </Box>
          </Tooltip>

          {/* Show only icons for categories */}
          {categories.map((category) => {
            const activeSubcategoryCount = getActiveSubcategoryCount(
                category.id);

            return (
                <Tooltip key={category.id} title={category.name}
                         placement="right">
                  <Badge
                      badgeContent={activeSubcategoryCount}
                      color="primary"
                      invisible={activeSubcategoryCount === 0}
                      sx={{mb: 1.25}}
                  >
                    <IconButton
                        onClick={() => onCategorySelect(category.id)}
                        sx={{
                          bgcolor: selectedCategory === category.id
                              ? `${COLORS.primary.main}08`
                              : 'transparent',
                          border: selectedCategory === category.id
                              ? `1px solid ${COLORS.primary.main}20`
                              : '1px solid transparent',
                        }}
                        size="medium"
                    >
                      {category.id === 'core-java' ? (
                          <FolderIcon fontSize="medium"
                                      color={selectedCategory === category.id
                                          ? 'primary'
                                          : 'action'}/>
                      ) : category.id === 'concurrency-multithreading' ? (
                          <GridViewIcon fontSize="medium"
                                        color={selectedCategory === category.id
                                            ? 'primary'
                                            : 'action'}/>
                      ) : (
                          <FolderIcon fontSize="medium"
                                      color={selectedCategory === category.id
                                          ? 'primary'
                                          : 'action'}/>
                      )}
                    </IconButton>
                  </Badge>
                </Tooltip>
            );
          })}
        </Box>
    );
  };

  return (
      <Box
          sx={{
            height: '100%',
            p: isCollapsed ? 0.75 : 2.5,
            overflow: 'auto',
          }}
      >
        {!isCollapsed ? (
            // Full sidebar content
            <>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                mt: 0.5,
              }}>
                <Typography
                    variant="subtitle1"
                    sx={{
                      ...titleStyles,
                      mb: 0,
                    }}
                >
                  Categories
                </Typography>

                {/* Toggle button positioned on the right (inner side) */}
                <IconButton
                    onClick={onToggle}
                    aria-label="Collapse sidebar"
                    size="small"
                    sx={{
                      borderRadius: 1,
                      backgroundColor: 'transparent',
                      padding: 0.5,
                      '&:hover': {
                        backgroundColor: COLORS.grey[100],
                      },
                    }}
                >
                  <ChevronLeftIcon fontSize="small"/>
                </IconButton>
              </Box>

              {categories.map(renderCategorySection)}
            </>
        ) : (
            // Collapsed sidebar with icons only
            renderCollapsedView()
        )}

        {/* Question Sets Selection Menu */}
        <Menu
            anchorEl={setMenuAnchor}
            open={Boolean(setMenuAnchor)}
            onClose={handleSetMenuClose}
            slotProps={{paper: {style: menuPaperStyles}}}
        >
          <Box sx={{
            px: 2,
            py: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="subtitle2"
                        sx={{fontSize: TYPOGRAPHY.fontSize.body1}}>
              Question Sets ({selectedSetCount}/{availableSets.length})
            </Typography>
            <Box>
              <Button
                  size="small"
                  onClick={() => {
                    onSelectAllSets();
                    handleSetMenuClose();
                  }}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    fontSize: TYPOGRAPHY.fontSize.caption,
                  }}
              >
                All
              </Button>
              <Button
                  size="small"
                  onClick={() => {
                    onDeselectAllSets();
                    handleSetMenuClose();
                  }}
                  sx={{
                    minWidth: 'auto',
                    px: 1,
                    fontSize: TYPOGRAPHY.fontSize.caption,
                  }}
              >
                None
              </Button>
            </Box>
          </Box>
          <Divider/>
          {availableSets.map((set) => (
              <MenuItem
                  key={set.id}
                  dense
                  onClick={() => {
                    onSetToggle(set.id);
                    handleSetMenuClose();
                  }}
              >
                <ListItemIcon>
                  <Checkbox
                      edge="start"
                      checked={selectedSets[set.id] || false}
                      tabIndex={-1}
                      disableRipple
                      size="medium"
                  />
                </ListItemIcon>
                <ListItemText primary={<Typography
                    sx={{fontSize: TYPOGRAPHY.fontSize.body1}}>{set.name}</Typography>}/>
              </MenuItem>
          ))}
          {availableSets.length === 0 && (
              <MenuItem disabled>
                <ListItemText primary={<Typography
                    sx={{fontSize: TYPOGRAPHY.fontSize.body1}}>No question sets
                  in this category</Typography>}/>
              </MenuItem>
          )}
        </Menu>
      </Box>
  );
};

export default React.memo(CategorySidebar);