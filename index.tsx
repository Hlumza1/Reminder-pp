import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("Daily Water Ping: Initializing...");

const init = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Daily Water Ping: Root element not found");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Daily Water Ping: Application Mounted");
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}