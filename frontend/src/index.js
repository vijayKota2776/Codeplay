import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';


const resizeObserverErr =
  'ResizeObserver loop completed with undelivered notifications.';
const origConsoleError = window.console.error;
window.console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes(resizeObserverErr)) {
    return;
  }
  origConsoleError(...args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
