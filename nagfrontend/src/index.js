import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./home";
import Config from "./config";
import axios from "axios";
import reportWebVitals from "./reportWebVitals";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css"; //icons
import "primeflex/primeflex.css";

axios.defaults.baseURL = Config;
// Add the `ngrok-skip-browser-warning` header to bypass the warning
// axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
