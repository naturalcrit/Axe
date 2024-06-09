import React, { createContext, useState, useCallback, useEffect } from 'react';

export const BuilderContext = createContext();

const STYLEKEY = 'styleCode';
const SETTINGSKEY = 'sheetSettings';
const LAYOUTKEY = 'builderLayout';

export const BuilderProvider = ({ children }) => {
    const styleInStorage = window.localStorage.getItem(STYLEKEY);
    const [layout, setLayout] = useState([]);
    const [style, setStyle] = useState(styleInStorage || null);
    const [settings, setSettings] = useState({
        name: 'Character sheet',
        columns: 12,
        rowHeight: 40,
        size: 'letter',
        height: 1056,
        width: 816,
        background: '#ffffff',
        textColor: '#000000',
    });


    const addNewItem = (componentName, width, height, label) => {
        const newItem = {
            i: `item-${layout.length + 1}`,
            x: 0,
            y: 0,
            w: width,
            h: height,
            componentName,
            label,
        };
        setLayout((prevLayout) => [...prevLayout, newItem]);
    };

    const deleteItem = (itemId) => {
        setLayout((prevLayout) =>
            prevLayout
                .filter((item) => item.i !== itemId)
                .map((item, index) => ({
                    ...item,
                    i: `item-${index}`,
                }))
        );
    };

    const saveLayout = (newLayout) => {
        const updatedLayout = newLayout.map((item, index) => ({
            ...layout[index],
            ...item,
            i: `item-${index}`,
        }));

        localStorage.setItem(LAYOUTKEY, JSON.stringify(updatedLayout));
        setLayout(updatedLayout);
    };

    return (
        <BuilderContext.Provider
            value={{
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
            }}
        >
            {children}
        </BuilderContext.Provider>
    );
};

export default BuilderProvider;