import React from "react";
import ReactDOM from "react-dom/client";
import App from "./views/Popup/App";
import "./index.css";

// React 18+ uses createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
