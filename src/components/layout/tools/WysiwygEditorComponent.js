//TODO: remove h1 and h2 from text editor etc
import React, { Component } from 'react';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class WysiwygEditorComponent extends React.Component {
    render() {
        const { editorState, onEditorStateChange } = this.props;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={onEditorStateChange}
                    // toolbar={{
                    //     blockType: {
                    //         inDropdown: true,
                    //         options: ['Normal', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
                    //     },
                    // }}
                />
                <textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />
            </div>
        );
    }
}

export default WysiwygEditorComponent;
