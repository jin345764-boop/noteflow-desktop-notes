// Ensure window.fetch has a setter in environments with getter-only Window.fetch
try {
  let _fetchHolder = typeof window !== 'undefined' && window.fetch ? window.fetch.bind(window) : undefined;
  if (typeof window !== 'undefined') {
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || desc.configurable) {
      Object.defineProperty(window, 'fetch', {
        get: () => _fetchHolder,
        set: (fn) => { _fetchHolder = fn; },
        configurable: true,
        enumerable: true
      });
    }
  }
} catch {
  // Ignore
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
