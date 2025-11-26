// Entry point for the web application
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from '../src/App.jsx';

// Render the main React app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
