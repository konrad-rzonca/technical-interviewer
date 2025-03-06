// src/utils/debounce.js
/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func The function to debounce
 * @param {number} wait The number of milliseconds to delay
 * @param {boolean} immediate Whether to invoke the function immediately
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per wait period
 *
 * @param {Function} func The function to throttle
 * @param {number} limit The number of milliseconds to throttle invocations to
 * @returns {Function} The throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;

  return function(...args) {
    const context = this;

    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default {debounce, throttle};