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
            },
            formChange: false
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
                        onChange={this.handleSettingsChange}
                    />
                    <label htmlFor="height">Height:</label>
                    <input
                        type="number"
                        id="height"
                        name="height"
                        min={300}
                        max={3000}
                        defaultValue={this.state.settings.height || 1056}
                        onChange={this.handleSettingsChange}
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
        };

        localStorage.setItem("sheetSettings", JSON.stringify(settings));

        this.setState({ settings: settings }, () => {
            // Callback function to notify the parent component of the state change
            this.props.onSettingsSave(settings);
        });
        this.setState({formChange: false})
    };

    handleSettingsChange = () => {
        this.setState({formChange: true});
    };


    render() {
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
                        onChange={this.handleSettingsChange}
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
                        onChange={this.handleSettingsChange}
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="size">Dimensions</label>
                    <select id="size" value={this.state.settings.size} 
                        onChange={(e)=>{
                            this.setState({settings:{size: e.target.value}});
                            this.handleSettingsChange();
                            }}>
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
    };
    
}

export default Settings;