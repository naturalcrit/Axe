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
          <h1>Your sheets</h1>
          <p>This page is not ready yet</p>
        </section>
      </main>
    </div>
  );
};

export default Home;