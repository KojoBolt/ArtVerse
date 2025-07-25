import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.tsx'
import '~/index.css'
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '~/components/ErrorBoundary';
import { ToastProvider } from '~/components/ToastProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
