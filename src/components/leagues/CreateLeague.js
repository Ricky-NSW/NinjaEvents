// age
// NCL = year you are born (eg jan 01 2016 - Dec 31 2016 && jan 01 2015)
// Kids
// Mature kids
// pre-teens
// Teens
// Youth (NCL)
// Adults

import React, { useEffect, useState, useContext } from 'react';

// Firebase
import firebase, { db, auth } from '../../FirebaseSetup';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';
import AuthContext from '../../contexts/AuthContext';

// MUI
import { Box, Button, TextField } from '@mui/material';
import Alert from '@mui/material/Alert';
import {Editor as WysiwygEditor} from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import {ContentState, EditorState} from "draft-js";

//wysiwyg https://www.npmjs.com/package/react-mui-draft-wysiwyg
// import { EditorState, ContentState } from "draft-js";

// import { Editor as WysiwygEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import htmlToDraft from 'html-to-draftjs';
import {stateToHTML} from "draft-js-export-html";

// const editorState = EditorState.createEmpty();
// import { Editor as WysiwygEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
// Define the HTML string you want to convert to a Draft.js ContentState
// Convert the HTML string to a Draft.js ContentState
const editorState = EditorState.createEmpty();
const htmlString = '<p>Hello World!</p>';
const contentState = htmlToDraft(htmlString);
function CreateLeague() {
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [leagueName, setLeagueName] = useState('');
    const [description, setDescription] = useState(''); // Added description state
    const [address, setAddress] = useState({ address: "", lat: null, lng: null });
    const [userType, setUserType] = useState(null);
    const [message, setMessage] = useState('');
    const { currentUser } = useContext(AuthContext);
    const [createdBy, setCreatedBy] = useState(null);

    const [editorState, setEditorState] = useState(() => {
        const contentBlock = htmlToDraft(''); // set your default HTML content here
        const contentState = contentBlock ? ContentState.createFromBlockArray(contentBlock.contentBlocks) : ContentState.createFromText('');
        return EditorState.createWithContent(contentState);
    });
    console.log( 'create league', userType)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!auth.currentUser || (auth.currentUser && userType !== "Admin" && userType !== "League Owner")) {
            setError('You need to be logged in as a League Admin or an admin to create an event');
            return;
        }


        if (!leagueName) {
            setError('League Name is required');
            return;
        }

        const contentHTML = stateToHTML(editorState.getCurrentContent());

        try {
            //Once you've confirmed that the user is signed in, you can get their UID by accessing the uid property of the auth.currentUser object:

            const uid = auth.currentUser.uid;
            console.log(auth.currentUser.uid)

            //create the league document
            const docRef = await addDoc(collection(db, 'leagues'), {
                name: leagueName,
                description: contentHTML,
                OwnerUid: currentUser.uid,
                createdBy: uid // Include the user's UID as a field in the document
            });

            // Update the user document with the new league ID
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                leagues: arrayUnion(docRef.id) // Add the new league ID to the leagues array
            });

            setMessage('League successfully created.');
            setLeagueName('');
            setDescription(''); // Reset the description field
            setCreatedBy('');
            setError('');
            setAlert('success');
            setShowAlert(true);

            console.log('Document written with ID: ', docRef.id);


        } catch (error) {
            console.error('Error adding document: ', error);
            setAlert('error');
            setShowAlert(true);
            setError(`Error adding document: ${error.message}`);
        }
    };


    useEffect(() => {
        const fetchUserType = async () => {
            if (auth.currentUser) {
                const userDocRef = doc(db, 'users', auth.currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUserType(userDoc.data().userType);
                }
            }
        };

        fetchUserType();
    }, []);

    const handleEditorChange = (state) => {
        setEditorState(state);
    };


    const handleLeagueNameChange = (e) => {
        setLeagueName(e.target.value);
        setError('');
    };


    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    return (
        <>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="League Name"
                    value={leagueName}
                    variant="outlined"
                    onChange={handleLeagueNameChange}
                    margin="normal"
                    required
                    fullWidth
                />
                <WysiwygEditor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                />
                <br />
                <br />
                {showAlert && (
                    <Alert severity={alert} onClose={handleCloseAlert}>
                        {alert === 'success'
                            ? 'League added successfully!'
                            : error}
                    </Alert>
                )}
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                &nbsp;
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
        </>
    );
}

export default CreateLeague;
