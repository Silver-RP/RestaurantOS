import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from "./layouts/AppLayout";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <AppLayout />
      </Router>
    </Provider>
  );
};

export default App;
