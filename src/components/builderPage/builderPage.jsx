import React, { Component } from "react";
import GridLayout from "react-grid-layout";

//STYLES
import "./builderPage.css";
import "../../../node_modules/react-grid-layout/css/styles.css";
import "../../../node_modules/react-resizable/css/styles.css";

//CS BLOCKS
import LabelInput from "../draggables/labelInput";
import Textarea from "../draggables/textarea";
import StatInput from "../draggables/statInput";
import EmptySpace from "../draggables/emptySpace";

//OTHER COMPONENTS
import Nav from "../nav/navBar";


const buildingBlocks = [ 
    {
        name: "LabelInput",
        width: 4,
        height: 2
    },
    {
        name: "Textarea",
        width: 6,
        height: 6
    },
    {
        name: "StatInput",
        width: 2,
        height: 2
    },
    {
        name: "EmptySpace",
        width: 2,
        height: 2
    }
];



class Builder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: [],
            settings: {
                name: "Character sheet",
                columns: 12,
                rowHeight: 40,
                size: "Letter",
                height: null,
                width: null,
            },
        };
    }

    componentDidMount() {
        const savedLayout = localStorage.getItem("BuilderLayout");
        if (savedLayout) {
            this.setState({ layout: JSON.parse(savedLayout) });
        }
        const savedSettings = localStorage.getItem("sheetSettings");
        if (savedSettings) {
            console.table(savedSettings);
            this.setState({ settings: JSON.parse(savedSettings) });
        }
    }

    addNewItem = (componentName, width, height) => {
        //console.log(component);
        const layout = this.state.layout;
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
        const updatedLayout = layout
            .filter((item) => item.i !== itemId)
            .map((item, index) => ({
                ...item,
                i: `item-${index}`, // Reassigning IDs based on index
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

        //console.log("Updated Layout:", updatedLayout);
        this.setState({ layout: updatedLayout });
    };

    renderComponent = (name, key) => {
        const components = {
            LabelInput: <LabelInput key={key}/>,
            Textarea: <Textarea key={key}/>,
            StatInput: <StatInput key={key}/>,
            EmptySpace: <EmptySpace key={key}/>
        };
        
        return components[name] || null;
    };

    renderPicker = () => {
        return (
            <div className="picker">
                {buildingBlocks.map((block, index) => {
                        return <div className="item" key={index}>
                            <div className="component">
                                {this.renderComponent(block.name, index)}
                            </div>
                            <button
                            className="addItem"
                            onClick={() => this.addNewItem(block.name, block.width, block.height)}
                        >
                            Add
                        </button>
                        </div>                        
                    })}
            </div>
        );
    };

    renderDropDiv = () => {
        const layout = this.state.layout;
        const { columns, rowHeight, size, width, height } = this.state.settings;

        const getSize = (side) => {
            if (side === "height") {
                switch (size) {
                    case "letter":
                        return 1100;
                    case "A4":
                        return 1169;
                    case "A5":
                        return 827;
                    case "custom":
                        return height !== null ? height : 1056;
                    default:
                        return 1100;
                }
            }
            if (side === "width") {
                switch (size) {
                    case "letter":
                        return 816;
                    case "A4":
                        return 827;
                    case "A5":
                        return 583;
                    case "custom":
                        return width !== null ? width : 816;
                    default:
                        return 816;
                }
            }
        };

        return (
            <div>
                <GridLayout
                    className="layout"
                    layout={layout}
                    cols={columns}
                    rowHeight={rowHeight}
                    width={getSize("width")}
                    onLayoutChange={this.saveLayout}
                    style={{
                        width: getSize("width"),
                        height: getSize("height"),
                    }}
                >
                    {layout.map((item) => (
                        <div key={item.i}>
                            <button
                                className="deleteItem"
                                onClick={() => this.deleteItem(item.i)}
                            >
                                x
                            </button>
                            {this.renderComponent(item.componentName)}
                        </div>
                    ))}
                </GridLayout>
            </div>
        );
    };

    saveSettings = () => {
        const form = document.getElementById("settingsForm");
        const settings = {
            columns: Number(form.querySelector("#columns").value) || 12,
            size: form.querySelector("#size").value || "Letter",
            width: form.querySelector("#width")
                ? Number(form.querySelector("#width").value)
                : null,
            height: form.querySelector("#height")
                ? Number(form.querySelector("#height").value)
                : null,
            rowHeight: Number(form.querySelector("#rowHeight").value) || 40,
        };

        localStorage.setItem("sheetSettings", JSON.stringify(settings));

        this.setState({ settings: settings });
    };

    displayCustomInputs = () => {
        //console.log(this.state.settings);
        if (this.state.settings.size === "custom") {
            return (
                <div className="formGroup">
                    <label htmlFor="width">Width:</label>
                    <input
                        type="number"
                        id="width"
                        name="width"
                        min={300}
                        max={2000}
                        defaultValue={this.state.settings.width || 816}
                    />
                    <label htmlFor="height">Height:</label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        min={300}
                        max={3000}
                        defaultValue={this.state.settings.height || 1056}
                    />
                    <sub>Measurements in pixels.</sub>
                </div>
            );
        } else {
            return;
        }
    };

    renderSheetSettings = () => {
        return (
            <div id="settingsForm">
                <div className="formGroup">
                    <label htmlFor="columns">Columns:</label>
                    <input
                        id="columns"
                        type="number"
                        name="columns"
                        min={3}
                        defaultValue={this.state.settings.columns}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="rowHeight">Row height:</label>
                    <input
                        id="rowHeight"
                        type="number"
                        name="rowHeight"
                        min={20}
                        defaultValue={this.state.settings.rowHeight}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="size">Dimensions</label>
                    <select id="size" defaultValue={this.state.settings.size}>
                        <option value="Letter">
                            US Letter (215.9mm x 279.4mm)
                        </option>
                        <option value="A4">A4 (297mm x 210mm)</option>
                        <option value="A5">A5 148mm x 210mm</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                {this.displayCustomInputs()}

                <button
                    onClick={() => {
                        this.saveSettings();
                    }}
                >
                    Save settings
                </button>

                <button
                    onClick={() => {
                        window.print();
                    }}
                >
                    Export as pdf
                </button>
            </div>
        );
    };

    render() {
        return (
            <div className="Builder page">
                <Nav />

                <main className="content">
                    <aside className="sidebar">
                        <h2>Pick your component</h2>
                        {this.renderPicker()}
                    </aside>
                    <section id="create">
                        <h1>Create your own</h1>
                        <div className="drop">{this.renderDropDiv()}</div>
                    </section>
                    <section id="sheetSettings">
                        <h2>Sheet Settings</h2>
                        {this.renderSheetSettings()}
                    </section>
                </main>
            </div>
        );
    }
}

export default Builder;
