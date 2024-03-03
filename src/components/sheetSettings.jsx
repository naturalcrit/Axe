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
            formChange: false,
        };
    }

    componentDidMount() {
        const savedSettings = localStorage.getItem("axeSheetSettings");
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

        localStorage.setItem("axeSheetSettings", JSON.stringify(settings));

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
                    ${headContent}
                </head>
                <body>
                    ${modifiedSheetContent}
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
        const savedLayout = localStorage.getItem("axeBuilderLayout");
        if (savedLayout) {
            exportedJson.push(JSON.parse(savedLayout));
        } else {
            alert("No layouts found.");
            return; // Stop execution if no layouts found
        }
        const savedSettings = localStorage.getItem("axeSheetSettings");
        if (savedSettings) {
            exportedJson.push(JSON.parse(savedSettings));
        }

        // Convert exportedJson to a JSON string
        const jsonContent = JSON.stringify(exportedJson, null, 2);

        // Create a blob containing the JSON data
        const blob = new Blob([jsonContent], { type: "application/json" });

        // Create an anchor element to trigger the download
        const element = document.createElement("a");
        element.href = window.URL.createObjectURL(blob);
        element.download = "exportedData.json";

        // Hide the anchor element and trigger the download
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();

        // Clean up
        document.body.removeChild(element);
    };

    importJson = () => {
        const localJson = document.getElementById("importJson").files[0];
        console.log(localJson);
        const reader = new FileReader();

        reader.onload = function (event) {
            const jsonContent = event.target.result;
            const parsedJson = JSON.parse(jsonContent);
            console.log(parsedJson);

            // Store the JSON content in localStorage
            window.localStorage.setItem(
                "axeBuilderLayout",
                JSON.stringify(parsedJson[0])
            );
            window.localStorage.setItem(
                "axeSheetSettings",
                JSON.stringify(parsedJson[1])
            );
        };

        reader.readAsText(localJson);
        location.reload();
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
                    <select
                        id="size"
                        value={this.state.settings.size}
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
                </div>
                {this.displayCustomInputs()}

                <button
                    className="applyButton"
                    onClick={() => {
                        this.saveSettings();
                    }}
                    disabled={!this.state.formChange}
                >
                    Apply
                </button>
                <hr />
                <button
                    className="exportButton"
                    onClick={() => {
                        window.print();
                    }}
                >
                    Export as pdf
                </button>
                <button
                    className="exportButton"
                    onClick={() => {
                        this.saveHtml();
                    }}
                >
                    Export as HTML
                </button>
                <button
                    className="exportButton"
                    onClick={() => {
                        this.saveSettings();
                        this.saveJson();
                    }}
                >
                    Export as JSON
                </button>

                <hr />

                <button
                    onClick={() => {
                        document.getElementById("importJson").click();
                    }}
                >
                    Import a character sheet
                </button>
                <input
                    type="file"
                    accept=".json"
                    name="importJson"
                    id="importJson"
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
