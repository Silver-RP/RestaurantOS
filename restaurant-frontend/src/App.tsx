import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ScrollToTop from "@components/common/ScrollToTop";
import QuickViewModal from "@components/pages/menu/QuickViewModal";
import AppRoutes from "./routers/index";
import AuthInitializer from "./utils/AuthInitializer";
import SearchModal from "@components/common/SearchModal";

import ToastSwitcher from "@components/common/ToastSwitcher";
import FullScreenOverlayLoading from "./components/common/FullScreenOverlayLoading";
import GlobalReservationModal from "./components/common/modals/GlobalReservationModal";
import GlobalOrderModal from "./components/common/modals/GlobalOrderModal";

const queryClient = new QueryClient();

const App = () => {
  
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <AuthInitializer /> 
        <Router>
        <FullScreenOverlayLoading />
          <ScrollToTop />
          <ToastSwitcher />
          <AppRoutes />
          <QuickViewModal /> 
          <SearchModal/>
          <GlobalReservationModal />
          <GlobalOrderModal/>
        </Router>
      </QueryClientProvider>
    </Provider>
    </GoogleOAuthProvider>
  );
};

export default App;