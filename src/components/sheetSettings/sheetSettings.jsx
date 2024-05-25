import React, { Component } from "react";

import "./sheetSettings.css";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.importJsonRef = React.createRef();
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
            formChange: false,
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
                    <label>
                        Width:
                        <input
                            type="number"
                            id="width"
                            name="width"
                            min={300}
                            max={2000}
                            defaultValue={this.state.settings.width || 816}
                            onChange={this.handleSettingsChange}
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
                            defaultValue={this.state.settings.height || 1056}
                            onChange={this.handleSettingsChange}
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

        localStorage.setItem("SheetSettings", JSON.stringify(settings));

        this.setState({ settings: settings }, () => {
            // Callback function to notify the parent component of the state change
            this.props.onSettingsSave(settings);
        });
        
        this.setState({ formChange: false });
    };

    handleSettingsChange = () => {
        this.setState({ formChange: true });
    };

    saveHtml = async () => {
        const sheetContent = document.querySelector(".layout.sheet").outerHTML;

        // Create a temporary element to hold the HTML content
        const tempElement = document.createElement("div");
        tempElement.innerHTML = sheetContent;

        // Find and remove elements with class "noExport"
        const elementsToRemove = tempElement.querySelectorAll(
            ".deleteItem, .react-resizable-handle"
        );
        elementsToRemove.forEach((element) =>
            element.parentNode.removeChild(element)
        );

        // Get the modified HTML content
        const modifiedSheetContent = tempElement.innerHTML;

        // Extract <style> tags from the document's head
        let headContent = "";
        const styleElements = document.head.querySelectorAll("style");

        // Filter the <style> elements based on the comment
        const filteredStyleElements = Array.from(styleElements).filter(
            (style) => {
                const cssText = style.textContent.trim();
                return cssText.startsWith("/*Imported in html download*/");
            }
        );

        // Extract CSS content from filtered <style> elements
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

        const element = document.createElement("a");
        element.setAttribute(
            "href",
            "data:text/html," + encodeURIComponent(htmlWithStyles)
        );
        element.setAttribute("download", "sheet.html");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    saveJson = () => {
        const exportedJson = [];
        const savedLayout = localStorage.getItem("BuilderLayout");
        if (savedLayout) {
            exportedJson.push(JSON.parse(savedLayout));
        } else {
            alert("No layouts found.");
            return; // Stop execution if no layouts found
        }
        const savedSettings = localStorage.getItem("SheetSettings");
        if (savedSettings) {
            exportedJson.push(JSON.parse(savedSettings));
        }

        const jsonContent = JSON.stringify(exportedJson, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json" });
        const element = document.createElement("a");
        element.href = window.URL.createObjectURL(blob);
        element.download = "exportedData.json";
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    importJson = () => {
        const localJson = this.importJsonRef.current.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const jsonContent = event.target.result;
            const parsedJson = JSON.parse(jsonContent);

            window.localStorage.setItem(
                "BuilderLayout",
                JSON.stringify(parsedJson[0])
            );
            window.localStorage.setItem(
                "SheetSettings",
                JSON.stringify(parsedJson[1])
            );
        };
        reader.readAsText(localJson);
        window.location.reload();
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
                                onChange={this.handleSettingsChange}
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
                                onChange={this.handleSettingsChange}
                            />
                        </label>
                    </div>
                    <div className="formGroup">
                        <label>
                            Page size:
                            <select
                                id="size"
                                defaultValue={this.state.settings.size}
                                onChange={(e) => {
                                    this.setState({
                                        settings: { size: e.target.value },
                                    });
                                    this.handleSettingsChange();
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
                                defaultValue={this.state.settings.background}
                                onChange={this.handleSettingsChange}
                            />
                        </label>
                    </div>
                    <div className="formGroup">
                        <label>
                            Background-image URL:
                            <input
                                type="text"
                                id="background-image"
                                onChange={this.handleSettingsChange}
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
                                defaultValue={this.state.settings.textColor}
                                onChange={this.handleSettingsChange}
                            />
                        </label>
                    </div>
                </fieldset>

                <button
                    className="button"
                    onClick={() => {
                        this.saveSettings();
                    }}
                    disabled={!this.state.formChange}
                >
                    Apply
                </button>
                <hr />
                <button
                    className="button"
                    onClick={() => {
                        window.print();
                    }}
                >
                    Export as pdf
                </button>
                <button
                    className="button"
                    onClick={() => {
                        this.saveHtml();
                    }}
                >
                    Export as HTML
                </button>
                <button
                    className="button"
                    onClick={() => {
                        this.saveSettings();
                        this.saveJson();
                    }}
                >
                    Export as JSON
                </button>
                <hr/>
                <button
                    onClick={() => {
                        this.importJsonRef.current.click();
                    }}
                >
                    Import a character sheet
                </button>
                <input
                    ref={this.importJsonRef}
                    type="file"
                    accept=".json"
                    name="importJson"
                    style={{ display: "none" }}
                    onChange={() => {
                        this.importJson();
                    }}
                />
            </div>
        );
    }
}

export default Settings;
