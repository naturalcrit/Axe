import React, { useEffect, useRef, useContext } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';

import { BuilderContext } from '../builderContext';

const StyleEditor = () => {
    const editorRef = useRef(null);

    const { id, style, setStyle, STYLEKEY } = useContext(BuilderContext);

    useEffect(() => {        
        const updateStyle = (update) => {
            if (update.docChanged) {
                const cssContent = update.state.doc.toString();
                setStyle(cssContent);
                if (!id) {
                    window.localStorage.setItem(STYLEKEY, cssContent);
                }
            }
        };
        
        const startState = EditorState.create({
            doc: style ? style : '/* Write your CSS here */',
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
    }, [style]);

    return (
        <div className="codeEditor">
            <div ref={editorRef} style={{ height: '643px' }}></div>
        </div>
    );
};

export default StyleEditor;
