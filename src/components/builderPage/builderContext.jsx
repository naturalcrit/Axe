import React, { createContext, useState } from 'react';
import { useParams, useLocation, } from 'react-router-dom';

export const BuilderContext = createContext();

const STYLEKEY = 'styleCode';
const SETTINGSKEY = 'sheetSettings';
const LAYOUTKEY = 'builderLayout';

export const BuilderProvider = ({ children }) => {
    const params = useParams();
    
    const isId = () => {
        if (Object.keys(params).length === 0) {
            return null;
        }
        return params.id;
    };
    
    const [id, setId] = useState(isId());
    const [layout, setLayout] = useState([]);
    const [style, setStyle] = useState(
        !id ? window.localStorage.getItem(STYLEKEY) : null
    );
    const [settings, setSettings] = useState({
        title: 'Character sheet',
        columns: 12,
        rowHeight: 40,
        size: 'letter',
        height: 1056,
        width: 816,
        background: '#ffffff',
        textColor: '#000000',
    });

    const recheckId = () => {
        setId(isId());
    }

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
        if (!id) {
            localStorage.setItem(LAYOUTKEY, JSON.stringify(updatedLayout));
        }
        setLayout(updatedLayout);
    };

    return (
        <BuilderContext.Provider
            value={{
                id,
                setId,
                recheckId,
                layout,
                setLayout,
                style,
                setStyle,
                settings,
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
