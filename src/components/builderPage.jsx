import React, { Component } from "react";
import GridLayout from "react-grid-layout";
import { Link } from "react-router-dom";
import "../styles/main.css"; // Import CSS/LESS file directly
import "../../node_modules/react-grid-layout/css/styles.css";
import "../../node_modules/react-resizable/css/styles.css";
import "../styles/builder.css";
import LabelInput from "./draggables/labelInput";
import Textarea from "./draggables/textarea";
import StatInput from "./draggables/statInput";

class Builder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layout: []
    };
  }

  componentDidMount() {
    const savedLayout = localStorage.getItem("BuilderLayout");
    console.log('saved layout in local when didmount', JSON.parse(savedLayout));
    if (savedLayout) {
      this.setState({ layout: JSON.parse(savedLayout) });
    }
    
    console.log('this.state.layout didMount:',this.state.layout);
  }

  addNewItem = (componentName, width, height) => {
    //console.log(component);
    const { layout } = this.state;
    const newItem = {
      i: `item-${layout.length + 1}`,
      x: 0,
      y: 0,
      w: width,
      h: height,
      componentName: componentName,
    };
    this.setState({ layout: [...layout, newItem] });
  };

  deleteItem = (itemId) => {
    const { layout } = this.state;
    const updatedLayout = layout.filter(item => item.i !== itemId).map((item, index) => ({
      ...item,
      i: `item-${index}` // Reassigning IDs based on index
    }));
    this.setState({ layout: updatedLayout });
  };

  saveLayout = (newLayout) => {
    const { layout } = this.state;
    const updatedLayout = newLayout.map((item, index) => ({
      ...layout[index],
      ...item,
      i: `item-${index}`, // Reassigning IDs based on index
    }));

    localStorage.setItem("BuilderLayout", JSON.stringify(updatedLayout));
    const savedLayout = localStorage.getItem("BuilderLayout");
    console.log('localStorage when saving', JSON.parse(savedLayout));

    console.log("Updated Layout:", updatedLayout);
    this.setState({ layout: updatedLayout });
  };
  renderComponent = (name) => {
    // Dynamically render the component using JSX syntax and string interpolation
    switch (name) {
      case 'LabelInput':
        return <LabelInput />;
      case 'Textarea':
        return <Textarea />;
      case 'StatInput':
        return <StatInput />;
      default:
        return null; // or handle unrecognized component name
    }
  }

  renderPicker = () => {
    return (
      <div className="picker">
        <div className="item">
          <LabelInput />
          <button
            className="addItem"
            onClick={() => this.addNewItem('LabelInput', 4, 2)}
          >
            Add
          </button>
        </div>
        <div className="item">
          <Textarea />
          <button
            className="addItem"
            onClick={() => this.addNewItem('Textarea', 6, 6)}
          >
            Add
          </button>
        </div>
        <div className="item">
          <StatInput />
          <button
            className="addItem"
            onClick={() => this.addNewItem('StatInput', 2, 2)}
          >
            Add
          </button>
        </div>
      </div>
    );
  };

  renderDropDiv = () => {
    //console.log(this.state)
    const layout = this.state.layout;

    if (layout.length !== 0) {console.table(layout);}

    return (
      <div>
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={50}
          width={816}
          onLayoutChange={this.saveLayout}
        >
          {layout.map((item) => (
            <div key={item.i}>
              <button className="deleteItem" onClick={() => this.deleteItem(item.i)}>
                x
              </button>
              {this.renderComponent(item.componentName)}
            </div>
          ))}
        </GridLayout>
      </div>
    );
  };

  render() {
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
            <h2>Pick your component</h2>
            {this.renderPicker()}
          </aside>
          <section id="create">
            <h1>Create your own</h1>
            <div className="drop">{this.renderDropDiv()}</div>
            <button
              onClick={() => {
                alert("This is not ready yet bro");
              }}
            >
              Export as pdf
            </button>
          </section>
        </main>
      </div>
    );
  }
}

export default Builder;
