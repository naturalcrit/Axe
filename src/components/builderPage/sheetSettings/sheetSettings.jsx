import React, { useRef, useContext } from 'react';
import './sheetSettings.css';

import { BuilderContext } from '../builderContext';

const Settings = ({}) => {
    const { id, settings, setSettings, SETTINGSKEY } =
        useContext(BuilderContext);

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
            if (!id) {
                localStorage.setItem(SETTINGSKEY, JSON.stringify(newSettings));
            }

            return newSettings;
        });
    };

    const handleCustomInputChange = (event) => {
        const { name, value } = event.target;
        setSettings((prevSettings) => {
            const newSettings = {
                ...prevSettings,
                [name]: Number(value),
            };
            if (!id) {
                localStorage.setItem(SETTINGSKEY, JSON.stringify(newSettings));
            }

            return newSettings;
        });
    };

    const titleRef = useRef(null);
    const columnsRef = useRef(null);
    const sizeRef = useRef(null);
    const widthRef = useRef(null);
    const heightRef = useRef(null);
    const rowHeightRef = useRef(null);

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
                            min={0}
                            value={settings.width}
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
                            min={0}
                            value={settings.height}
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
                            value={settings.columns}
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
                            value={settings.rowHeight}
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

    return (
        <div id="settingsForm">
            <h3>Properties</h3>
            <fieldset>
                <div className="formGroup">
                    <label>
                        Title:
                        <input
                            ref={titleRef}
                            id="title"
                            type="text"
                            name="title"
                            min={3}
                            defaultValue={settings.title}
                            onChange={handleSettingsChange}
                        />
                    </label>
                </div>
            </fieldset>

            <h3>Layout settings</h3>
            <fieldset className="formSquare">{renderLayoutForm()}</fieldset>
        </div>
    );
};

export default Settings;
