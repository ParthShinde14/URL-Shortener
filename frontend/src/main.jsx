import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster position="top-right" toastOptions={{ style: { background: "#1a1a1a", color: "#f0f0f0", border: "1px solid #2a2a2a" } }} />
    <App />
  </React.StrictMode>
);
