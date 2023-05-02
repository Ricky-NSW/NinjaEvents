import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

//wysiwyg https://www.npmjs.com/package/react-mui-draft-wysiwyg
import { Editor, EditorState, ContentState, convertToRaw } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor as WysiwygEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import htmlToDraft from 'html-to-draftjs';
// Define the HTML string you want to convert to a Draft.js ContentState
const htmlString = '<p>Hello World!</p>';
// Convert the HTML string to a Draft.js ContentState
const contentState = htmlToDraft(htmlString);
const editorState = EditorState.createEmpty();

const toolbarOptions = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'image', 'remove', 'history'],
    inline: {
        options: ['bold', 'italic', 'underline', 'strikethrough'],
    },
    list: {
        options: ['unordered', 'ordered'],
    },
    textAlign: {
        options: ['left', 'center', 'right'],
    },
    link: {
        defaultTargetOption: '_self',
        showOpenOptionOnHover: true,
        defaultLinkTarget: '_blank',
    },
    embedded: {
        defaultSize: {
            height: 'auto',
            width: 'auto',
        },
    },
    image: {
        defaultSize: {
            height: 'auto',
            width: '100%',
        },
    },
};

const EditGymDetails = ({ onUpdate }) => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [gym, setGym] = useState(null);
    const [updatedGym, setUpdatedGym] = useState(null);

    const [isApiLoaded, setIsApiLoaded] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const [editorState, setEditorState] = useState(() => {
        const contentBlock = htmlToDraft(''); // set your default HTML content here
        const contentState = contentBlock ? ContentState.createFromBlockArray(contentBlock.contentBlocks) : ContentState.createFromText('');
        return EditorState.createWithContent(contentState);
    });

    const handleEditorChange = (state) => {
        setEditorState(state);
        const contentHTML = stateToHTML(state.getCurrentContent());
        setUpdatedGym({ ...updatedGym, description: contentHTML });
    };

    useEffect(() => {
        const fetchGym = async () => {
            const gymRef = doc(getFirestore(), 'gyms', id);
            const gymDoc = await getDoc(gymRef);
            if (gymDoc.exists()) {
                const fetchedGym = { id, ...gymDoc.data() };
                setGym(fetchedGym);

                // Set editor state with the gym's description
                const contentBlock = htmlToDraft(fetchedGym.description);
                const contentState = contentBlock
                    ? ContentState.createFromBlockArray(contentBlock.contentBlocks)
                    : ContentState.createFromText('');
                setEditorState(EditorState.createWithContent(contentState));
            }
        };

        fetchGym();
    }, [id]);


    const handleClickOpen = () => {
        setOpen(true);
        if (gym) setUpdatedGym({ ...gym });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        const contentHTML = stateToHTML(editorState.getCurrentContent());
        console.log('Content HTML:', contentHTML);

        if (gym && updatedGym) {
            try {
                // Save the updated gym data to Firestore
                const gymRef = doc(getFirestore(), 'gyms', gym.id);
                await updateDoc(gymRef, {
                    name: updatedGym.name,
                    description: contentHTML,
                    // createdBy: uid, // Include the user's UID as a field in the document
                });

                // Call the onUpdate callback to update the parent component's state
                onUpdate();
                handleClose();
            } catch (error) {
                console.error('Error updating gym:', error);
            }
        }
    };


    if (!gym) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                Edit Gym Details
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Gym Details</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Gym Name"
                        type="text"
                        fullWidth
                        defaultValue={gym.name}
                        onChange={(e) => setUpdatedGym({ ...updatedGym, name: e.target.value })}
                    />

                    <WysiwygEditor
                        toolbar={toolbarOptions}
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                    />

                    {/* Add more TextField components for other gym properties here */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default EditGymDetails;
