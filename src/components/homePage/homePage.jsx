import React from 'react';
import './homePage.css';
import Nav from '../nav/navBar';

const Home = () => {
  return (
    <div className="home page">
      <Nav />
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