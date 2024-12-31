import './App.css';
// import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Register from './pages/Register';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App
