import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css'; // Import CSS/LESS file directly

const Home = () => {
  return (
    <div className="home page">
      <nav className="nav">
        <Link to="/builder" className='navButton'>Builder</Link>
        <Link to="/sheets" className='navButton'>Sheets</Link>
      </nav>
      <main className="content">
        <section id="about">
          <h1>About SheetBuilder</h1>
          <p>SheetBuilder is a web application that allows users to build and share custom character sheets for any RPG out there, using a simple Drag n Drop system</p>
        </section>
      </main>
    </div>
  );
};

export default Home;