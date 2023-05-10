//GymDetails.js
//TODO: add a MUI love heart icon that acts as a <Switch /> on this Gym page, when the user clicks the <Switch /> it adds the gym id to an array on the 'user' called 'subscribedGyms'. If they disable the <Switch /> it removes it from the array
// TODO: SHow all the events that are taking place at this gym
// TODO: check through all events, look for events with the gym array. if an event has this gym's id in the gym.id document then show that event
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, updateDoc, getDoc, collection, query, where, onSnapshot, arrayUnion, arrayRemove, } from 'firebase/firestore';
import CardMedia from "@mui/material/CardMedia";
import GoogleMapSingle from "../api/GoogleMapSingle";
import GoogleMapsApi from "../api/GoogleMapsApi";
import {auth, db} from "../../FirebaseSetup";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Switch from '@mui/material/Switch';
import { useParams, Link } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import {red} from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import EditGymDetails from './EditGymDetails';
import GymBannerImage from "./GymBannerImage";
import GymBannerUpload from "./GymBannerUpload";
import Box from '@mui/material/Box';
import GalleryImageUpload from './GalleryImageUpload';

//dialogue
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

//notifications
import { requestNotificationPermission } from '../messaging/fcm';
import IsSubscribedSwitch from "../user/isSubscribedSwitch";


// GymDetails component
const GymDetails = () => {
    const { id } = useParams();
    const [gym, setGym] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [events, setEvents] = useState([]);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    // const [editDialogOpen, setEditDialogOpen] = useState(false);

    // Fetch gym data from Firestore using gym ID
    useEffect(() => {
        const fetchGym = async () => {
            const gymRef = doc(getFirestore(), 'gyms', id);
            const gymDoc = await getDoc(gymRef);
            if (gymDoc.exists()) {
                setGym({ id, ...gymDoc.data() });
            }
        };

        fetchGym();
    }, [id]);

    // Fetch events associated with the gym from Firestore
    useEffect(() => {
        const fetchEvents = async () => {
            const db = getFirestore();
            const eventsRef = collection(db, 'events');
            const q = query(eventsRef, where('gym.id', '==', id));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const eventsData = [];
                querySnapshot.forEach((doc) => {
                    eventsData.push({ id: doc.id, ...doc.data() });
                });
                setEvents(eventsData);
            });

            return () => unsubscribe();
        };

        fetchEvents();
    }, [id]);


    // Check if the user is subscribed to this gym
    useEffect(() => {
        const checkSubscribedGym = async () => {
            if (auth.currentUser) {
                const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const subscribedGyms = userDoc.data().subscribedGyms || [];
                    setIsSubscribed(subscribedGyms.some(gym => gym.id === id));
                }
            }
        };


        checkSubscribedGym();
    }, [id, auth.currentUser]);

    // Handle subscribed/unsubscribed gym toggle
    const handlesubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);
        const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
        const gymRef = doc(getFirestore(), "gyms", id);
        const gymDoc = await getDoc(gymRef);
        const gymName = gymDoc.data().name;

        if (!isSubscribed) {
            await updateDoc(userRef, {
                subscribedGyms: arrayUnion({ id, name: gymName }),
            });
        } else {
            await updateDoc(userRef, {
                subscribedGyms: arrayRemove({ id, name: gymName }),
            });
        }
    };

    const handleGymUpdate = async () => {
        // Fetch the updated gym data and update the state
        const gymRef = doc(getFirestore(), 'gyms', id);
        const gymSnap = await getDoc(gymRef);
        setGym(gymSnap.data());
    };


    // Functions to open and close the map dialog
    const openMapDialog = () => {
        setMapDialogOpen(true);
    };

    const closeMapDialog = () => {
        setMapDialogOpen(false);
    };

    const updateGymBannerUrl = async (gymId, bannerUrl) => {
        const db = getFirestore();
        const gymDocRef = doc(db, 'gyms', gymId);

        try {
            await updateDoc(gymDocRef, { bannerUrl });
            console.log('Gym banner URL updated successfully');

            // Fetch the updated gym data and update the state
            const gymSnap = await getDoc(gymDocRef);
            setGym({ id: gymId, ...gymSnap.data() });
        } catch (error) {
            console.error('Error updating gym banner URL:', error);
        }
    };

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
                                    handleSubscription={handlesubscribeToggle}
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



                    <Grid >
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
                <p>Loading gym details...</p>
            )}

            {/* Display events associated with the gym */}

            {/*//TODO: wrap this in a ternary so that it only shows if there are events*/}
            {events.length > 0 ? (
                events.map((event) => (
                    <>
                        {events.map((event) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={event.id} sx={{ marginBottom: 2 }}>
                                <Card sx={{ maxWidth: 768 }}>
                                    {/* Event card header */}
                                    {/* Event card header */}
                                    <CardHeader
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                        title={event.address}
                                        subheader={event.date}
                                    />


                                    {
                                        event.imageUrl ? (
                                            <CardMedia
                                                sx={{ height: 140 }}
                                                image={event.imageUrl}
                                                title="green iguana"
                                                type="image"
                                            />
                                        ) : (
                                            null
                                        )
                                    }
                                    {/* Event details */}
                                    {/*TODO: make this card a component and pass the data as props*/}
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            <Link component={Link} to={`/events/` + (event.id)} size="small">{event.title}</Link>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {event.description}

                                            {/*{description.length > maxLength*/}
                                            {/*    ? description.substring(0, maxLength) + '...'*/}
                                            {/*    : description;}*/}
                                        </Typography>
                                        <Typography>
                                            <span>Gym: {event.gym.name}</span>
                                        </Typography>
                                        <Typography>
                                            <span>Price: {event.price}</span>
                                        </Typography>
                                        <Typography>
                                            <span>Age: {event.age}</span>
                                            {/*{event.GeoPoint.latitude} {event.GeoPoint.longitude}*/}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">Share</Button>
                                        <Button component={Link} to={`/events/` + (event.id)} size="small">Learn More</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </>
                ))
            ) : (
                <p>No events found for this gym.</p>
            )}



        </div>
    );
};

export default GymDetails;
