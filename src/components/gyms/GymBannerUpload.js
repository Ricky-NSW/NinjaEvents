import React, { useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const GymBannerUpload = ({ gymId, onBannerUpload }) => {
    const [bannerFile, setBannerFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Add a check to ensure the file is an image
        if (!file.type.startsWith('image/')) {
            console.error("File type must be an image.");
            return;
        }

        setBannerFile(file);
    };

    const handleBannerUpload = async () => {
        if (gymId && bannerFile) {
            setIsLoading(true);
            const storage = getStorage();

            // Add _banner to the banner filename before uploading
            const resizedFileName = `${bannerFile.name.split(".")[0]}_banner.${bannerFile.name.split(".")[1]}`;

            // Use resizedFileName instead of bannerFile.name
            const bannerRef = ref(storage, `gyms/uploads/${gymId}/banner/${resizedFileName}`);
            try {
                await uploadBytes(bannerRef, bannerFile);
                const downloadUrl = await getDownloadURL(bannerRef);
                onBannerUpload(downloadUrl);
            } catch (error) {
                console.error("Error uploading banner:", error);
            } finally {
                setIsLoading(false);
            }
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
