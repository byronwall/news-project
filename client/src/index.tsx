import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

import axios from "axios";

export const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const axiosDefaultConfig = {
  baseURL: isDevelopment ? "http://localhost:5000" : "",
};

export const axiosInst = axios.create(axiosDefaultConfig);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
