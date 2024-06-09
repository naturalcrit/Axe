import React, {
    useState,
    useEffect,
    lazy,
    Suspense,
    useRef,
    useContext,
} from 'react';
import GridLayout from 'react-grid-layout';
import { BuilderContext } from './builderContext.jsx';
import { AuthContext } from '../authContext.jsx';

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
import ErrorBanner from './errorBanner/errorBanner.jsx';

const Builder = () => {
    const {
        id,
        layout,
        setLayout,
        style,
        setStyle,
        settings,
        setSettings,

        addNewItem,
        deleteItem,
        saveLayout,

        STYLEKEY,
        SETTINGSKEY,
        LAYOUTKEY,
    } = useContext(BuilderContext);

    const { logged, author } = useContext(AuthContext);

    const [error, setError] = useState({
        code: null,
        message: '',
    });

    useEffect(() => {
        if (!id) {
            fetchNew();
        } else {
            if (!logged) {
                setError({
                    code: 401,
                    message: `You are not logged in.`,
                });
            } else {
                setError({ code: null, message: '' });
                const fetchData = async () => {
                    try {
                        if (!id) {
                            const response = await fetch(
                                `http://localhost:3050/api/sheet/${id}`
                            );
                            if (!response.ok) {
                                const error = new Error('500');
                                error.code = 500;
                                throw error;
                            }
                            const sheetData = await response.json();
                            if (sheetData.author === author) {
                                setLayout(JSON.parse(sheetData.layout));
                                setSettings(JSON.parse(sheetData.settings));
                                if (sheetData.style) setStyle(sheetData.style);
                            } else {
                                const error = new Error(
                                    'This is not your sheet'
                                );
                                error.code = 403;
                                error.author = sheetData.author;
                                throw error;
                            }
                        }
                    } catch (error) {
                        console.log(error.author);
                        if (error.code === 403) {
                            setError({
                                code: 403,
                                message: `This sheet is from user "${error.author}", you are logged as "${author}".`,
                            });
                        }
                        if (error.code === 500) {
                            setError({
                                code: 500,
                                message: "We couldn't find this sheet",
                            });
                        }
                        console.error('Error fetching sheet data:', error);
                    }
                };

                fetchData();
            }
        }
    }, [logged, author]);

    const fetchNew = () => {
        setError({ code: null, message: '' });
        const savedLayout = localStorage.getItem(LAYOUTKEY);
        const savedSettings = localStorage.getItem(SETTINGSKEY);
        const styles = localStorage.getItem(STYLEKEY);
        if (savedLayout) {
            setLayout(JSON.parse(savedLayout));
        }
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
        if (styles) {
            setStyle(styles);
        }
    };

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

    const styleRef = useRef(null);

    const renderStyle = () => {
        if (style === null) {
            return <style ref={styleRef}></style>;
        }
        return (
            <style
                ref={styleRef}
            >{`/*Imported in html download*/ \n\n\n ${style}\n`}</style>
        );
    };

    useEffect(() => {
        if (styleRef.current !== null && style !== null) {
            styleRef.current.innerHTML = `/*Imported in html download*/ \n\n\n ${style}\n`;
        }
    }, [style]);

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
            e.target.classList.add('active');
            settingsTab.current.classList.add('active');
            styleEditorTab.current.classList.remove('active');
            styleEditorTabButton.current.classList.remove('active');
        }
        if (tab === 'styleEditor') {
            e.target.classList.add('active');
            styleEditorTab.current.classList.add('active');
            settingsTab.current.classList.remove('active');
            settingsTabButton.current.classList.remove('active');
        }
    };

    const renderIfAuthor = () => {
        if (error.code !== null) {
            return <ErrorBanner error={error} />;
        }

        return (
            <>
                <aside className="sidebar">
                    <h2>Pick your component</h2>
                    {renderPicker()}
                </aside>
                <section id="create">
                    {renderStyle()}
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
            </>
        );
    };

    return (
        <div className="Builder page">
            <Nav />
            <main className="content">{renderIfAuthor()}</main>
        </div>
    );
};

export default Builder;
