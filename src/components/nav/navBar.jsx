import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css'; // Import CSS/LESS file directly
import NaturalCritIcon from './naturalcrit.svg.jsx';

const Nav = () => {
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
                <Link to="/builder" className="navItem">
                    Builder
                </Link>
                <Link to="/sheets" className="navItem">
                    Sheets
                </Link>
            </div>
        </nav>
    );
};

export default Nav;
