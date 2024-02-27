import React from "react";
import { Link } from "react-router-dom";
import "./nav.css"; // Import CSS/LESS file directly
import NaturalCritIcon from "./naturalcrit.svg.jsx";

const Nav = () => {
    return (
        <nav className="nav">
            <div className="navSection">
                <div>
                    <a className="navButton" href="https://www.naturalcrit.com">
                        <NaturalCritIcon />
                        <span className="name">
                            Natural<span className="crit">Crit</span>
                        </span>
                    </a>
                </div>
                <a
                    className="navButton"
                    href="https://homebrewery.naturalcrit.com/"
                >
                    The Homebrewery
                </a>
            </div>

            <div className="navSection">
                <Link to="/" className="navButton">
                    Home
                </Link>
                <Link to="/builder" className="navButton">
                    Builder
                </Link>
                <Link to="/sheets" className="navButton">
                    Sheets
                </Link>
            </div>
        </nav>
    );
};

export default Nav;
