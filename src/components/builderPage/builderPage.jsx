import React, {
    useState,
    useCallback,
    useEffect,
    lazy,
    Suspense,
    useRef,
    useContext,
} from 'react';
import GridLayout from 'react-grid-layout';
import { BuilderContext } from './builderContext.jsx';

// STYLES
import './builderPage.css';
import './sheet.css';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';

// COMPONENTS
import Nav from '../nav/navBar';
import Settings from './sheetSettings/sheetSettings';
import draggableComponents from '../draggables/draggables.json';
import FileOperationsButtons from './fileOperationsButtons/fileOperationsButtons';
import StyleEditor from './styleEditor/styleEditor';

const STYLEKEY = 'styleCode';
const SETTINGSKEY = 'sheetSettings';
const LAYOUTKEY = 'builderLayout';

const Builder = () => {

    const {
        layout,
        style,
        settings,
        setLayout,
        setStyle,
        setSettings,
        addNewItem,
        deleteItem,
        saveLayout,
        STYLEKEY,
        SETTINGSKEY,
        LAYOUTKEY,
    } = useContext(BuilderContext);

    const styleInStorage = window.localStorage.getItem(STYLEKEY);

    //  TODO: make sure styleEditor does not touch localstorage, it should send the styles here to be set in local or db whenever i save the sheet.

    useEffect(() => {
        const currentUrl = window.location.pathname;
        const id = currentUrl.split('/').pop();

        if (id !== 'new') {
            fetch(`http://localhost:3050/api/sheet/${id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch sheet data');
                    }
                    return response.json();
                })
                .then((sheetData) => {
                    console.log(sheetData.style);
                    setLayout(JSON.parse(sheetData.layout));
                    setSettings(JSON.parse(sheetData.settings));
                    if (sheetData.style) setStyle(sheetData.style);
                })
                .catch((error) => {
                    console.error('Error fetching sheet data:', error);
                });
        } else {
            const savedLayout = localStorage.getItem(LAYOUTKEY);
            if (savedLayout) {
                setLayout(JSON.parse(savedLayout));
            }
            const savedSettings = localStorage.getItem(SETTINGSKEY);
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        }
    }, []);

    const renderComponent = (name, key) => {
        const components = {};

        draggableComponents.forEach((item) => {
            components[item.name] = lazy(() =>
                import(`../draggables/${item.name}/${item.name}.jsx`)
            );
        });
        const Component = components[name];
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Component key={key} />
            </Suspense>
        );
    };

    const renderPicker = () => (
        <div className="picker">
            {draggableComponents.map((item, index) => (
                <div className="item" key={index}>
                    <div className="label">
                        {item.name.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="draggable-slot">
                        {renderComponent(item.name, index)}
                    </div>
                    <button
                        className="button addItem"
                        onClick={() =>
                            addNewItem(
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
            ))}
        </div>
    );

    const getSize = (side) => {
        
        const { size, height, width } = settings;
        const sizes = {
            letter: { width: 816, height: 1100 },
            A4: { width: 827, height: 1169 },
            A5: { width: 583, height: 827 },
            custom: { width: width, height: height },
        };

        return sizes[size] ? sizes[size][side] : side === 'height' ? 1056 : 816;
    };

    const renderDropDiv = () => {
        const { columns, rowHeight, background, textColor } = settings;

        return (
            <GridLayout
                className="layout sheet"
                layout={layout}
                cols={columns}
                rowHeight={rowHeight}
                width={getSize('width')}
                onLayoutChange={saveLayout}
                compactType={null}
                preventCollision
                style={{
                    width: getSize('width'),
                    height: getSize('height'),
                    background,
                    color: textColor,
                }}
            >
                {layout.map((item) => (
                    <div className="draggable-item" key={item.i}>
                        <button
                            className="deleteItem"
                            onClick={() => deleteItem(item.i)}
                            onMouseDown={(event) => event.stopPropagation()}
                        >
                            x
                        </button>
                        {renderComponent(item.componentName)}
                    </div>
                ))}
            </GridLayout>
        );
    };

    const settingsTabButton = useRef(null);
    const styleEditorTabButton = useRef(null);
    const settingsTab = useRef(null);
    const styleEditorTab = useRef(null);

    const changeTab = (e) => {
        const tab = e.target.className.split(' ')[0];

        if (tab === 'settings') {
            settingsTab.current.classList.add('active');
            styleEditorTab.current.classList.remove('active');
        }
        if (tab === 'styleEditor') {
            styleEditorTab.current.classList.add('active');
            settingsTab.current.classList.remove('active');
        }
    };

    return (
        <div className="Builder page">
            <Nav />
            <main className="content">
                <aside className="sidebar">
                    <h2>Pick your component</h2>
                    {renderPicker()}
                </aside>
                <section id="create">
                    <h1>Create your own character sheet</h1>
                    <div className="drop">{renderDropDiv()}</div>
                </section>
                <aside id="sheetOptions">
                    <nav className="tabButtons">
                        <button
                            className="settings button"
                            ref={settingsTabButton}
                            onClick={changeTab}
                        >
                            Settings
                        </button>
                        <button
                            className="styleEditor button"
                            ref={styleEditorTabButton}
                            onClick={changeTab}
                        >
                            Styles
                        </button>
                    </nav>
                    <div className="tabs">
                        <div className="tab settings active" ref={settingsTab}>
                            <Settings />
                        </div>
                        <div className="tab styleEditor" ref={styleEditorTab}>
                            <StyleEditor />
                        </div>
                    </div>
                    <FileOperationsButtons />
                </aside>
            </main>
        </div>
    );
};

export default Builder;
