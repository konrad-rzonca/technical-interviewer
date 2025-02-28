// src/index.js - Updated with no CSS imports
import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

// Suppress ResizeObserver error messages in the console
const suppressResizeObserverErrors = () => {
  const originalError = window.console.error;
  window.console.error = (...args) => {
    // Don't log ResizeObserver loop errors
    if (args[0] && typeof args[0] === 'string' &&
        args[0].includes('ResizeObserver loop') &&
        args[0].includes('notifications')) {
      return;
    }
    originalError.apply(window.console, args);
  };
};

// Apply error suppression
suppressResizeObserverErrors();

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>,
);