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
import Settings from "../sheetSettings.jsx";

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
            console.table(JSON.parse(savedSettings));
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
            switch (side) {
                case "height":
                    switch (size) {
                        case "letter": return 1100;
                        case "A4": return 1169;
                        case "A5": return 827;
                        default: return height !== null ? height : 1056;
                    }
                case "width":
                    switch (size) {
                        case "letter": return 816;
                        case "A4": return 827;
                        case "A5": return 583;
                        default: return width !== null ? width : 816;
                    }
                default: return side === "height" ? 1100 : 816;
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

    handleSettingsSave = (newSettings) => {
        // Update parent component state with new settings
        this.setState({ settings: newSettings});
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
                        <Settings onSettingsSave={this.handleSettingsSave} />
                    </section>
                </main>
            </div>
        );
    }
}

export default Builder;
