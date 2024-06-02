import React, { useState, useEffect, useRef } from 'react';
import './sheetSettings.css';

const SETTINGSKEY = 'sheetSettings';
const LAYOUTKEY = 'BuilderLayout';

const Settings = ({ onSettingsSave }) => {
    const importJsonRef = useRef();
    const saveSheetRef = useRef();

    const [settings, setSettings] = useState({
        name: 'Character sheet',
        columns: 12,
        rowHeight: 40,
        size: 'Letter',
        height: null,
        width: null,
        background: '#ffffff',
        textColor: '#000000',
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem(SETTINGSKEY);
        if (savedSettings) {
            console.table(savedSettings);
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const displayCustomInputs = () => {
        if (settings.size === 'custom') {
            return (
                <div className="formGroup">
                    <label>
                        Width:
                        <input
                            type="number"
                            id="width"
                            name="width"
                            min={300}
                            max={2000}
                            defaultValue={settings.width || 816}
                            onChange={handleSettingsChange}
                        />
                    </label>

                    <label>
                        Height:
                        <input
                            type="number"
                            id="height"
                            name="height"
                            min={300}
                            max={3000}
                            defaultValue={settings.height || 1056}
                            onChange={handleSettingsChange}
                        />
                    </label>

                    <sub>Measurements in pixels.</sub>
                </div>
            );
        } else {
            return null;
        }
    };

    const handleSettingsChange = () => {
        const newSettings = {
            columns: Number(columnsRef.current.value) || 12,
            size: sizeRef.current.value || 'Letter',
            width: widthRef.current ? Number(widthRef.current.value) : null,
            height: heightRef.current ? Number(heightRef.current.value) : null,
            rowHeight: Number(rowHeightRef.current.value) || 40,
            background:
                backgroundImageRef.current.value !== ''
                    ? `url('${backgroundImageRef.current.value}')`
                    : backgroundColorRef.current.value,
            textColor: textColorRef.current.value,
        };

        localStorage.setItem(SETTINGSKEY, JSON.stringify(newSettings));
        setSettings(newSettings);
        onSettingsSave(newSettings);
    };

    // Define refs outside the component
    const columnsRef = useRef(null);
    const sizeRef = useRef(null);
    const widthRef = useRef(null);
    const heightRef = useRef(null);
    const rowHeightRef = useRef(null);
    const backgroundImageRef = useRef(null);
    const backgroundColorRef = useRef(null);
    const textColorRef = useRef(null);

    const saveHtml = async () => {
        const sheetContent = document.querySelector('.layout.sheet').outerHTML;

        const tempElement = document.createElement('div');
        tempElement.innerHTML = sheetContent;

        const elementsToRemove = tempElement.querySelectorAll(
            '.deleteItem, .react-resizable-handle'
        );
        elementsToRemove.forEach((element) =>
            element.parentNode.removeChild(element)
        );

        const modifiedSheetContent = tempElement.innerHTML;

        let headContent = '';
        const styleElements = document.head.querySelectorAll('style');

        const filteredStyleElements = Array.from(styleElements).filter(
            (style) => {
                const cssText = style.textContent.trim();
                return cssText.startsWith('/*Imported in html download*/');
            }
        );

        filteredStyleElements.forEach((style) => {
            const cssText = style.textContent.trim();
            headContent += `<style>${cssText}</style>`;
        });

        const htmlWithStyles = `
            <html>
                <head>
                    <title>Custom Character Sheet</title>
                    ${headContent}
                </head>
                <body>
                    ${modifiedSheetContent}
                    <div style="display:none">Character sheet made with axe.naturalcrit.com</div>
                </body>
            </html>
        `;

        const element = document.createElement('a');
        element.setAttribute(
            'href',
            'data:text/html,' + encodeURIComponent(htmlWithStyles)
        );
        element.setAttribute('download', 'sheet.html');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const saveJson = () => {
        const exportedJson = [];
        const savedLayout = localStorage.getItem(LAYOUTKEY);
        if (savedLayout) {
            exportedJson.push(JSON.parse(savedLayout));
        } else {
            alert('No layouts found.');
            return;
        }
        const savedSettings = localStorage.getItem(SETTINGSKEY);
        if (savedSettings) {
            exportedJson.push(JSON.parse(savedSettings));
        }

        const jsonContent = JSON.stringify(exportedJson, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const element = document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = 'exportedData.json';
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const importJson = () => {
        const localJson = importJsonRef.current.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const jsonContent = event.target.result;
            const parsedJson = JSON.parse(jsonContent);

            window.localStorage.setItem(
                LAYOUTKEY,
                JSON.stringify(parsedJson[0])
            );
            window.localStorage.setItem(
                SETTINGSKEY,
                JSON.stringify(parsedJson[1])
            );
        };
        reader.readAsText(localJson);
        window.location.reload();
    };

    const renderLayoutForm = () => {
        return (
            <>
                <div className="formGroup">
                    <label>
                        Columns:
                        <input
                            ref={columnsRef}
                            id="columns"
                            type="number"
                            name="columns"
                            min={3}
                            defaultValue={settings.columns}
                            onChange={handleSettingsChange}
                        />
                    </label>
                </div>
                <div className="formGroup">
                    <label>
                        Row height:
                        <input
                            ref={rowHeightRef}
                            id="rowHeight"
                            type="number"
                            name="rowHeight"
                            min={20}
                            defaultValue={settings.rowHeight}
                            onChange={handleSettingsChange}
                        />
                    </label>
                </div>
                <div className="formGroup">
                    <label>
                        Page size:
                        <select
                            ref={sizeRef}
                            id="size"
                            defaultValue={settings.size}
                            onChange={(e) => {
                                setSettings({
                                    size: e.target.value,
                                });
                                handleSettingsChange();
                            }}
                        >
                            <option value="Letter">
                                US Letter (215.9mm x 279.4mm)
                            </option>
                            <option value="A4">A4 (297mm x 210mm)</option>
                            <option value="A5">A5 148mm x 210mm</option>
                            <option value="custom">Custom</option>
                        </select>
                    </label>
                </div>
                {displayCustomInputs()}
            </>
        );
    };

    const renderStyleForm = () => {
        return (
            <>
                <div className="formGroup">
                    <label>
                        Background-color:
                        <input
                            ref={backgroundColorRef}
                            type="color"
                            name="background-color"
                            id="background-color"
                            defaultValue={settings.background}
                            onChange={handleSettingsChange}
                        />
                    </label>
                </div>
                <div className="formGroup">
                    <label>
                        Background-image URL:
                        <input
                            ref={backgroundImageRef}
                            type="text"
                            id="background-image"
                            onChange={handleSettingsChange}
                        />
                    </label>
                    <sub>
                        Upload your image to an image hosting service and paste
                        here the image link
                    </sub>
                </div>
                <div className="formGroup">
                    <label>
                        Text Color:
                        <input
                            ref={textColorRef}
                            type="color"
                            name="textColor"
                            id="text-color"
                            defaultValue={settings.textColor}
                            onChange={handleSettingsChange}
                        />
                    </label>
                </div>
            </>
        );
    };

    const saveSheet = () => {};

    return (
        <div id="settingsForm">
            <h2>Layout settings</h2>
            <fieldset className="formSquare">{renderLayoutForm()}</fieldset>

            <h2>Style settings</h2>
            <fieldset className="formSquare">{renderStyleForm()}</fieldset>

            <hr />
            <fieldset>
                <button className="button" onClick={() => window.print()}>
                    Export as pdf
                </button>
                <button className="button" onClick={saveHtml}>
                    Export as HTML
                </button>
                <button
                    className="button"
                    onClick={() => {
                        saveJson();
                    }}
                >
                    Export as JSON
                </button>
            </fieldset>

            <hr />
            <button
                className="button"
                onClick={() => importJsonRef.current.click()}
            >
                Import a character sheet
            </button>
            <input
                ref={importJsonRef}
                type="file"
                accept=".json"
                name="importJson"
                style={{ display: 'none' }}
                onChange={importJson}
            />
            <button
                ref={saveSheetRef}
                className="button"
                onClick={() => {
                    saveSheet();
                }}
            >
                Save
            </button>
        </div>
    );
};

export default Settings;
