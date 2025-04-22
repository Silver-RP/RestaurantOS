import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from "./layouts/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient(); 
const App = () => {
  return (
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastContainer />
        <AppLayout />
      </Router>
    </QueryClientProvider>
  </Provider>
  );
};

export default App;
