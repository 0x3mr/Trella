import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BoardProvider } from "./context/BoardProvider";
import './index.css'
import App from './App.jsx'

if (import.meta.env.DEV) {
  import("./services/api").then(({ worker }) => {
    worker.start({
      serviceWorker: {
        url: "/mockServiceWorker.js",
        options: { type: "module" },
      },
      onUnhandledRequest: "bypass",
    });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </StrictMode>,
)
