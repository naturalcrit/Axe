import { useEffect, useState, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
import { keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands'



const StyleEditor = () => {
    const editorRef = useRef(null);

    useEffect(() => {
        const startState = EditorState.create({
          doc: 'Hello World',
          extensions: [ basicSetup, css() ],
        })
    
        const view = new EditorView({ state: startState, parent: editorRef.current })
    
        return () => {
          view.destroy()
        }
      }, [])
    

    return (
        <div className='codeEditor'>
            <div ref={editorRef} style={{ height: '500px' }}></div>
        </div>
    );
};

export default StyleEditor;
