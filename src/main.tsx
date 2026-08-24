import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initializePlatformEnvironment } from "./platform/runtime";
import { AppProvider } from "./state/AppContext";
import "./styles.css";
import "./platform/platform.css";

initializePlatformEnvironment();

const element = document.getElementById("root");
if (!element) throw new Error("Root element was not found.");

createRoot(element).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
);

const canUseWebServiceWorker = ["http:", "https:"].includes(window.location.protocol);
if ("serviceWorker" in navigator && import.meta.env.PROD && canUseWebServiceWorker) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
  });
}
