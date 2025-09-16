import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Global styles for the app
import './index.css'; // Global styles for the app

// Ensure the root element exists in index.html
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Root element not found. Ensure 'root' div exists in index.html.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);