import React, { useRef, useContext } from 'react';

import { BuilderContext } from '../builderContext';
import { AuthContext } from '../../authContext';

const FileOperationsButtons = ({ onSave }) => {
    const importJsonRef = useRef();
    const saveSheetRef = useRef();

    const {
        id,
        layout,
        setLayout,
        style,
        settings,
        setSettings,
    } = useContext(BuilderContext);

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

        tempElement.querySelectorAll('.react-grid-item').forEach((element) => {
            element.className = 'react-grid-item draggable';
        });

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
                    <title>${settings.title}</title>
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

        exportedJson.push(JSON.parse(layout));
        exportedJson.push(JSON.parse(style));
        exportedJson.push(JSON.parse(settings));

        const jsonContent = JSON.stringify(exportedJson, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const element = document.createElement('a');
        element.href = window.URL.createObjectURL(blob);
        element.download = `${settings.title}.json`;
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

            setLayout(JSON.stringify(parsedJson[0]));
            setSettings(JSON.stringify(parsedJson[1]));
        };
        reader.readAsText(localJson);
        window.location.reload();
    };

    const saveSheet = async () => {
        const sheet = {
            id: id,
            layout: JSON.stringify(layout),
            style: style,
            settings: JSON.stringify(settings),
            author: localStorage.getItem('author') || '',
        };
        try {
            const response = await fetch('http://localhost:3050/api/sheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sheet),
            });
            const data = await response.json();
            console.log('Sheet created:', data);
        } catch (error) {
            console.error('Error creating sheet:', error);
            console.error(sheet);
        }
    };

    return (
        <div className='buttons'>
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
            <button ref={saveSheetRef} className="button" onClick={saveSheet}>
                Save
            </button>
        </div>
    );
};

export default FileOperationsButtons;
