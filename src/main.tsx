import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";
import {store} from "./redux/app/store"
import { Provider } from 'react-redux';
import { ToastProvider } from "./components/Toast";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastProvider>
      <App />
      </ToastProvider>
      </Provider> 
  </React.StrictMode>
);
