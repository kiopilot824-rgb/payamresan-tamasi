import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initI18n } from './i18n/index.js'

initI18n()

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(<App />)
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              registration.waiting?.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      })
      .catch(() => null);
  });
}
