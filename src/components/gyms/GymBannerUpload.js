import React, { useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GymBannerUpload = ({ gymId, onBannerUpload }) => {
    const [bannerFile, setBannerFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setBannerFile(file);
    };

    const handleBannerUpload = async () => {
        if (gymId && bannerFile) {
            setIsLoading(true);
            const storage = getStorage();

            // Add _200x200 to the banner filename before uploading
            const resizedFileName = `${bannerFile.name.split(".")[0]}_200x200.${bannerFile.name.split(".")[1]}`;

            // Use resizedFileName instead of bannerFile.name
            const bannerRef = ref(storage, `gyms/uploads/${gymId}/banner/${resizedFileName}`);
            await uploadBytes(bannerRef, bannerFile);

            const downloadUrl = await getDownloadURL(bannerRef);
            onBannerUpload(downloadUrl);
            setIsLoading(false);
        } else {
            console.error("gymId or bannerFile is not set.");
        }
    };


    return (
        <>
            <input
                accept="image/*"
                type="file"
                id="bannerUpload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <label htmlFor="bannerUpload">
                <Button component="span" variant="outlined" color="secondary">Upload Banner</Button>
            </label>
            <Button
                variant="contained"
                color="primary"
                onClick={handleBannerUpload}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} /> : "Save Banner"}
            </Button>
        </>
    );
};

export default GymBannerUpload;
