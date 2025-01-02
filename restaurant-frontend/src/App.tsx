import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Table from './components/table/Table';
import Contact from './components/contact/Contact';

function App() {

  return (
    <>
      <Header />
      <Footer />
      <Table />
      <Contact />
    </>
  );
}

export default App