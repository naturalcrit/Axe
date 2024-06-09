import React, {
    useState,
    useCallback,
    useEffect,
    lazy,
    Suspense,
    useRef,
    useContext,
} from 'react';
import './sheetSettings.css';

import { BuilderContext } from '../builderContext';

const SETTINGSKEY = 'sheetSettings';

const Settings = ({}) => {
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

    const handleSettingsChange = (event) => {
        const { name, value } = event.target;
        setSettings((prevSettings) => {
            const newSettings = {
                ...prevSettings,
                [name]:
                    name === 'columns' || name === 'rowHeight'
                        ? Number(value)
                        : value,
            };
            localStorage.setItem(SETTINGSKEY, JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const handleCustomInputChange = (event) => {
        const { name, value } = event.target;
        setSettings((prevSettings) => {
            const newSettings = {
                ...prevSettings,
                [name]: Number(value) >= 300 ? Number(value) : null,
            };
            localStorage.setItem(SETTINGSKEY, JSON.stringify(newSettings));
            return newSettings;
        });
    };

    const columnsRef = useRef(null);
    const sizeRef = useRef(null);
    const widthRef = useRef(null);
    const heightRef = useRef(null);
    const rowHeightRef = useRef(null);
    const backgroundImageRef = useRef(null);
    const backgroundColorRef = useRef(null);
    const textColorRef = useRef(null);

    const displayCustomInputs = () => {
        if (settings.size === 'custom') {
            return (
                <div className="formGroup">
                    <label>
                        Width:
                        <input
                            ref={widthRef}
                            type="number"
                            id="width"
                            name="width"
                            min={300}
                            max={2000}
                            value={settings.width || 816}
                            onChange={handleCustomInputChange}
                        />
                    </label>

                    <label>
                        Height:
                        <input
                            ref={heightRef}
                            type="number"
                            id="height"
                            name="height"
                            min={300}
                            max={3000}
                            value={settings.height || 1056}
                            onChange={handleCustomInputChange}
                        />
                    </label>

                    <sub>Measurements in pixels.</sub>
                </div>
            );
        } else {
            return null;
        }
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
                            name="size"
                            value={settings.size}
                            onChange={handleSettingsChange}
                        >
                            <option value="letter">
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

    return (
        <div id="settingsForm">
            <h2>Layout settings</h2>
            <fieldset className="formSquare">{renderLayoutForm()}</fieldset>

            <h2>Style settings</h2>
            <fieldset className="formSquare">{renderStyleForm()}</fieldset>
        </div>
    );
};

export default Settings;
