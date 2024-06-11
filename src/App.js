import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/homePage/homePage.jsx';
import Sheets from './components/sheetsPage/sheetsPage.jsx';
import Builder from './components/builderPage/builderPage.jsx';
import { BuilderProvider } from './components/builderPage/builderContext.jsx'; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sheets" element={<Sheets />} />
                <Route
                    path="/builder/new"
                    element={
                        <BuilderProvider>
                            <Builder />
                        </BuilderProvider>
                    }
                />
                <Route
                    path="/builder/:id"
                    element={
                        <BuilderProvider>
                            <Builder />
                        </BuilderProvider>
                    }
                />
                {/* Define more routes here if needed */}
            </Routes>
        </Router>
    );
}

export default App;
