import { Editor, EditorState, RichUtils } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useState } from 'react';

const styleMap = {
    'HIGHLIGHT': {
        backgroundColor: '#fffe0d',
    },
    'LARGE': {
        fontSize: '1.5em',
    }
};

export default function CustomEditor({ editorState, onChange }) {
    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const toggleInlineStyle = (style) => {
        onChange(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockType = (type) => {
        onChange(RichUtils.toggleBlockType(editorState, type));
    };

    return (
        <div className="rich-editor">
            <div className="toolbar">
                <button onClick={() => toggleInlineStyle('BOLD')} className="toolbar-btn">
                    <strong>B</strong>
                </button>
                <button onClick={() => toggleInlineStyle('ITALIC')} className="toolbar-btn">
                    <em>I</em>
                </button>
                <button onClick={() => toggleInlineStyle('UNDERLINE')} className="toolbar-btn">
                    <u>U</u>
                </button>
                <button onClick={() => toggleBlockType('header-one')} className="toolbar-btn">
                    H1
                </button>
                <button onClick={() => toggleBlockType('header-two')} className="toolbar-btn">
                    H2
                </button>
                <button onClick={() => toggleBlockType('unordered-list-item')} className="toolbar-btn">
                    UL
                </button>
                <button onClick={() => toggleBlockType('ordered-list-item')} className="toolbar-btn">
                    OL
                </button>
            </div>
            <div className="editor-container">
                <Editor
                    customStyleMap={styleMap}
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={onChange}
                    placeholder="Введите текст главы..."
                />
            </div>
        </div>
    );
}