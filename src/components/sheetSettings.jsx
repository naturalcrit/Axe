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
        };

        localStorage.setItem("sheetSettings", JSON.stringify(settings));

        this.setState({ settings: settings }, () => {
            // Callback function to notify the parent component of the state change
            this.props.onSettingsSave(settings);
        });
    };

    saveHtml = async () => {
        const sheetContent = document.querySelector(".layout.sheet").outerHTML;

        // Create a temporary element to hold the HTML content
        const tempElement = document.createElement("div");
        tempElement.innerHTML = sheetContent;

        // Find and remove elements with class "noExport"
        const elementsToRemove = tempElement.querySelectorAll(".deleteItem, .react-resizable-handle");
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

        // Create a link element
        const element = document.createElement("a");
        // Set the HTML content as the href attribute
        element.setAttribute(
            "href",
            "data:text/html," + encodeURIComponent(htmlWithStyles)
        );
        // Set the download attribute with the desired file name
        element.setAttribute("download", "sheet.html");
        // Hide the link element
        element.style.display = "none";
        // Append the element to the body
        document.body.appendChild(element);
        // Simulate a click on the link to trigger the download
        element.click();
        // Clean up by removing the element
        document.body.removeChild(element);
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
                    />
                </div>
                <div className="formGroup">
                    <label htmlFor="size">Dimensions</label>
                    <select id="size" defaultValue={this.state.settings.size}>
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
                <button
                    onClick={() => {
                        this.saveHtml();
                    }}
                >
                    Export as HTML
                </button>
            </div>
        );
    }
}

export default Settings;
