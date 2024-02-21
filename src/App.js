import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/homePage';
import Sheets from './components/sheets';
import Builder from './components/builder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sheets" element={<Sheets />} />
        <Route path='/builder' element={<Builder />}></Route>
        {/* Define more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;