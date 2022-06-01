import React from "react";
import ReactDOM from "react-dom/client";

import "./Components/Main/MainSCSS/css-index";

import App from "./Components/Main/App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
