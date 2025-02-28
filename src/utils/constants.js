// src/utils/constants.js
// This file contains shared constants for the application

// Layout dimensions
export const LAYOUT = {
  LEFT_SIDEBAR_WIDTH: 450, // 50% larger than original 300px
  RIGHT_SIDEBAR_WIDTH: 525, // 50% larger than original 350px
  COLLAPSED_SIDEBAR_WIDTH: 80, // Increased from 64px
  COLUMN_THRESHOLD: 1800, // Increased from 1600px
  TOP_HEADER_HEIGHT: 64
};

// Skill level styling
export const SKILL_LEVELS = {
  beginner: {
    label: "Basic",
    color: '#66bb6a',
    bgColor: '#e8f5e9' // Light green background
  },
  intermediate: {
    label: "Intermediate",
    color: '#ffb300',
    bgColor: '#fff8e1' // Light amber background
  },
  advanced: {
    label: "Advanced",
    color: '#fb8c00',
    bgColor: '#fff3e0' // Light orange background
  }
};

// Utility functions for styling
export const getSkillLevelColor = (level) => {
  return SKILL_LEVELS[level]?.color || '#9e9e9e'; // Gray default
};

export const getSkillLevelBackground = (level) => {
  return SKILL_LEVELS[level]?.bgColor || '#f5f5f5'; // Light gray default
};

export const getBorderOpacity = (level) => {
  if (level === 'intermediate') {
    return '60'; // Increased from 55% for better visibility
  }
  return '50';
};

export const getDotColor = (level) => {
  if (level === 'intermediate') {
    return '#ffe082'; // Less intense yellow for intermediate dots
  }
  return getSkillLevelColor(level);
};