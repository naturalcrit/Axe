import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css'; // Import CSS/LESS file directly
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LabelInput from './draggables/labelInput.jsx';


const Home = () => {
  return (
    <div className="home page">
      <nav className="nav">
        <Link to="/builder" className='navButton'>Builder</Link>
        <Link to="/sheets" className='navButton'>Sheets</Link>
      </nav>
      <main className="content">
        <aside className='sidebar'>
          <h2>Pick your draggable component</h2>
          <div className="picker">
            <DndProvider backend={HTML5Backend}>
              <LabelInput />
            </DndProvider>
          </div>
        </aside>
        <section id="create">
          <h1>Create your own</h1>
          

        </section>
      </main>
    </div>
  );
};

export default Home;