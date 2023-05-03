// WysiwygEditorComponent.js
//https://jpuri.github.io/react-draft-wysiwyg/#/docs
import React from 'react';
import { Editor as WysiwygEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const toolbarOptions = {
    options: ['inline', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history', 'blockType'],
    //all options:
    // options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
    inline: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
        // bold: { icon: bold, className: undefined },
        // italic: { icon: italic, className: undefined },
        // underline: { icon: underline, className: undefined },
        // strikethrough: { icon: strikethrough, className: undefined },
        // monospace: { icon: monospace, className: undefined },
        // superscript: { icon: superscript, className: undefined },
        // subscript: { icon: subscript, className: undefined },
    },
    blockType: {
        inDropdown: true,
        options: ['Normal', 'H3', 'H4'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    fontSize: {
        // icon: fontSize,
        options: [16, 24],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    fontFamily: {
        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
    },
    list: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['unordered', 'ordered', 'indent', 'outdent'],
        // unordered: { icon: unordered, className: undefined },
        // ordered: { icon: ordered, className: undefined },
        // indent: { icon: indent, className: undefined },
        // outdent: { icon: outdent, className: undefined },
    },
    textAlign: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['left', 'center', 'right', 'justify'],
        // left: { icon: left, className: undefined },
        // center: { icon: center, className: undefined },
        // right: { icon: right, className: undefined },
        // justify: { icon: justify, className: undefined },
    },
    colorPicker: {
        // icon: color,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
            'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
            'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
            'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
            'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
            'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
    },
    link: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        dropdownClassName: undefined,
        showOpenOptionOnHover: true,
        defaultTargetOption: '_self',
        options: ['link', 'unlink'],
        // link: { icon: link, className: undefined },
        // unlink: { icon: unlink, className: undefined },
        linkCallback: undefined
    },
    emoji: {
        // icon: emoji,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        emojis: [
            '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
            '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
            '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
            '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
            '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
            '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
            '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
            '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
            '✅', '❎', '💯',
        ],
    },
    embedded: {
        // icon: embedded,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        embedCallback: undefined,
        defaultSize: {
            height: 'auto',
            width: 'auto',
        },
    },
    image: {
        // icon: image,
        className: undefined,
        component: undefined,
        popupClassName: undefined,
        urlEnabled: true,
        uploadEnabled: true,
        alignmentEnabled: true,
        uploadCallback: undefined,
        previewImage: false,
        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
        alt: { present: false, mandatory: false },
        defaultSize: {
            height: 'auto',
            width: 'auto',
        },
    },
    // remove: { icon: eraser, className: undefined, component: undefined },
    history: {
        inDropdown: false,
        className: undefined,
        component: undefined,
        dropdownClassName: undefined,
        options: ['undo', 'redo'],
        // undo: { icon: undo, className: undefined },
        // redo: { icon: redo, className: undefined },
    },
};


const wrapperStyle = {
    // Add your wrapper styles here
    border: '1px solid hsl(0deg 0% 76.86%)',
    borderRadius: '5px'

};

const toolbarStyle = {
    // Add your tolbar styles here
};

const editorStyle = {
    // Add your editor styles here
    // border: '1px solid rgba(0, 0, 0, 0.87)',
    padding: '0 1rem'
};

const WysiwygEditorComponent = ({ editorState, onEditorStateChange, defaultContentState }) => (
    <WysiwygEditor
        editorState={editorState}
        wrapperStyle={wrapperStyle}
        toolbarStyle={toolbarStyle}
        editorStyle={editorStyle}
        onEditorStateChange={onEditorStateChange}
        toolbar={toolbarOptions}
        defaultContentState="sdfsdfsd"
        // toolbarOnFocus
    />
);

export default WysiwygEditorComponent;
