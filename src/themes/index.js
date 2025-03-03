// src/themes/index.js
import createBaseTheme from './baseTheme';
import createUbsTheme from './ubsTheme';
import {getThemeName} from './themeUtils';

/**
 * Create theme based on configuration
 * @param {Object} options Additional theme options to pass
 * @returns {Object} The configured MUI theme
 */
export const createAppTheme = (options = {}) => {
  const themeName = getThemeName();

  //return createUbsTheme(options);
  // Select theme based on configuration
  switch (themeName.toLowerCase()) {
    case 'ubs':
      console.log('Using UBS theme');
      return createUbsTheme(options);

    case 'base':
    default:
      console.log('Using base theme');
      return createBaseTheme(options);
  }
};

// Re-export theme constants for use in the app
export * from './baseTheme';

// Export isUbsTheme helper
export const isUbsTheme = () => getThemeName().toLowerCase() === 'ubs';
//export const isUbsTheme = () => true;

export default createAppTheme;