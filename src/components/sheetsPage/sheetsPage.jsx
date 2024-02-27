import React from 'react';
import Nav from '../nav/navBar';

const Home = () => {
  return (
    <div className="home page">
      <Nav />
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