import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDataLayer } from '../data/DataLayer';
import WysiwygEditorComponent from "../layout/tools/WysiwygEditorComponent";
import AvatarUpload from '../data/AvatarUpload';
const EditLeagueDialog = ({ isOpen, leagueId, onClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const { getLeagueById, updateLeague } = useDataLayer();
    const [league, setLeague] = useState(null);
    const [editorContent, setEditorContent] = useState(''); // Initialize to empty string
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        if (leagueId) {
            const leagueData = getLeagueById(leagueId);
            setLeague(leagueData);
            setName(leagueData.name);
            setDescription(leagueData.description);
            setEditorContent(leagueData.description); // Set editorContent here
        }
    }, [leagueId, getLeagueById]);

    const handleSave = async () => {
        if (league) {
            await updateLeague(leagueId, {
                ...league,
                name,
                description: editorContent, // Here, use editorContent.

            });
            onClose();
        }
    };

    const myAvatarUploadFunction = (avatarUrl) => {
        console.log("Avatar URL:", avatarUrl);
        setAvatarUrl(avatarUrl);
    }

    return (
        <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Edit League</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To edit this league, please enter the new name and description here.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="League Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                {/*<TextField*/}
                {/*    margin="dense"*/}
                {/*    id="description"*/}
                {/*    label="Description"*/}
                {/*    type="text"*/}
                {/*    fullWidth*/}
                {/*    value={description}*/}
                {/*    onChange={e => setDescription(e.target.value)}*/}
                {/*/>*/}

                <WysiwygEditorComponent
                    initialContent={editorContent}
                    handleContentChange={(content, delta, source, editor) => {
                        console.log("Editor content changed:", content);
                        setEditorContent(content);
                    }}
                />

                <AvatarUpload
                    entityId={leagueId}
                    entityType="leagues"
                    onAvatarUpload={myAvatarUploadFunction}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditLeagueDialog;
