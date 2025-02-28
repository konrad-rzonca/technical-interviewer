// src/components/CategorySidebar.js
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Checkbox,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderIcon from '@mui/icons-material/Folder';
import CategoryIcon from '@mui/icons-material/Category';
import GridViewIcon from '@mui/icons-material/GridView';

import { COLORS, TYPOGRAPHY } from '../utils/theme';
import {
  usePanelStyles,
  useItemTextStyles,
  useTitleStyles
} from '../utils/styleHooks';

// Utility function for category item styles (not a hook)
const getCategoryItemStyles = (isSelected) => ({
  p: 1.5,
  mb: 1,
  borderRadius: 1,
  cursor: 'pointer',
  backgroundColor: isSelected ? `${COLORS.primary.main}08` : 'transparent',
  border: isSelected ? `1px solid ${COLORS.primary.main}20` : '1px solid transparent',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: `${COLORS.primary.main}04`,
  }
});

// Utility function for subcategory item styles (not a hook)
const getSubcategoryItemStyles = (isSelected) => ({
  p: 0,
  mb: 0.75,
  bgcolor: isSelected ? `${COLORS.primary.main}08` : 'transparent',
  borderRadius: 1,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'space-between',
  pr: 1
});

// Utility function for subcategory label styles (not a hook)
const getSubcategoryLabelStyles = () => ({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  p: 0.75,
  cursor: 'pointer',
  '&:hover': {
    bgcolor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: 1
  }
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
  isCollapsed
}) => {
  const [setMenuAnchor, setSetMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get panel styles from hooks - called at top level
  const panelStyles = usePanelStyles(isCollapsed, false);
  const titleStyles = useTitleStyles();

  const handleSetMenuOpen = (event) => {
    setSetMenuAnchor(event.currentTarget);
  };

  const handleSetMenuClose = () => {
    setSetMenuAnchor(null);
  };

  // Count selected sets
  const selectedSetCount = Object.values(selectedSets).filter(Boolean).length;

  // Get subcategory count for a category
  const getActiveSubcategoryCount = (categoryId) => {
    if (!selectedSubcategories[categoryId]) return 0;
    return Object.values(selectedSubcategories[categoryId]).filter(Boolean).length;
  };

  // Menu content styles
  const menuPaperStyles = useMemo(() => ({
    maxHeight: 300,
    width: 350,
  }), []);

  return (
    <Paper
      elevation={0}
      sx={{
        ...panelStyles,
        p: isCollapsed ? 1 : 3,
      }}
    >
      {!isCollapsed ? (
        // Full sidebar content
        <>
          <Typography
            variant="subtitle1"
            sx={titleStyles}
          >
            Categories
          </Typography>

          {categories.map((category) => (
            <Box key={category.id}>
              <Box
                onClick={() => onCategorySelect(category.id)}
                sx={getCategoryItemStyles(selectedCategory === category.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    variant="body1"
                    sx={selectedCategory === category.id
                      ? { fontWeight: 500, fontSize: TYPOGRAPHY.fontSize.body1 }
                      : { fontWeight: 400, fontSize: TYPOGRAPHY.fontSize.body1 }}
                  >
                    {category.name}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Sets dropdown */}
                  <Tooltip title="Select Question Sets">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategorySelect(category.id);
                        handleSetMenuOpen(e);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <FolderOpenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Expand/collapse if it has subcategories */}
                  {category.subcategories.length > 0 && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newExpandedCategory = expandedCategory === category.id ? null : category.id;
                        onCategorySelect(category.id, newExpandedCategory);
                      }}
                    >
                      {expandedCategory === category.id ?
                        <ExpandLessIcon fontSize="small" /> :
                        <ExpandMoreIcon fontSize="small" />
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
                  <List dense sx={{ ml: 3, mt: 0, mb: 1.5 }}>
                    <ListItem
                      dense
                      sx={{ p: 0, mb: 0.75 }}
                    >
                      <Button
                        size="small"
                        onClick={() => onSelectAllSubcategories(category.id)}
                        sx={{ mr: 1, minWidth: 'auto', fontSize: TYPOGRAPHY.fontSize.caption }}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        onClick={() => onDeselectAllSubcategories(category.id)}
                        sx={{ minWidth: 'auto', fontSize: TYPOGRAPHY.fontSize.caption }}
                      >
                        None
                      </Button>
                    </ListItem>

                    {category.subcategories.map((subcategory) => {
                      const isSelected = subcategoryFilter === subcategory;

                      return (
                        <ListItem
                          key={subcategory}
                          dense
                          sx={getSubcategoryItemStyles(isSelected)}
                        >
                          <Box
                            sx={getSubcategoryLabelStyles()}
                            onClick={() => onSubcategorySelect(subcategory)}
                          >
                            <Typography
                              variant="body2"
                              sx={isSelected
                                ? { fontWeight: 500, fontSize: TYPOGRAPHY.fontSize.body1 }
                                : { fontWeight: 400, fontSize: TYPOGRAPHY.fontSize.body1 }}
                            >
                              {subcategory}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 28 }}>
                            <Checkbox
                              size="medium"
                              checked={selectedSubcategories[category.id]?.[subcategory] || false}
                              onChange={() => onSubcategoryToggle(category.id, subcategory)}
                              onClick={(e) => e.stopPropagation()}
                              sx={{ p: 0.5 }}
                            />
                          </Box>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </>
      ) : (
        // Collapsed sidebar with icons only
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="Categories" placement="right">
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <CategoryIcon color="primary" sx={{ fontSize: '1.6rem' }} />
            </Box>
          </Tooltip>

          {/* Show only icons for categories */}
          {categories.map((category) => {
            const activeSubcategoryCount = getActiveSubcategoryCount(category.id);

            return (
              <Tooltip key={category.id} title={category.name} placement="right">
                <Badge
                  badgeContent={activeSubcategoryCount}
                  color="primary"
                  invisible={activeSubcategoryCount === 0}
                  sx={{ mb: 1.5 }}
                >
                  <IconButton
                    onClick={() => onCategorySelect(category.id)}
                    sx={{
                      bgcolor: selectedCategory === category.id ? `${COLORS.primary.main}08` : 'transparent',
                      border: selectedCategory === category.id ? `1px solid ${COLORS.primary.main}20` : '1px solid transparent',
                    }}
                    size="medium"
                  >
                    {category.id === 'core-java' ? (
                      <FolderIcon fontSize="medium" color={selectedCategory === category.id ? "primary" : "action"} />
                    ) : category.id === 'concurrency-multithreading' ? (
                      <GridViewIcon fontSize="medium" color={selectedCategory === category.id ? "primary" : "action"} />
                    ) : (
                      <FolderIcon fontSize="medium" color={selectedCategory === category.id ? "primary" : "action"} />
                    )}
                  </IconButton>
                </Badge>
              </Tooltip>
            );
          })}
        </Box>
      )}

      {/* Question Sets Selection Menu */}
      <Menu
        anchorEl={setMenuAnchor}
        open={Boolean(setMenuAnchor)}
        onClose={handleSetMenuClose}
        slotProps={{ paper: { style: menuPaperStyles } }} // Fixed: Use slotProps instead of PaperProps
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontSize: TYPOGRAPHY.fontSize.body1 }}>
            Question Sets ({selectedSetCount}/{availableSets.length})
          </Typography>
          <Box>
            <Button
              size="small"
              onClick={() => {
                onSelectAllSets();
                handleSetMenuClose();
              }}
              sx={{ minWidth: 'auto', px: 1, fontSize: TYPOGRAPHY.fontSize.caption }}
            >
              All
            </Button>
            <Button
              size="small"
              onClick={() => {
                onDeselectAllSets();
                handleSetMenuClose();
              }}
              sx={{ minWidth: 'auto', px: 1, fontSize: TYPOGRAPHY.fontSize.caption }}
            >
              None
            </Button>
          </Box>
        </Box>
        <Divider />
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
            <ListItemText primary={<Typography sx={{ fontSize: TYPOGRAPHY.fontSize.body1 }}>{set.name}</Typography>} />
          </MenuItem>
        ))}
        {availableSets.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary={<Typography sx={{ fontSize: TYPOGRAPHY.fontSize.body1 }}>No question sets in this category</Typography>} />
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default CategorySidebar;