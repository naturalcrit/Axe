import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root")

require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

const root = ReactDOM.createRoot(container);
root.render(
<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</React.StrictMode>
);
