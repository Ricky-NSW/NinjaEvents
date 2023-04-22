// TODO: add a createdDate prop
//TODO: ratings for gyms
//TODO: add a MUI love heart icon that acts as a <Switch /> on this Gym page, when the user clicks the <Switch /> it adds the gym id to an array on the 'user' called 'subscribedGyms'. If they disable the <Switch /> it removes it from the array
// TODO: SHow all the events that are taking place at this gym
// TODO: check through all events, look for events with the gym array. if an event has this gym's id in the gym.id document then show that event
import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import CardMedia from "@mui/material/CardMedia";
import GoogleMapSingle from "../api/GoogleMapSingle";
import GoogleMapsApi from "../api/GoogleMapsApi";
import {auth, db} from "../../FirebaseSetup";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Switch from '@mui/material/Switch';
import { updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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


//dialogue
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

//notifications
import { requestNotificationPermission } from '../messaging/fcm';


// GymDetails component
const GymDetails = () => {
    const { id } = useParams();
    const [gym, setGym] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [events, setEvents] = useState([]);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    // Fetch gym data from Firestore using gym ID
    useEffect(() => {
        const gymRef = doc(getFirestore(), 'gyms', id);

        const getGym = async () => {
            const gymDoc = await getDoc(gymRef);
            if (gymDoc.exists()) {
                console.log('gymDoc:', gymDoc.data());
                setGym(gymDoc.data());
                console.log('gym state:', gym);
            }
        };


        getGym();
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

    // Handle subscribed/unsubscribed gym toggle
    const handleLikeToggle = async () => {
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



    // Check if the gym is subscribed by the current user
    useEffect(() => {
        const checkSubscribedGym = async () => {
            if (auth.currentUser) {
                const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const subscribedGyms = userDoc.data().subscribedGyms || [];
                    setIsSubscribed(subscribedGyms.includes(id));
                }
            }
        };

        checkSubscribedGym();
    }, [id, auth.currentUser]);

    // Functions to open and close the map dialog
    const openMapDialog = () => {
        setMapDialogOpen(true);
    };

    const closeMapDialog = () => {
        setMapDialogOpen(false);
    };

    // Listen for new events created with this gym's id in the event.gym array - for notifications
    useEffect(() => {
        const fetchNewEvents = async () => {
            const db = getFirestore();
            const eventsRef = collection(db, 'events');
            const q = query(eventsRef, where('gym.id', '==', id));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        const newEvent = { id: change.doc.id, ...change.doc.data() };
                        sendNotification(newEvent);
                    }
                });
            });

            return () => unsubscribe();
        };

        if (isSubscribed) {
            fetchNewEvents();
        }
    }, [id, isSubscribed]);

    // Send a notification to the user when a new event is created
    const sendNotification = async (newEvent) => {
        console.log("New event created:", newEvent);

        // Request notification permission and get FCM token
        const token = await requestNotificationPermission();

        if (token) {
            // Create notification options
            const notificationOptions = {
                body: `A new event "${newEvent.title}" has been added at ${newEvent.gym.name}!`,
            };

            // Show notification
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(notificationOptions.title, notificationOptions);
            });
        }
    };





    // Render the component
    console.log('found events', events);
    return (
        <div>
            {gym ? (
                <>
                {/*{gym.name ? <h2>{gym.name}</h2> : null }*/}
                    <div>
                        <Switch
                            checked={isSubscribed}
                            onChange={handleLikeToggle}
                            icon={<FavoriteBorderIcon />}
                            checkedIcon={<FavoriteIcon />}
                        />
                    </div>
                    <Button variant="contained" onClick={sendNotification}>Send Test Notification</Button>

                    <p>{gym.location}</p>
                    <p>Location: {gym.address}</p>
                    <Button variant="contained" onClick={openMapDialog}>Show Map</Button>
                    <Dialog
                        open={mapDialogOpen}
                        onClose={closeMapDialog}
                        aria-labelledby="map-dialog-title"
                    >
                        <DialogTitle id="map-dialog-title">Gym Location</DialogTitle>
                        <DialogContent>
                            <GoogleMapSingle marker={gym} />
                        </DialogContent>
                    </Dialog>

                </>
            ) : (
                <p>Loading gym details...</p>
            )}


            {/*//TODO: wrap this in a ternary so that it only shows if there are events*/}

            {/* Display events associated with the gym */}
            {events.map((event) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={event.id} sx={{ marginBottom: 2 }}>
                    <Card sx={{ maxWidth: 768 }}>
                        {/* Event card header */}
                        <CardHeader
                            avatar={
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    {event.createdBy ? event.createdBy.charAt(0) : "X"}
                                </Avatar>
                            }
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


        </div>
    );
};

export default GymDetails;
