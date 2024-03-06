import React, { Component } from 'react';

import './sheetSettings.css';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                columns: 12,
                rowHeight: 40,
                size: 'letter',
                height: null,
                width: null,
                backgroundColor: '#00f',
                backgroundImage: "",
                textColor: '#000000',
            },
            formChange: false,
        };
    }

    componentDidMount() {
        const savedSettings = localStorage.getItem('axeSheetSettings');
        if (savedSettings) {
            this.setState({ settings: JSON.parse(savedSettings) });
        }
    }

    displayCustomInputs = () => {
        if (this.state.settings.size === 'custom') {
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
                            value={this.state.settings.width || 816}
                            onChange={(e) => this.handleInputChange(e, 'width')}
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
                            value={this.state.settings.height || 1056}
                            onChange={(e) => this.handleInputChange(e, 'height')}
                        />
                    </label>

                    <sub>Measurements in pixels.</sub>
                </div>
            );
        } else {
            return;
        }
    };

    saveSettings = () => {
        const form = document.getElementById('settingsForm');
        const settings = {
            columns: Number(form.querySelector('#columns').value) || 12,
            rowHeight: Number(form.querySelector('#rowHeight').value) || 40,
            size: form.querySelector('#size').value || 'letter',
            height: form.querySelector('#height')
                ? Number(form.querySelector('#height').value)
                : null,
            width: form.querySelector('#width')
                ? Number(form.querySelector('#width').value)
                : null,

            backgroundColor: form.querySelector('#background-color').value || "#0f0",
            backgroundImage: form.querySelector('#background-image').value || "",
            textColor: form.querySelector('#text-color').value,
        };

        localStorage.setItem('axeSheetSettings', JSON.stringify(settings));

        this.setState({ settings: settings }, () => {
            // Callback function to notify the parent component of the state change
            this.props.onSettingsSave(settings);
        });
    };

    handleInputChange = (e, field) => {
        const { value } = e.target;
        this.setState((prevState) => ({
            settings: {
                ...prevState.settings,
                [field]: value,
            },
            formChange: true,
        }));
    };

    render() {
        return (
            <div id="settingsForm">
                <h2>Layout settings</h2>
                <fieldset className="styleForm">
                    <div className="formGroup">
                        <label>
                            Columns:
                            <input
                                id="columns"
                                type="number"
                                name="columns"
                                min={3}
                                value={this.state.settings.columns}
                                onChange={(e) =>
                                    this.handleInputChange(e, 'columns')
                                }
                            />
                        </label>
                    </div>
                    <div className="formGroup">
                        <label>
                            Row height:
                            <input
                                id="rowHeight"
                                type="number"
                                name="rowHeight"
                                min={20}
                                value={this.state.settings.rowHeight}
                                onChange={(e) => this.handleInputChange(e, 'rowHeight')}
                            />
                        </label>
                    </div>
                    <div className="formGroup">
                        <label>
                            Page size:
                            <select
                                id="size"
                                value={this.state.settings.size}
                                onChange={(e) => this.handleInputChange(e, 'size')}
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
                    {this.displayCustomInputs()}
                </fieldset>

                <h2>Style settings</h2>
                <fieldset>
                    <div className="formGroup">
                        <label>
                            Background-color:
                            <input
                                type="color"
                                name="background-color"
                                id="background-color"
                                value={this.state.settings.backgroundColor}
                                onChange={(e) => this.handleInputChange(e, 'backgroundColor')}
                            />
                        </label>
                    </div>
                    <div className="formGroup">
                        <label>
                            Background-image URL:
                            <input
                                type="text"
                                id="background-image"
                                value={this.state.settings.backgroundImage}
                                onChange={(e) => this.handleInputChange(e, 'backgroundImage')}
                            />
                        </label>
                        <sub>
                            Upload your image to an image hosting service and
                            paste here the image link
                        </sub>
                    </div>
                    <div className="formGroup">
                        <label>
                            Text Color:
                            <input
                                type="color"
                                name="textColor"
                                id="text-color"
                                value={this.state.settings.textColor}
                                onChange={(e) => this.handleInputChange(e, 'textColor')}
                            />
                        </label>
                    </div>
                </fieldset>

                <button
                    onClick={() => {
                        this.saveSettings();
                    }}
                    disabled={!this.state.formChange}
                >
                    Apply
                </button>
                <hr />
                <button
                    onClick={() => {
                        window.print();
                    }}
                >
                    Export as pdf
                </button>
            </div>
        );
    }
}

export default Settings;
