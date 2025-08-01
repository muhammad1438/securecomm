// Web polyfills for React Native components
import { Platform } from 'react-native';

// Add any web-specific polyfills here
if (Platform.OS === 'web') {
  // Polyfill for crypto if needed
  if (typeof global === 'undefined') {
    (window as any).global = window;
  }
  
  // Polyfill for process
  if (typeof process === 'undefined') {
    (window as any).process = { env: {} };
  }
}

export {};