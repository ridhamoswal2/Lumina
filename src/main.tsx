import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handle root element not found
const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Fatal error: Root element not found. Unable to mount React application.");
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #0a0a0a;
      color: #fff;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="text-align: center; max-width: 400px; padding: 20px;">
        <h1 style="margin: 0 0 10px 0; font-size: 24px;">Failed to Load Application</h1>
        <p style="margin: 0 0 20px 0; color: #ccc;">
          The application failed to initialize. Please try:
        </p>
        <ul style="text-align: left; color: #aaa; margin-bottom: 20px;">
          <li>Refreshing the page</li>
          <li>Clearing your browser cache</li>
          <li>Disabling browser extensions</li>
          <li>Using a different browser</li>
        </ul>
        <button onClick="location.reload()" style="
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
        ">
          Reload Page
        </button>
      </div>
    </div>
  `;
  throw new Error("Cannot find root element with id 'root'");
}

// Global error handlers for unhandled errors
window.addEventListener("error", (event) => {
  console.error("Uncaught error:", event.error);
});

// Handle unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  // Prevent the application from crashing, let the error boundary handle it
});

createRoot(rootElement).render(<App />);
