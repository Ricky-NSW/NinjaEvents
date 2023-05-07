import React, { useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from "../../FirebaseSetup";
import LinearProgress from '@mui/material/LinearProgress';

const GymBannerImage = ({ gymId }) => {
    const [bannerImageUrl, setBannerImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the gym's banner image URL
    const fetchBannerImageUrl = async () => {
        const storage = getStorage();
        const imagePath = `gyms/uploads/${gymId}/banner/full_width_banner.jpg`;

        try {
            const downloadURL = await getDownloadURL(ref(storage, imagePath));
            setBannerImageUrl(downloadURL);
        } catch (error) {
            console.log("Error fetching banner image:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the gym's banner image URL on component mount
    React.useEffect(() => {
        fetchBannerImageUrl();
    }, []);

    return (
        <>
            {loading ? (
                <LinearProgress />
            ) : (
                bannerImageUrl && (
                    <img src={bannerImageUrl} alt="Gym banner" style={{ width: '100%' }} />
                )
            )}
        </>
    );
};

export default GymBannerImage;
