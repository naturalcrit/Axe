import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './styles/reset.css';
import './styles/main.css';
import { BuilderProvider, BuilderContext } from './components/builderPage/builderContext.jsx'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BuilderProvider>
            <App />
        </BuilderProvider>
    </React.StrictMode>
);
