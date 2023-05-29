import React, { useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GymAvatarUpload = ({ gymId, onAvatarUpload }) => {
    const [avatarFile, setAvatarFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAvatarFile(file);
    };

    const handleAvatarUpload = async () => {
        if (gymId && avatarFile) {
            setIsLoading(true);
            const storage = getStorage();

            // Upload the original image
            const avatarRef = ref(storage, `gyms/${gymId}/avatar/temp/${avatarFile.name}`);
            await uploadBytes(avatarRef, avatarFile);

            // Get the URL of the original image
            const originalUrl = await getDownloadURL(avatarRef);

            // Show the original image first
            onAvatarUpload(originalUrl);

            // Get the expected path of the resized image
            const filename = avatarFile.name.split('.')[0];
            const extension = avatarFile.name.split('.')[1];
            // check here for the processed image at a different location
            const resizedAvatarRef = ref(storage, `gyms/${gymId}/avatar/${filename}_200x200.${extension}`);

            // Start a loop to check for the resized image
            const checkForResizedImage = setInterval(async () => {
                try {
                    // Try to get the URL of the resized image
                    const resizedUrl = await getDownloadURL(resizedAvatarRef);

                    // If getting the URL is successful, that means the resized image is ready
                    onAvatarUpload(resizedUrl);

                    // Clear the interval after the resized image is found
                    clearInterval(checkForResizedImage);
                    setIsLoading(false);
                } catch (error) {
                    // If getting the URL is not successful, that means the resized image is not ready yet
                    // So, do nothing and wait for the next interval
                }
            }, 5000); // Check every 5 seconds
        } else {
            console.error("gymId or avatarFile is not set.");
        }
    };




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
