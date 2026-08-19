import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AppProvider } from "./state/AppContext";
import "./styles.css";
const element=document.getElementById("root");if(!element)throw new Error("Root element was not found.");createRoot(element).render(<StrictMode><AppProvider><App/></AppProvider></StrictMode>);if("serviceWorker" in navigator&&import.meta.env.PROD){window.addEventListener("load",()=>{void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);});}
