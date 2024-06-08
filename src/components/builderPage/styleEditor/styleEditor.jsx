import { useEffect, useState, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';

const STYLEKEY = 'styleCode';

const StyleEditor = () => {
    const editorRef = useRef(null);
    const styleRef = useRef(null);

    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.textContent = ``;
        document.head.appendChild(styleSheet);
        styleRef.current = styleSheet;

        const styleInStorage = window.localStorage.getItem(STYLEKEY);

        if (styleInStorage) {
          console.log(`it is in storage`);
            styleRef.current.textContent = styleInStorage;
        }

        const updateStyle = (update) => {
            if (update.docChanged) {
                const cssContent = update.state.doc.toString();
                styleRef.current.textContent = `.drop {\n ${cssContent}\n}`;
                window.localStorage.setItem(STYLEKEY, cssContent)
            }
        };

        const startState = EditorState.create({
            doc: styleInStorage ? styleInStorage :'/* Write your CSS here */',
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
