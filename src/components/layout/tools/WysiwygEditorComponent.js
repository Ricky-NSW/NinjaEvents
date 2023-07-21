import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import the styles

const WysiwygEditorComponent = ({ initialContent, handleContentChange }) => {
    const [editorContent, setEditorContent] = useState(initialContent || '');

    const handleChange = (content, delta, source, editor) => {
        setEditorContent(content);
        if (handleContentChange) {
            handleContentChange(content, delta, source, editor);
        }
    };

    return (
        <ReactQuill
            value={editorContent}
            onChange={handleChange}
        />
    );
};

export default WysiwygEditorComponent;
