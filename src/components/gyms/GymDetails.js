//GymDetails.js

//what does this do?
// dispatch({
//     type: 'SET_GYM',
//     gym: gymDetails,
// });
//TODO: add a MUI love heart icon that acts as a <Switch /> on this Gym page, when the user clicks the <Switch /> it adds the gym id to an array on the 'user' called 'subscribedGyms'. If they disable the <Switch /> it removes it from the array
// TODO: SHow all the events that are taking place at this gym
// TODO: check through all events, look for events with the gym array. if an event has this gym's id in the gym.id document then show that event
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, updateDoc, getDoc, collection, query, where, onSnapshot, arrayUnion, arrayRemove, } from 'firebase/firestore';
import GoogleMapSingle from "../api/GoogleMapSingle";
// import { useDataLayer } from '../data/DataLayer';

import GoogleMapsApi from "../api/GoogleMapsApi";
import {auth, db} from "../../FirebaseSetup";
import { useDataLayer } from '../data/DataLayer';

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
    const { events, currentUser, getGymBySlug, gyms, updateGymBannerUrl, isLoading } = useDataLayer();

    // Getting gym slug from the URL params
    const { slug } = useParams();

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);

    const [gym, setGym] = useState(null);

    useEffect(() => {
        if (!isLoading) {
            const fetchGym = async () => {
                try {
                    console.log('Fetching gym:', slug);
                    setGym(null);  // set gym to null before fetching
                    const gymDetails = await getGymBySlug(slug);
                    console.log('Fetched gym details:', gymDetails);
                    console.log('All gyms:', gyms); // Log all the gyms from the data layer
                    setGym(gymDetails);
                    if (currentUser && gymDetails && gymDetails.subscribers.includes(currentUser.id)) {
                        setIsSubscribed(true);
                    }
                } catch (error) {
                    console.error('Error fetching gym:', error);
                }
            };

            fetchGym();
        }
    }, [slug, currentUser, getGymBySlug, gyms, isLoading]);



    const handleSubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);

        const userDoc = doc(db, 'users', currentUser.uid);
        if(!isSubscribed){
            await updateDoc(userDoc, {
                subscribedGyms: arrayUnion(slug) // Change id to slug
            });
        } else {
            await updateDoc(userDoc, {
                subscribedGyms: arrayRemove(slug) // Change id to slug
            });
        }
    };

    const handleGymUpdate = (updatedGym) => {
        // Update gym state with the updated gym details
        setGym(updatedGym);
        console.log('Updated gym:', updatedGym);

        // TODO: Implement method to update gym details in the database
    };

    const openMapDialog = () => {
        setMapDialogOpen(true);
    };

    const closeMapDialog = () => {
        setMapDialogOpen(false);
    };

    console.log('Event details gym:', gyms);


    return (
        <div>
            {isLoading ? (
                <Typography>Loading gym details...</Typography>
            ) : gym ? (
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
                            <p>{gym.location}</p>
                            <p>Location: {gym.address}</p>

                        </Grid>
                    </Grid>
                    {/*<Typography variant={"p"}>{gym.description}</Typography>*/}
                    <div dangerouslySetInnerHTML={{ __html: gym.description }} />

                    <GoogleMapSingle marker={gym} />

                    <Grid >
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" onClick={openMapDialog}>Show Map</Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/*//This component is used to control the modal which contains the gym editing form*/}
                            {/*<EditGymDetails gym={gym} onUpdate={handleGymUpdate} />*/}
                            <EditGymDetails id={gym.id} onUpdate={handleGymUpdate} />
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

                    {/*//This is the modal which contains the map*/}
                    {/*<Dialog*/}
                    {/*    open={mapDialogOpen}*/}
                    {/*    onClose={closeMapDialog}*/}
                    {/*    aria-labelledby="map-dialog-title"*/}
                    {/*>*/}
                    {/*    <DialogTitle id="map-dialog-title">Gym Location</DialogTitle>*/}
                    {/*    /!*TODO: Set the width of the dialigue to fill more space*!/*/}
                    {/*    <DialogContent*/}
                    {/*        fullWidth*/}
                    {/*        maxWidth="xs"*/}
                    {/*    >*/}
                    {/*        <GoogleMapSingle marker={gym} />*/}
                    {/*    </DialogContent>*/}
                    {/*</Dialog>*/}
                </>
            ) : (
                <Typography>Could not find gym with slug: {slug}</Typography>
            )}
            <Grid container spacing={2}>
                {events.map((event) => (
                    <Grid item xs={12} sm={6} md={4} key={event.id}>
                        <EventCard event={event} />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default GymDetails;
