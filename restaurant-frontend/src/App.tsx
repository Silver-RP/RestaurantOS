import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from "./layouts/AppLayout";
import { ToastConfig } from "@components/common/ToastConfig";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastConfig />
        <AppLayout />
      </Router>
    </Provider>
  );
};

export default App;
