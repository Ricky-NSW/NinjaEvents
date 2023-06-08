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
import { Box, Grid, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, CardMedia } from '@mui/material';
import Divider from '@mui/material/Divider';

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
                        // Check if the gym's slug is in the user's subscribedGyms array
                        if (currentUser && Array.isArray(currentUser.subscribedGyms) && currentUser.subscribedGyms.includes(slug)) {
                            setIsSubscribed(true);
                        } else {
                            setIsSubscribed(false);
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
                        <Box
                            // add a border radius of 14 px
                            sx={{ borderRadius: '14px' }}
                        >
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
                        {gym.avatarUrl ? (
                            <Grid
                                item
                                container
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                xs={2}
                                sm={3}
                            >
                                <Grid item>
                                    <Avatar
                                        alt={gym.name}
                                        src={gym.avatarUrl}
                                        // make the avatar fill the width and height
                                        sx={{ width: '100%', height: 'auto', padding: '10px' }}
                                    />
                                </Grid>
                            </Grid>
                        ) : null}
                        <Grid
                            item
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={2}
                            xs={8}
                            sm={9}
                            //text align left
                        >
                            <Grid item>
                                <Typography
                                    variant={"h1"}
                                    sx={{ fontSize: '2rem' }}
                                >
                                    {gym.name}
                                </Typography>
                            </Grid>
                            {currentUser ? (
                                <Grid
                                    item
                                    // display flex so that content are in a row and to the left of the container
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    spacing={0}

                                >
                                        <IsSubscribedSwitch
                                            isSubscribed={isSubscribed}
                                            handleSubscription={handleSubscribeToggle}
                                        />
                                        <span>Follow this Gym</span>
                                </Grid>
                            ) : (
                                <Typography variant={"body2"} >Login to follow this gym and be notified of upcoming events</Typography>)
                            }
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >


                        <Grid item xs={12}>
                            <Typography variant={"body1"}>{gym.location}</Typography>
                            <Typography variant={"body1"}><b>Location:</b> {gym.address}</Typography>
                            <div dangerouslySetInnerHTML={{ __html: gym.description }} />
                        </Grid>
                    </Grid>

                    {/*// loop through this array gym.leagues*/}
                    {/*{gym.leagues && gym.leagues.map((league) => (*/}
                    {/*    <Grid*/}
                    {/*        container*/}
                    {/*        direction="row"*/}
                    {/*        justifyContent="center"*/}
                    {/*            */}
                    {/*        alignItems="center"*/}
                    {/*        spacing={2}*/}
                    {/*    >*/}
                    {/*        <Grid item xs={12}>*/}
                    {/*            <Typography variant={"body1"}><b>League:</b> {league.name}</Typography>*/}
                    {/*        </Grid>*/}
                    {/*    </Grid>*/}
                    {/*))}*/}

                    {/*<Typography variant="body1>{gym.description}</Typography>*/}
                    {/*<Typography variant={"body1"}>{gym.longitude}</Typography>*/}
                    <GoogleMapSingle marker={gym} />
{/*//TODO: Hide the edit and post results buttons from those who are not owneers or admins*/}
                    {/*only users with an id whos id can be found in the gym.ownerUid array can edit the gym, else they can only view the gym*/}
                    {/*check if there is a current user and if the current user id is in the gym.ownerUid array*/}
                    {/*or if the user type = admin*/}
                    {(currentUser && gym && gym.ownerUid && (gym.ownerUid.includes(currentUser.uid) || currentUser.type === 'Admin')) ? (
                    <Grid >
                        <Grid item xs={12} sm={6}>
                            {/*//This component is used to control the modal which contains the gym editing form*/}
                            <EditGymDetails gym={gym} onUpdate={handleGymUpdate} />
                            {/*<GymBannerUpload*/}
                            {/*    gymId={gym.id}*/}
                            {/*    onBannerUpload={(bannerUrl) => {*/}
                            {/*        // console.log("Banner uploaded:", bannerUrl);*/}
                            {/*        updateGymBannerUrl(gym.id, bannerUrl);*/}
                            {/*    }}*/}
                            {/*/>*/}
                            {/*<GalleryImageUpload gymId={gym.id} />*/}
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
            {!isLoading && gym && <Divider>Events at {gym.name}</Divider>}

            {
                gym && events.filter(event => event.gym?.id === gym.id || event.gymId === gym.id).length ? (
                    <Grid container spacing={2} columns={{ xs: 4, md: 12 }}>
                        {events.filter(event => event.gym?.id === gym.id || event.gymId === gym.id).map((event) => (
                            <EventCard key={event.id} event={event} hideGym />
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="h3">There are no upcoming events at this gym</Typography>
                )
            }


            <Typography variant={"body1"}>ID: {gym?.id}</Typography>


        </div>
    );
};

export default GymDetails;
