import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css'; // Import CSS/LESS file directly
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import '../styles/sheet.css';
import DropDiv from './dropDiv';


const Sheets = () => {
  return (
    <div className="Sheets page">
      <nav className="nav">
        <Link to="/builder" className='navButton'>Builder</Link>
        <Link to="/sheets" className='navButton'>Sheets</Link>
      </nav>
      <main className="content">
        <aside className='sidebar'>
          <h2>Pick your draggable component</h2>
          <div className="picker">
            
          </div>
        </aside>
        <section id="create">
          <h1>Create your own</h1>
          <div className="drop">
            <DropDiv></DropDiv>
          </div>
          <button>Export as pdf</button>

        </section>
      </main>
    </div>
  );
};

export default Sheets;