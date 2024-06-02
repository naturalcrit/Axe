import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
import { useParams } from 'react-router-dom'; // Import the useParams hook

//STYLES
import './builderPage.css';
import './sheet.css';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';

//COMPONENTS
import Nav from '../nav/navBar';
import Settings from '../sheetSettings/sheetSettings.jsx';

import draggableComponents from '../draggables/draggables.json';

class Builder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            layout: [],
            settings: {
                name: 'Character sheet',
                columns: 12,
                rowHeight: 40,
                size: 'Letter',
                height: null,
                width: null,
                background: '#ffffff',
                textColor: '#000000',
            },
        };
    }

    componentDidMount() {
        // Get the current URL
        const currentUrl = window.location.pathname;

        // Extract the id parameter from the URL
        const id = currentUrl.split('/').pop();

        // Check if id is not 'new'
        if (id !== 'new') {
            // Fetch the sheet data based on the ID
            fetch(`http://localhost:3050/api/sheet/${id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch sheet data');
                    }
                    return response.json();
                })
                .then((sheetData) => {
                    // Update state with the fetched sheet data
                    this.setState({
                        layout: JSON.parse(sheetData.layout),
                        settings: JSON.parse(sheetData.settings),
                    });
                })
                .catch((error) => {
                    console.error('Error fetching sheet data:', error);
                });
        } else {
            // If id is 'new', load layout and settings from local storage
            const savedLayout = localStorage.getItem('BuilderLayout');
            if (savedLayout) {
                this.setState({ layout: JSON.parse(savedLayout) });
            }
            const savedSettings = localStorage.getItem('sheetSettings');
            if (savedSettings) {
                this.setState({ settings: JSON.parse(savedSettings) });
            }
        }
    }

    addNewItem = (componentName, width, height, label) => {
        //console.log(component);
        const layout = this.state.layout;
        const newItem = {
            i: `item-${layout.length + 1}`,
            x: 0,
            y: 0,
            w: width,
            h: height,
            componentName: componentName,
            label: label,
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

        localStorage.setItem('BuilderLayout', JSON.stringify(updatedLayout));

        //console.log("Updated Layout:", updatedLayout);
        this.setState({ layout: updatedLayout });
    };

    renderComponent = (name, key) => {
        const components = {};

        // Dynamically import components based on the draggables JSON
        draggableComponents.forEach((item) => {
            components[item.name] = React.lazy(() =>
                import(`../draggables/${item.name}/${item.name}.jsx`)
            );
        });
        const Component = components[name];
        return (
            <React.Suspense fallback={<div>Loading...</div>}>
                <Component key={key} />
            </React.Suspense>
        );
    };

    renderPicker = () => {
        return (
            <div className="picker">
                {draggableComponents.map((item, index) => {
                    return (
                        <div className="item" key={index}>
                            <div className="label">
                                {
                                    item.name
                                        .replace(/([A-Z])/g, ' $1')
                                        .trim() /*format "ComponentName" into "Component Name" */
                                }
                            </div>
                            <div className="draggable-slot">
                                {this.renderComponent(item.name, index)}
                            </div>
                            <button
                                className="button addItem"
                                onClick={() =>
                                    this.addNewItem(
                                        item.name,
                                        item.width,
                                        item.height,
                                        item.label
                                    )
                                }
                            >
                                Add
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    renderDropDiv = () => {
        const layout = this.state.layout;
        const {
            columns,
            rowHeight,
            size,
            width,
            height,
            background,
            textColor,
        } = this.state.settings;

        const getSize = (side) => {
            switch (side) {
                case 'height':
                    switch (size) {
                        case 'letter':
                            return 1100;
                        case 'A4':
                            return 1169;
                        case 'A5':
                            return 827;
                        default:
                            return height !== null ? height : 1056;
                    }
                case 'width':
                    switch (size) {
                        case 'letter':
                            return 816;
                        case 'A4':
                            return 827;
                        case 'A5':
                            return 583;
                        default:
                            return width !== null ? width : 816;
                    }
                default:
                    return side === 'height' ? 1100 : 816;
            }
        };

        return (
            <GridLayout
                className="layout sheet"
                layout={layout}
                cols={columns}
                rowHeight={rowHeight}
                width={getSize('width')}
                onLayoutChange={this.saveLayout}
                compactType={null}
                preventCollision={true}
                style={{
                    width: getSize('width'),
                    height: getSize('height'),
                    background: background,
                    color: textColor,
                }}
            >
                {layout.map((item) => (
                    <div className="draggable-item" key={item.i}>
                        <button
                            className="deleteItem"
                            onClick={() => this.deleteItem(item.i)}
                            onMouseDown={(event) => event.stopPropagation()}
                        >
                            x
                        </button>
                        {this.renderComponent(item.componentName)}
                    </div>
                ))}
            </GridLayout>
        );
    };

    handleSettingsSave = (newSettings) => {
        // Update parent component state with new settings
        this.setState({ settings: newSettings });
    };

    saveSheet = async () => {
        const sheet = {
            id: 'abc',
            title: 'yesTitle',
            layout: JSON.stringify(this.state.layout),
            settings: JSON.stringify(this.state.settings),
            author: localStorage.getItem('author')
                ? localStorage.getItem('author')
                : '',
        };
        try {
            const response = await fetch('http://localhost:3050/api/sheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sheet),
            });
            const data = await response.json();
            console.log('Sheet created:', data);
        } catch (error) {
            console.error('Error creating sheet:', error);
            console.error(sheet);
        }
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
                        <h1>Create your own character sheet</h1>
                        <div className="drop">{this.renderDropDiv()}</div>
                    </section>
                    <section id="sheetSettings">
                        <Settings
                            onSettingsSave={this.handleSettingsSave}
                            onSave={this.saveSheet}
                        />
                    </section>
                </main>
            </div>
        );
    }
}

export default Builder;
