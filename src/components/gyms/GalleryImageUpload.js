import React, { useState, useEffect } from 'react';
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
} from 'firebase/storage';
import {
    Button,
    Box,
    ImageList,
    ImageListItem,
    Modal,
    IconButton,
} from '@mui/material';

import { CloudUpload, Close } from '@mui/icons-material';

const GalleryImageUpload = ({ gymId }) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageUpload = async (e) => {
        setUploading(true);
        const storage = getStorage();
        const files = e.target.files;

        for (const file of files) {
            const storageRef = ref(storage, `gyms/uploads/${gymId}/gallery/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setImages((prevState) => [...prevState, { src: downloadURL, title: file.name }]);
        }

        setUploading(false);
    };

    const handleOpen = (image) => {
        setSelectedImage(image);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const modalStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const imgStyle = {
        maxWidth: '90%',
        maxHeight: '90%',
    };

    const fetchImages = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, `gyms/uploads/${gymId}/gallery`);
        const imageRefs = await listAll(storageRef);
        const imagePromises = imageRefs.items.map(async (item) => {
            const downloadURL = await getDownloadURL(item);
            return { src: downloadURL, title: item.name };
        });

        const imageArray = await Promise.all(imagePromises);
        setImages(imageArray);
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <Box>
            {/* ... (same as before) */}
            <ImageList cols={4} gap={8}>
                {images.map((item) => (
                    <ImageListItem key={item.title}>
                        <img src={item.src} alt={item.title} loading="lazy" onClick={() => handleOpen(item)} />
                    </ImageListItem>
                ))}
            </ImageList>
            <Modal
                open={open}
                onClose={handleClose}
                style={modalStyle}
                aria-labelledby="image-modal"
                aria-describedby="image-modal-description"
            >
                <Box>
                    <img src={selectedImage?.src} alt={selectedImage?.title} style={imgStyle} />
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </Modal>
        </Box>
    );
};

export default GalleryImageUpload;
