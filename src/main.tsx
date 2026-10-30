import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker in production
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('DLAB Service Worker registered with scope: ', reg.scope);
      })
      .catch((err) => {
        console.warn('DLAB Service Worker registration failed: ', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
