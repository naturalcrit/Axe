import React, { createContext, useState } from 'react';

import { showConfirm } from '../utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getAuthorFromStorage = () => {
        if (localStorage.getItem('author')) {
            return localStorage.getItem('author');
        }
        return null;
    };

    const [author, setAuthor] = useState(getAuthorFromStorage());
    const [logged, setLogged] = useState(!!author);

    const login = () => {
        const name = prompt('What is your name?');
        if (name) {
            localStorage.setItem('author', name);
            setAuthor(name);
            setLogged(true);
        }
    };

    const logout = () => {
        if (showConfirm('Are you sure you want to log out?')) {
            localStorage.removeItem('author');
            setAuthor(null);
            setLogged(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                logged,
                setLogged,
                author,
                setAuthor,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
