//GymDetails.js
//TODO: add a MUI love heart icon that acts as a <Switch /> on this Gym page, when the user clicks the <Switch /> it adds the gym id to an array on the 'user' called 'subscribedGyms'. If they disable the <Switch /> it removes it from the array
// TODO: SHow all the events that are taking place at this gym
// TODO: check through all events, look for events with the gym array. if an event has this gym's id in the gym.id document then show that event
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, updateDoc, getDoc, collection, query, where, onSnapshot, arrayUnion, arrayRemove, } from 'firebase/firestore';
import GoogleMapSingle from "../api/GoogleMapSingle";
import { useDataLayer } from '../data/DataLayer';

import GoogleMapsApi from "../api/GoogleMapsApi";
import {auth, db} from "../../FirebaseSetup";
import { useDataLayerValue } from '../data/DataLayer'; // or wherever your DataLayer.js file is located

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Switch from '@mui/material/Switch';
import { useParams, Link } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import {red} from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import GymBannerImage from "./GymBannerImage";

//notifications
import { requestNotificationPermission } from '../messaging/fcm';
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import EventCard from "../events/EventCard";

import { Box, Grid, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, CardMedia } from '@material-ui/core';
import EditGymDetails from './EditGymDetails';
import GymBannerUpload from './GymBannerUpload';
import GalleryImageUpload from './GalleryImageUpload';

const GymDetails = () => {
    // Using custom hook to access the data layer
    const { events, currentUser, getGymById, gyms, updateGymBannerUrl } = useDataLayer();

    // Getting gym ID from the URL params
    const { id } = useParams();
    // Local state to hold current gym details
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);

    // Local state to hold current gym details
    const [gym, setGym] = useState(null);

    useEffect(() => {
        const fetchGym = async () => {
            console.log(id);

            // Getting gym details by ID
            const gymDetails = await getGymById(id);
            setGym(gymDetails);

            // Checking if the user is subscribed to the gym
            if (currentUser && gymDetails && gymDetails.subscribers.includes(currentUser.id)) {
                setIsSubscribed(true);
            }
        };

        fetchGym();
    }, [gyms, id, currentUser, getGymById]);



    const handleSubscribeToggle = async () => {
        // Toggle subscription status
        setIsSubscribed(!isSubscribed);

        // Updating 'subscribedGyms' in the user document
        const userDoc = doc(db, 'users', currentUser.uid); // 'users' should be replaced with your user collection name
        if(!isSubscribed){
            await updateDoc(userDoc, {
                subscribedGyms: arrayUnion(id)
            });
        } else {
            await updateDoc(userDoc, {
                subscribedGyms: arrayRemove(id)
            });
        }
    };


    // Function to check if a user is subscribed to a gym.
    const isUserSubscribedToGym = (gymId) => {
        if (!currentUser) return false; // If no user is logged in, return false.
        // Check if the gym's subscribers array includes the current user's id.
        const gym = gyms.find((g) => g.id === gymId);
        return gym.subscribers.includes(currentUser.uid);
    };

    const handleGymUpdate = (updatedGym) => {
        // Update gym state with the updated gym details
        setGym(updatedGym);
        // TODO: Implement method to update gym details in the database
    };

    const openMapDialog = () => {
        setMapDialogOpen(true);
    };

    const closeMapDialog = () => {
        setMapDialogOpen(false);
    };

    console.log('evvent deails gym', gym)

    return (
        <div>
            {gym ? (
                <>
                    {gym.bannerUrl && (
                        <Box sx={{ mx: -2, mb: 2 }}> {/* Adjust the value according to your needs */}
                            <CardMedia
                                component="img"
                                alt={gym.name}
                                height="auto"
                                image={gym.bannerUrl}
                                title={gym.name}
                                sx={{ width: '100%' }}
                            />
                        </Box>
                    )}

                    {/*<Button variant="contained" onClick={sendNotification}>Send Test Notification</Button>*/}
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item xs={10} sm={6}>
                            <Typography variant={"h1"}>{gym.name}</Typography>
                        </Grid>
                        <Grid item xs={2} sm={6}>
                            {gym.avatarUrl ? (
                                <Avatar alt={gym.name} src={gym.avatarUrl} />
                            ) : null}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IsSubscribedSwitch
                                    isSubscribed={isSubscribed}
                                    handleSubscription={handleSubscribeToggle}
                                />
                                <span>Follow this Gym</span>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography>{gym.location}</Typography>
                            <Typography>Location: {gym.address}</Typography>

                        </Grid>
                    </Grid>
                    {/*<Typography variant={"p"}>{gym.description}</Typography>*/}
                    <div dangerouslySetInnerHTML={{ __html: gym.description }} />
                    <Grid>
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" onClick={openMapDialog}>Show Map</Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/*//This component is used to control the modal which contains the gym editing form*/}
                            {/*<EditGymDetails gym={gym} onUpdate={handleGymUpdate} />*/}
                            <EditGymDetails onUpdate={handleGymUpdate} />
                            <GymBannerUpload
                                gymId={gym.id}
                                onBannerUpload={(bannerUrl) => {
                                    console.log("Banner uploaded:", bannerUrl);
                                    updateGymBannerUrl(gym.id, bannerUrl);
                                }}
                            />
                            <GalleryImageUpload gymId={gym.id} />
                        </Grid>
                    </Grid>
                    <Dialog
                        open={mapDialogOpen}
                        onClose={closeMapDialog}
                        aria-labelledby="map-dialog-title"
                    >
                        <DialogTitle id="map-dialog-title">Gym Location</DialogTitle>
                        {/*TODO: Set the width of the dialigue to fill more space*/}
                        <DialogContent
                            fullWidth
                            maxWidth="xs"
                        >
                            <GoogleMapSingle marker={gym} />
                        </DialogContent>
                    </Dialog>

                </>
            ) : (
                <Typography>Loading gym details...</Typography>
            )}

            {/* Display events associated with the gym */}

            {/*//TODO: wrap this in a ternary so that it only shows if there are events*/}
            {events.length > 0 ? (
                events.filter(event => event.gym.id === id).map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        hideGym={true}
                    />
                ))
            ) : (
                <Typography>No upcoming events at this gym.</Typography>
            )}




        </div>
    );
};

export default GymDetails;
