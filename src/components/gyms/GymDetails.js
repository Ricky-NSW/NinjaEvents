//GymDetails.js

//what does this do?
// dispatch({
//     type: 'SET_GYM',
//     gym: gymDetails,
// });
//TODO: add a MUI love heart icon that acts as a <Switch /> on this Gym page, when the user clicks the <Switch /> it adds the gym id to an array on the 'user' called 'subscribedGyms'. If they disable the <Switch /> it removes it from the array
// TODO: SHow all the events that are taking place at this gym
// TODO: check through all events, look for events with the gym array. if an event has this gym's id in the gym.id document then show that event
import React, { useEffect, useState, useContext } from 'react';
import { getFirestore, doc, updateDoc, getDoc, collection, query, where, onSnapshot, arrayUnion, arrayRemove, } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, CardMedia } from '@material-ui/core';

// Import components
import GoogleMapSingle from "../api/GoogleMapSingle";
import { useDataLayer } from '../data/DataLayer';
import AuthContext from '../../contexts/AuthContext';
import { auth, db } from "../../FirebaseSetup";
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import EventCard from "../events/EventCard";
import EditGymDetails from './EditGymDetails';
import GymBannerUpload from './GymBannerUpload';
import GalleryImageUpload from './GalleryImageUpload';

// Import UI elements
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Switch from '@mui/material/Switch';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { red } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import GymBannerImage from "./GymBannerImage";

// Import notifications
import { requestNotificationPermission } from '../messaging/fcm';

const GymDetails = () => {
    const { events, getGymBySlug, gyms, updateGymBannerUrl, isLoading } = useDataLayer();
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const { slug } = useParams();

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    const [gym, setGym] = useState(null);

    useEffect(() => {
        if (!isLoading) {
            const fetchGym = async () => {
                try {
                    setGym(null);
                    const gymDetails = await getGymBySlug(slug);

                    if (gymDetails) {
                        setGym(gymDetails);
                        if (currentUser && gymDetails.subscribers.includes(currentUser.id)) {
                            setIsSubscribed(true);
                        }
                    } else {
                        console.error('Error fetching gym: gymDetails is', gymDetails);
                    }

                } catch (error) {
                    console.error('Error fetching gym:', error);
                }
            };
            fetchGym();
        }
        {gym && console.log('gymDetails GymID', gym.id);}

    }, [slug, currentUser, getGymBySlug, gyms, isLoading]);

    const handleSubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);
        const userDoc = doc(db, 'users', currentUser.uid);
        if (!isSubscribed) {
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
        setGym(updatedGym);
    };

    const openMapDialog = () => {
        setMapDialogOpen(true);
    };

    const closeMapDialog = () => {
        setMapDialogOpen(false);
    };


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
                    {/*<Typography variant="body1>{gym.description}</Typography>*/}
                    <div dangerouslySetInnerHTML={{ __html: gym.description }} />

                    <GoogleMapSingle marker={gym} />

                    {/*only users with an id whos id can be found in the gym.ownerUid array can edit the gym, else they can only view the gym*/}
                    {/*check if there is a current user and if the current user id is in the gym.ownerUid array*/}
                    {/*or if the user type = admin*/}
                    {(currentUser && (gym.ownerUid.includes(currentUser.uid) || currentUser.type === 'Admin')) ? (
                    <Grid >
                        <Grid item xs={12} sm={6}>
                            {/*//This component is used to control the modal which contains the gym editing form*/}
                            {/*<EditGymDetails gym={gym} onUpdate={handleGymUpdate} />*/}
                            <EditGymDetails id={gym.id} onUpdate={handleGymUpdate} />
                            <GymBannerUpload
                                gymId={gym.id}
                                onBannerUpload={(bannerUrl) => {
                                    // console.log("Banner uploaded:", bannerUrl);
                                    updateGymBannerUrl(gym.id, bannerUrl);
                                }}
                            />
                            <GalleryImageUpload gymId={gym.id} />
                        </Grid>
                    </Grid>
                    ) : (
                        <Typography>Only the owner of this gym can edit it</Typography>
                    )}


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
            <Typography variant={"h2"}>Events</Typography>
            {
                gym && events.filter(event => event.gym !== null && event.gym.id === gym.id).length ? (
                    <Grid container spacing={2} columns={{ xs: 4, md: 12 }}>
                        {events.filter(event => event.gym !== null && event.gym.id === gym.id).map((event) => (
                            <EventCard event={event} hideGym />
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h3">There are no upcoming events at this gym</Typography>
                )
            }


        </div>
    );
};

export default GymDetails;
