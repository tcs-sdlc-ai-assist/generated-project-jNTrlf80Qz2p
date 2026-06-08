import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.jsx';
import { createAppContainer } from './app/bootstrap.js';
import { initializeApp } from './app/initialization.js';
import { AppContainerProvider } from './contexts/appContainerContext.jsx';
import './index.css';

const container = createAppContainer();
const init = initializeApp(container);

if (!init.ready) {
  document.getElementById('root').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#ef4444;padding:2rem;text-align:center;">
      <div>
        <h1 style="font-size:1.5rem;font-weight:600;">localStorage Required</h1>
        <p style="margin-top:0.5rem;color:#78716c;">${init.error || 'localStorage is not available in this browser.'}</p>
      </div>
    </div>
  `;
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <AppContainerProvider container={container}>
          <App authService={container.authService} />
        </AppContainerProvider>
      </BrowserRouter>
    </StrictMode>,
  );
}