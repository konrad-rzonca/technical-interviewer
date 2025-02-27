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
  Tooltip
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

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
  onDeselectAllSets
}) => {
  const [setMenuAnchor, setSetMenuAnchor] = React.useState(null);

  const handleSetMenuOpen = (event) => {
    setSetMenuAnchor(event.currentTarget);
  };

  const handleSetMenuClose = () => {
    setSetMenuAnchor(null);
  };

  // Count selected sets
  const selectedSetCount = Object.values(selectedSets).filter(Boolean).length;

  return (
    <Paper
      elevation={0}
      sx={{
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        mr: 2,
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'auto'
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
        Categories
      </Typography>

      {categories.map((category) => (
        <Box key={category.id}>
          <Box
            onClick={() => onCategorySelect(category.id)}
            sx={{
              p: 1.5,
              mb: 0.5,
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
              <Typography variant="body1">{category.name}</Typography>
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
              <List dense sx={{ ml: 2, mt: 0, mb: 1 }}>
                <ListItem
                  dense
                  sx={{ p: 0, mb: 0.5 }}
                >
                  <Button
                    size="small"
                    onClick={() => onSelectAllSubcategories(category.id)}
                    sx={{ mr: 1, minWidth: 'auto', fontSize: '0.7rem' }}
                  >
                    All
                  </Button>
                  <Button
                    size="small"
                    onClick={() => onDeselectAllSubcategories(category.id)}
                    sx={{ minWidth: 'auto', fontSize: '0.7rem' }}
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
                      mb: 0.5,
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
                          p: 0.5,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.04)',
                            borderRadius: 1
                          }
                        }}
                        onClick={() => onSubcategorySelect(subcategory)}
                      >
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                          {subcategory}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 28 }}>
                        <Checkbox
                          size="small"
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

      {/* Question Sets Selection Menu */}
      <Menu
        anchorEl={setMenuAnchor}
        open={Boolean(setMenuAnchor)}
        onClose={handleSetMenuClose}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: 300,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">
            Question Sets ({selectedSetCount}/{availableSets.length})
          </Typography>
          <Box>
            <Button
              size="small"
              onClick={() => {
                onSelectAllSets();
                handleSetMenuClose();
              }}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              All
            </Button>
            <Button
              size="small"
              onClick={() => {
                onDeselectAllSets();
                handleSetMenuClose();
              }}
              sx={{ minWidth: 'auto', px: 1 }}
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
                size="small"
              />
            </ListItemIcon>
            <ListItemText primary={set.name} />
          </MenuItem>
        ))}
        {availableSets.length === 0 && (
          <MenuItem disabled>
            <ListItemText primary="No question sets in this category" />
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default CategorySidebar;