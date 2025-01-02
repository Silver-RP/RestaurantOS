import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import OrderOnlineSection from './components/Home/OrderOnline';

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orderonline" element={<OrderOnlineSection />} />
    </Routes>
  </Router>
  );
}

export default App