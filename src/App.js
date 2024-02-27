import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/homePage';
import Sheets from './components/sheetsPage';
import Builder from './components/builderPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sheets" element={<Sheets />} />
        <Route path='/builder' element={<Builder />}/>
        {/* Define more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;