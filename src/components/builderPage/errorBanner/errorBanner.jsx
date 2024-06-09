import './errorBanner.css';

import React from 'react';

const ErrorBanner = ({ error }) => {
    const { code, message } = error;

    return (
        <div className="errorBanner">
            <h1>Error {code}</h1>
            <hr />
            <h2>{message}</h2>
        </div>
    );
};

export default ErrorBanner;
