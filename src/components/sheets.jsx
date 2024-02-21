import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css'; // Import CSS/LESS file directly
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DropDiv from './dropDiv.jsx';
import DraggableItem from './draggables/labelInput.jsx';


const Sheets = () => {
  let items = [];

  function handleDrop(item) {
    const id = items.length+1;
    const draggable = {id:id , content: item};

    items.push(draggable);
  }


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
            <DndProvider backend={HTML5Backend}>
              <DraggableItem name="Item1" />
            </DndProvider>
          </div>
        </aside>
        <section id="create">
          <h1>Create your own</h1>
          <div className="drop">
            <DndProvider backend={HTML5Backend}>
              <DropDiv type="item" onDrop={handleDrop(<DraggableItem/>)} items={items}/>
            </DndProvider>
          </div>
          <button>Export as pdf {items.length}</button>

        </section>
      </main>
    </div>
  );
};

export default Sheets;