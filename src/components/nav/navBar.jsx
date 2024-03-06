import React from "react";
import { Link } from "react-router-dom";
import "./nav.css"; // Import CSS/LESS file directly
import NaturalCritIcon from "./naturalcrit.svg.jsx";

const Nav = () => {
    return (
        <nav className="nav">
            <div className="navSection">
                <a
                    className="navButton logo"
                    href="https://www.naturalcrit.com"
                >
                    <NaturalCritIcon />
                    <span className="name">
                        Natural<span className="crit">Crit</span>
                    </span>
                </a>
                <a
                    className="navButton HBLogo"
                    href="https://homebrewery.naturalcrit.com/"
                >
                    <span>The Homebrewery</span>
                </a>
                <a
                    className="navButton patreon"
                    href="https://www.patreon.com/NaturalCrit"
                >
                    help out
                    <i className="fa-solid fa-heart"></i>
                </a>
            </div>

            <div className="navSection">
                <Link to="/" className="navButton">
                    Home <i className="fa-solid fa-house"></i>
                </Link>
                <Link to="/builder" className="navButton">
                    Builder <i className="fa-solid fa-trowel-bricks"></i>
                </Link>
                <Link to="/sheets" className="navButton">
                    Sheets <i className="fa-regular fa-folder-open"></i>
                </Link>
            </div>
        </nav>
    );
};

export default Nav;
