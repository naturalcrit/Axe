import React, { useEffect, useRef, useContext } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';

import { BuilderContext } from '../builderContext';

const StyleEditor = (styles) => {
    const editorRef = useRef(null);
    const styleRef = useRef(null);

    const { layout, style, STYLEKEY } = useContext(BuilderContext);

    const styleInStorage = window.localStorage.getItem(STYLEKEY);

    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = style ? style : ``;
        document.head.appendChild(styleSheet);
        styleRef.current = styleSheet;

        if (styleInStorage) {
            styleRef.current.textContent = styleInStorage;
        }

        const updateStyle = (update) => {
            if (update.docChanged) {
                const cssContent = update.state.doc.toString();
                styleRef.current.textContent = `/*Imported in html download*/ \n\n\n ${cssContent}\n`;
                updateStyle(cssContent);
            }
        };

        const startState = EditorState.create({
            doc: styleInStorage ? styleInStorage : '/* Write your CSS here */',
            extensions: [
                basicSetup,
                css(),
                EditorView.updateListener.of(updateStyle),
            ],
        });

        const view = new EditorView({
            state: startState,
            parent: editorRef.current,
        });

        return () => {
            view.destroy();
        };
    }, []);

    return (
        <div className="codeEditor">
            <div ref={editorRef} style={{ height: '500px' }}></div>
        </div>
    );
};

export default StyleEditor;
