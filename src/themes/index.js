// src/themes/index.js
import createBaseTheme from './baseTheme';
import createCorporateTheme from './corporateTheme';
import {getThemeName} from './themeUtils';

/**
 * Create theme based on configuration
 * @param {Object} options Additional theme options to pass
 * @returns {Object} The configured MUI theme
 */
export const createAppTheme = (options = {}) => {
  const themeName = getThemeName();

  //return createCorporateTheme(options);
  // Select theme based on configuration
  switch (themeName.toLowerCase()) {
    case 'corporate':
      console.log('Using Corporate theme');
      return createCorporateTheme(options);

    case 'base':
    default:
      console.log('Using base theme');
      return createBaseTheme(options);
  }
};

// Re-export theme constants for use in the app
export * from './baseTheme';

// Export isCorporateTheme helper
export const isCorporateTheme = () => getThemeName().toLowerCase() === 'corporate';
//export const isCorporateTheme = () => true;

export default createAppTheme;