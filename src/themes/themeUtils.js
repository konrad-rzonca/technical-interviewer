// src/themes/themeUtils.js
/**
 * Utility functions for theme management
 */

/**
 * Deep merge two objects with proper handling of arrays and nested objects
 * @param {Object} target The base object to merge into
 * @param {Object} source The object to merge from
 * @returns {Object} The merged object
 */
export const deepMerge = (target, source) => {
  if (!source) return target;

  const output = {...target};

  // Handle each property in the source object
  Object.keys(source).forEach(key => {
    const sourceValue = source[key];
    const targetValue = target[key];

    // If both values are objects that are not null, recursively merge
    if (
        sourceValue && typeof sourceValue === 'object' &&
        targetValue && typeof targetValue === 'object' &&
        !Array.isArray(sourceValue) && !Array.isArray(targetValue)
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    }
    // For arrays or primitive values, replace entirely
    else {
      output[key] = sourceValue;
    }
  });

  return output;
};

/**
 * Get the current theme name from environment variable
 * @returns {string} The theme name
 */
export const getThemeName = () => {
  return process.env.REACT_APP_THEME || 'base';
};

/**
 * Check if current theme is UBS theme
 * @returns {boolean} Whether UBS theme is active
 */
export const isUbsTheme = () => getThemeName().toLowerCase() === 'ubs';