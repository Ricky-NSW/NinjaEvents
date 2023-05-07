import React, { useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UserAvatarUpload = ({ userId, onAvatarUpload }) => {
    const [avatarFile, setAvatarFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAvatarFile(file);
    };

    const handleAvatarUpload = async () => {
        if (userId && avatarFile) {
            setIsLoading(true); // Set isLoading to true before starting the upload process
            const storage = getStorage();
            const avatarRef = ref(storage, `users/uploads/${userId}/${avatarFile.name}`);
            await uploadBytes(avatarRef, avatarFile);

            const filename = avatarFile.name.split('.')[0];
            const extension = avatarFile.name.split('.')[1];
            const resizedAvatarRef = ref(storage, `users/uploads/${userId}/avatars/${filename}_200x200.${extension}`);
            console.log("Resized avatar reference:", resizedAvatarRef);

            const downloadUrl = await getDownloadURL(resizedAvatarRef);
            onAvatarUpload(downloadUrl);
            setIsLoading(false); // Set isLoading to false after the upload process is complete
        } else {
            console.error("userId or avatarFile is not set.");
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

export default UserAvatarUpload;
