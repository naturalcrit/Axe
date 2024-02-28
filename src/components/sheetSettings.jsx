import React, { Component } from "react";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                name: "Character sheet",
                columns: 12,
                rowHeight: 40,
                size: "Letter",
                height: null,
                width: null,
                background: "#ffffff",
                textColor: "#000000",
            },
        };
    }

    componentDidMount() {
        const savedSettings = localStorage.getItem("sheetSettings");
        if (savedSettings) {
            console.table(savedSettings);
            this.setState({ settings: JSON.parse(savedSettings) });
        }
    }

    displayCustomInputs = () => {
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
            background:
                form.querySelector("#background-image").value !== ""
                    ? `url('${form.querySelector("#background-image").value}')`
                    : form.querySelector("#background-color").value,
            textColor: form.querySelector("#text-color").value,
        };

        localStorage.setItem("sheetSettings", JSON.stringify(settings));

        this.setState({ settings: settings }, () => {
            // Callback function to notify the parent component of the state change
            this.props.onSettingsSave(settings);
        });
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
                                defaultValue={this.state.settings.columns}
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
                                defaultValue={this.state.settings.rowHeight}
                            />
                        </label>
                    </div>
                    <div className="formGroup">
                        <label>
                            Page size
                            <select
                                id="size"
                                defaultValue={this.state.settings.size}
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
                    {this.displayCustomInputs()}
                </fieldset>

                <h2>Style settings</h2>
                <fieldset>
                    <div className="formGroup">
                        <label>
                            Background-color
                            <input
                                type="color"
                                name="background-color"
                                id="background-color"
                                defaultValue={this.state.settings.background}
                            />
                        </label>
                    </div>
                    <div className="formGroup">
                        <label>
                            Background-image URL
                            <input type="text" id="background-image" />
                        </label>
                        <sub>
                            Upload your image to an image hosting service and
                            paste here the image link
                        </sub>
                    </div>
                    <div className="formGroup">
                        <label>
                            Text Color
                            <input
                                type="color"
                                name="textColor"
                                id="text-color"
                                defaultValue={this.state.settings.textColor}
                            />
                        </label>
                    </div>
                </fieldset>

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
    }
}

export default Settings;
