// src/components/CategorySidebar.js
import React, { useState } from 'react';
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
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridViewIcon from '@mui/icons-material/GridView';

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
  const [setMenuAnchor, setSetMenuAnchor] = React.useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid #cccccc',
        borderRadius: 2,
        overflow: 'auto',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        p: isCollapsed ? 1 : 3,
      }}
    >
      {!isCollapsed ? (
        // Full sidebar content
        <>
          <Typography variant="subtitle1" sx={{
            mb: 2,
            fontWeight: 500,
            fontSize: '1.35rem' // Standardized title size
          }}>
            Categories
          </Typography>

          {categories.map((category) => (
            <Box key={category.id}>
              <Box
                onClick={() => onCategorySelect(category.id)}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === category.id ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                  border: selectedCategory === category.id ? '1px solid rgba(33, 150, 243, 0.2)' : '1px solid transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{
                    fontSize: '1.15rem', // Standardized category name size
                    fontWeight: selectedCategory === category.id ? 500 : 400
                  }}>
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
                        sx={{ mr: 1, minWidth: 'auto', fontSize: '0.95rem' }}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        onClick={() => onDeselectAllSubcategories(category.id)}
                        sx={{ minWidth: 'auto', fontSize: '0.95rem' }}
                      >
                        None
                      </Button>
                    </ListItem>

                    {category.subcategories.map((subcategory) => (
                      <ListItem
                        key={subcategory}
                        dense
                        sx={{
                          p: 0,
                          mb: 0.75,
                          bgcolor: subcategoryFilter === subcategory ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                          borderRadius: 1
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          justifyContent: 'space-between',
                          pr: 1 // Extra padding on the right
                        }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flex: 1,
                              p: 0.75,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                borderRadius: 1
                              }
                            }}
                            onClick={() => onSubcategorySelect(subcategory)}
                          >
                            <Typography variant="body2" sx={{
                              fontSize: '1.15rem', // Standardized subcategory name size
                              fontWeight: subcategoryFilter === subcategory ? 500 : 400
                            }}>
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
                        </Box>
                      </ListItem>
                    ))}
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
                      bgcolor: selectedCategory === category.id ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                      border: selectedCategory === category.id ? '1px solid rgba(33, 150, 243, 0.2)' : '1px solid transparent',
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
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 350,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontSize: '1.15rem' }}>
            Question Sets ({selectedSetCount}/{availableSets.length})
          </Typography>
          <Box>
            <Button
              size="small"
              onClick={() => {
                onSelectAllSets();
                handleSetMenuClose();
              }}
              sx={{ minWidth: 'auto', px: 1, fontSize: '0.95rem' }}
            >
              All
            </Button>
            <Button
              size="small"
              onClick={() => {
                onDeselectAllSets();
                handleSetMenuClose();
              }}
              sx={{ minWidth: 'auto', px: 1, fontSize: '0.95rem' }}
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
            <ListItemText primary={<Typography sx={{ fontSize: '1.15rem' }}>{set.name}</Typography>} />
          </MenuItem>
        ))}
        {availableSets.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary={<Typography sx={{ fontSize: '1.15rem' }}>No question sets in this category</Typography>} />
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default CategorySidebar;