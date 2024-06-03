import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { showConfirm } from '../../utils';

import './nav.css'; // Import CSS/LESS file directly
import NaturalCritIcon from './naturalcrit.svg.jsx';

const Nav = () => {
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('author')) {
            setLogged(true);
        }
    }, []);

    const login = () => {
        const name = prompt('What is your name?');
        if (name) {
            localStorage.setItem('author', name);
            setLogged(true);
        }
    };

    const logout = () => {
        if (showConfirm('Are you sure you want to log out?')) {
            localStorage.removeItem('author');
            setLogged(false);
        }
    };

    const renderLogin = () => {
        if (logged) {
            return (
                <button className="navItem" onClick={logout}>
                    Logout
                </button>
            );
        } else {
            return (
                <button className="navItem" onClick={login}>
                    Login
                </button>
            );
        }
    };

    return (
        <nav className="nav">
            <div className="navSection">
                <a className="navItem logo" href="https://www.naturalcrit.com">
                    <NaturalCritIcon />
                    <span className="name">
                        Natural<span className="crit">Crit</span>
                    </span>
                </a>

                <a
                    className="navItem logo"
                    href="https://homebrewery.naturalcrit.com/"
                >
                    The Homebrewery
                </a>
            </div>

            <div className="navSection">
                <Link to="/" className="navItem">
                    Home
                </Link>
                <Link to="/builder/new" className="navItem">
                    Create new sheet
                </Link>
                <Link to="/sheets" className="navItem">
                    Sheets
                </Link>
                {renderLogin()}
            </div>
        </nav>
    );
};

export default Nav;
