import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const GymAvatarUpload = ({ gymId, onAvatarUpload }) => {
    const [avatarFile, setAvatarFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAvatarFile(file);
    };

    const handleAvatarUpload = () => {
        if (gymId && avatarFile) {
            setIsLoading(true);
            const storage = getStorage();

            const metadata = {
                customMetadata: {
                    'id': gymId,
                },
            };
            console.log('Metadata before being passed: ', metadata);

            const avatarRef = ref(storage, `gyms/${gymId}/avatar/temp/${avatarFile.name}`);
            const uploadTask = uploadBytesResumable(avatarRef, avatarFile, metadata);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                },
                (error) => {
                    // Handle unsuccessful uploads
                    console.error("Upload failed:", error);
                },
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        onAvatarUpload(downloadURL);  // Show the original image first

                        const filename = avatarFile.name.split('.')[0];
                        const extension = avatarFile.name.split('.')[1];
                        const resizedAvatarRef = ref(storage, `gyms/${gymId}/avatar/${filename}_200x200.${extension}`);

                        // Start a loop to check for the resized image
                        const checkForResizedImage = setInterval(async () => {
                            try {
                                const resizedUrl = await getDownloadURL(resizedAvatarRef);
                                onAvatarUpload(resizedUrl);  // Show the resized image
                                clearInterval(checkForResizedImage);
                                setIsLoading(false);
                            } catch (error) {
                                // Resized image is not ready yet
                            }
                        }, 5000);  // Check every 5 seconds
                    });
                }
            );
        } else {
            console.error("gymId or avatarFile is not set.");
        }
    };



    console.log('gym avatar gymid', gymId)


    return (
        <>
            <input
                accept="image/*"
                type="file"
                id="avatarUpload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <label htmlFor="avatarUpload">
                <Button component="span" variant="outlined" color="secondary">Upload Avatar</Button>
            </label>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAvatarUpload}
                disabled={isLoading} // Disable the button when isLoading is true
            >
                {isLoading ? <CircularProgress size={24} /> : "Save Avatar"} {/* Render CircularProgress when isLoading is true */}
            </Button>
        </>
    );
};

export default GymAvatarUpload;
