import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from "./layouts/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastConfig } from "@components/common/ToastConfig";
import ScrollToTop from "@components/common/ScrollToTop";
import QuickViewModal from "@components/pages/menu/QuickViewModal";

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop />
          <ToastConfig />
          <AppLayout />
          <QuickViewModal /> 
        </Router>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;