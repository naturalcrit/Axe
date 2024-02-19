import React from "react";
import {Route, Routes } from "react-router-dom";

import  HomePage from './components/homePage.jsx';

const  App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage />}></Route>
            </Routes>
        </div>
    );
};

export default App;