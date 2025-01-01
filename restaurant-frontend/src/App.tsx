import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

function App() {

  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default App