import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import { Link } from "react-router-dom";
import "../styles/main.css"; // Import CSS/LESS file directly
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import "../styles/sheet.css";
import LabelInput from "./draggables/labelInput";
import Textarea from "./draggables/textarea";
import StatInput from  "./draggables/statInput";

const Builder = () => {
  const [layout, setLayout] = useState([]);

  const addNewItem = (item, width, height) => {
    const newItem = {
      i: `item-${layout.length + 1}`,
      x: 0,
      y: 0,
      w: width,
      h: height,
      content: item,
    };
    setLayout((prevLayout) => [...prevLayout, newItem]);
  };

  const deleteItem = (itemId) => {
    setLayout((prevLayout) => prevLayout.filter((item) => item.i !== itemId));
  };

  const renderPicker = () => {
    return (
      <div className="picker">
        <div className="item">
          <LabelInput />
          <button className="addItem" onClick={() => addNewItem(<LabelInput />, 2, 1)}>Add</button>
        </div>
        <div className="item">
          <Textarea />
          <button className="addItem" onClick={() => addNewItem(<Textarea />, 3, 3)}>Add</button>
        </div>
        <div className="item">
          <StatInput />
          <button className="addItem" onClick={() => addNewItem(<StatInput />, 1, 1)}>Add</button>
        </div>
      </div>
    );
  };

  const renderDropDiv = () => {
    console.log(layout);

    return (
      <div>
        <GridLayout
          className="layout"
          layout={layout}
          cols={6}
          rowHeight={100}
          width={816}
        >
          {layout.map((item) => (
            <div key={item.i}>
              <button className="deleteItem" onClick={() => deleteItem(item.i)}>x</button>
              {/* Render your component here */}
                {item.content}
            </div>
          ))}
        </GridLayout>
      </div>
    );
  };

  return (
    <div className="Builder page">
      <nav className="nav">
        <Link to="/builder" className="navButton">
          Builder
        </Link>
        <Link to="/sheets" className="navButton">
          Sheets
        </Link>
      </nav>
      <main className="content">
        <aside className="sidebar">
          <h2>Pick your draggable component</h2>
          {renderPicker()}
        </aside>
        <section id="create">
          <h1>Create your own</h1>
          <div className="drop">{renderDropDiv()}</div>
          <button onClick={() => {alert('This is not ready yet bro')}}>Export as pdf</button>
        </section>
      </main>
    </div>
  );
};

export default Builder;
