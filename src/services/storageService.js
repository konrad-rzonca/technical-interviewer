// src/services/storageService.js
import {APP_CONSTANTS, STORAGE} from '../utils/constants';

// Debounce helper to prevent too many writes
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Storage Service
 * Handles saving and loading interview state to/from localStorage
 */
const storageService = {
  /**
   * Save interview state to localStorage
   * @param {Object} state - The interview state to save
   */
  saveInterviewState: (state) => {
    try {
      // Create a storage object with version info
      const storageObject = {
        version: APP_CONSTANTS.VERSION,
        timestamp: new Date().toISOString(),
        data: state,
      };

      localStorage.setItem(STORAGE.KEYS.INTERVIEW_STATE,
          JSON.stringify(storageObject));
    } catch (error) {
      console.error('Error saving interview state to localStorage:', error);
    }
  },

  /**
   * Load interview state from localStorage
   * @returns {Object|null} - The loaded interview state or null if not found
   */
  loadInterviewState: () => {
    try {
      const storedData = localStorage.getItem(STORAGE.KEYS.INTERVIEW_STATE);

      if (!storedData) {
        return null;
      }

      const parsedData = JSON.parse(storedData);

      // Basic version check - in the future, this could handle migrations
      if (parsedData.version !== APP_CONSTANTS.VERSION) {
        console.warn(
            'Stored data version mismatch. Some features may not work as expected.');
      }

      return parsedData.data;
    } catch (error) {
      console.error('Error loading interview state from localStorage:', error);
      return null;
    }
  },

  /**
   * Clear all saved interview data
   */
  clearInterviewState: () => {
    try {
      localStorage.removeItem(STORAGE.KEYS.INTERVIEW_STATE);
    } catch (error) {
      console.error('Error clearing interview state from localStorage:', error);
    }
  },

  /**
   * Check if localStorage is available
   * @returns {boolean} - Whether localStorage is available
   */
  isStorageAvailable: () => {
    try {
      const testKey = STORAGE.KEYS.TEST;
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
};

// Create debounced version of save function to prevent excessive writes
storageService.debouncedSaveInterviewState = debounce(
    storageService.saveInterviewState, STORAGE.DEBOUNCE_TIME);

export default storageService;