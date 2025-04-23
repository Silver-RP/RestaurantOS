import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from "./layouts/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient(); 
import { ToastConfig } from "@components/common/ToastConfig";

const App = () => {
  return (
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastConfig />
        <AppLayout />
      </Router>
    </QueryClientProvider>
  </Provider>
  );
};

export default App;
