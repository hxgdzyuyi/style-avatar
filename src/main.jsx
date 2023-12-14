import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.sass";
import store from "./store";
import avatar from "./avatar.json";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
