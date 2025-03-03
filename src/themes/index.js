// src/themes/index.js
import createBaseTheme from './baseTheme';
import createCorporateTheme from './corporateTheme';
import {getThemeName, isCorporateTheme} from './themeUtils';

/**
 * Create theme based on configuration
 * @param {Object} options Additional theme options to pass
 * @returns {Object} The configured MUI theme
 */
export const createAppTheme = (options = {}) => {
  const themeName = getThemeName();

  // Select theme based on environment variable
  if (themeName.toLowerCase() === 'corporate') {
    console.log('Using Corporate theme');
    return createCorporateTheme(options);
  } else {
    console.log('Using base theme');
    return createBaseTheme(options);
  }
};

// Re-export theme constants for use in the app
export * from './baseTheme';

// Export isCorporateTheme helper
export {isCorporateTheme};

export default createAppTheme;