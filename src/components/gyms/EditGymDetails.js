import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField, Grid,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { getFirestore, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import GymBannerUpload from './GymBannerUpload';
//wysiwyg https://www.npmjs.com/package/react-mui-draft-wysiwyg
import WysiwygEditorComponent from '../layout/tools/WysiwygEditorComponent';

import { Editor, EditorState, ContentState, convertToRaw } from "draft-js";
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor as WysiwygEditor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToHTML, convertFromHTML } from 'draft-convert';
import htmlToDraft from 'html-to-draftjs';
import GymAvatarUpload from './GymAvatarUpload';
import GalleryImageUpload from "./GalleryImageUpload";
import {useDataLayer} from "../data/DataLayer"; // Adjust the path as needed
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// Define the HTML string you want to convert to a Draft.js ContentState
const htmlString = '<p>Hello World!</p>';
// Convert the HTML string to a Draft.js ContentState
const contentState = htmlToDraft(htmlString);


const EditGymDetails = ({ onUpdate, gym }) => {
    const [open, setOpen] = useState(false);
    const [updatedGym, setUpdatedGym] = useState(gym ? { ...gym, bannerUrl: gym.bannerUrl || null } : null);

    const { gyms, leagues } = useDataLayer();
    const [gymLeagues, setGymLeagues] = useState([]);

    // const [leagues, setLeagues] = useState([]);

    const [editorState, setEditorState] = useState(() => {
        if (gym && gym.description) {
            const contentBlock = htmlToDraft(gym.description);
            const contentState = contentBlock
                ? ContentState.createFromBlockArray(contentBlock.contentBlocks)
                : ContentState.createFromText('');
            return EditorState.createWithContent(contentState);
        } else {
            const contentBlock = htmlToDraft(''); // set your default HTML content here
            const contentState = contentBlock
                ? ContentState.createFromBlockArray(contentBlock.contentBlocks)
                : ContentState.createFromText('');
            return EditorState.createWithContent(contentState);
        }
    });
    const [avatarUrl, setAvatarUrl] = useState(gym ? gym.avatarUrl : null);

    useEffect(() => {
        if (gym && gym.leagues) {
            console.log('Setting initial gymLeagues:', gym.leagues);
            setGymLeagues(gym.leagues);
        }
    }, [gym]);

    const handleEditorChange = (state) => {
        setEditorState(state);
        const contentHTML = stateToHTML(state.getCurrentContent());
        setUpdatedGym({ ...updatedGym, description: contentHTML });
    };

    // useEffect(() => {
    //     const fetchGym = async () => {
    //         const gymRef = doc(getFirestore(), 'gyms', id);
    //         const gymDoc = await getDoc(gymRef);
    //         if (gymDoc.exists()) {
    //             const fetchedGym = { id, ...gymDoc.data() };
    //             setGym(fetchedGym);
    //
    //             // Set editor state with the gym's description
    //             const contentBlock = htmlToDraft(fetchedGym.description || '');
    //             const contentState = contentBlock
    //                 ? ContentState.createFromBlockArray(contentBlock.contentBlocks)
    //                 : ContentState.createFromText('');
    //             setEditorState(EditorState.createWithContent(contentState));
    //         }
    //     };
    //
    //     fetchGym();
    // }, [id]);

    const handleLeagueChange = async (event) => {
        const leagueId = event.target.id;
        const isChecked = event.target.checked;

        console.log('Changed league:', leagueId, 'New status:', isChecked);

        let updatedLeagues;
        if (isChecked) {
            // Add the league to the gym document
            updatedLeagues = [...gymLeagues, leagueId];
        } else {
            // Remove the league from the gym document
            updatedLeagues = gymLeagues.filter(id => id !== leagueId);
        }

        console.log('Updated leagues:', updatedLeagues);


        try {
            // Update the gym document in Firestore
            const gymRef = doc(getFirestore(), 'gyms', gym.id);
            await updateDoc(gymRef, { leagues: updatedLeagues });

            // Update the state
            setGymLeagues(updatedLeagues);
        } catch (error) {
            console.error('Error updating gym leagues:', error);
        }
    };


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
            const updateData = {
                name: updatedGym.name,
                description: contentHTML,
                bannerUrl: updatedGym.bannerUrl,
            };

            // Only include avatarUrl in the update if it's not undefined
            if (avatarUrl || gym.avatarUrl) {
                updateData.avatarUrl = avatarUrl || gym.avatarUrl;
            }

            try {
                // Save the updated gym data to Firestore
                const gymRef = doc(getFirestore(), 'gyms', gym.id);
                await updateDoc(gymRef, updateData);

                // Call the onUpdate callback to update the parent component's state
                onUpdate();
                handleClose();
            } catch (error) {
                console.error('Error updating gym:', error);
            }
        }

    };

    const handleAvatarUpload = (newAvatarUrl) => {
        setAvatarUrl(newAvatarUrl);
        setUpdatedGym({ ...updatedGym, avatarUrl: newAvatarUrl });
    };


    const handleBannerUpload = (newBannerUrl) => {
        setUpdatedGym({ ...updatedGym, bannerUrl: newBannerUrl });
    };


    if (!gym) {
        return <div>Loading Gym Information...</div>;
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

                    <WysiwygEditorComponent
                        editorState={editorState}
                        onEditorStateChange={handleEditorChange}
                    />
<Typography variant="h5">Which leagues are you associated with?</Typography>
                    {leagues.map((league) => {
                        // Check if the league's id is in the gymLeagues array
                        console.log('League:', league.id, 'Is in gym leagues:', gymLeagues.includes(league.id));

                        return (
                            <FormControlLabel
                                key={league.id}
                                control={
                                    <Checkbox
                                        id={league.id} // Assign the league's id as the id of the checkbox
                                        checked={gymLeagues.includes(league.id)}
                                        onChange={handleLeagueChange}
                                        name={league.name}
                                    />
                                }
                                label={league.name}
                            />
                        );
                    })}



                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {(avatarUrl || gym.avatarUrl) && (
                                <img
                                    src={`${avatarUrl || gym.avatarUrl}`}
                                    alt="Avatar"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <GymAvatarUpload gymId={gym.id} onAvatarUpload={handleAvatarUpload} />
                        </Grid>
                        <Grid item xs={12}>
                            <GymBannerUpload
                                gymId={gym.id}
                                onBannerUpload={handleBannerUpload}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <GalleryImageUpload gymId={gym.id} />
                        </Grid>
                    </Grid>

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
