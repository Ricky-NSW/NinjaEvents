//GymDetails.js
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
import EditGymDetails from './EditGymDetails';


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


    // Functions to open and close the map dialog
    const openMapDialog = () => {
        setMapDialogOpen(true);
    };

    const closeMapDialog = () => {
        setMapDialogOpen(false);
    };


    return (
        <div>
            {gym ? (
                <>
                    <div>
                        <IsSubscribedSwitch
                            isSubscribed={isSubscribed}
                            handleSubscription={handlesubscribeToggle}
                        />
                        <span>Follow this Gym</span>
                    </div>
                    {/*<Button variant="contained" onClick={sendNotification}>Send Test Notification</Button>*/}
                    <Typography variant={"h1"}>{gym.name}</Typography>
                    <p>{gym.location}</p>
                    <p>Location: {gym.address}</p>
                    {/*<Typography variant={"p"}>{gym.description}</Typography>*/}
                    <div dangerouslySetInnerHTML={{ __html: gym.description }} />

                    <Grid >
                        <Grid item xs={12} sm={6}>
                            <Button variant="contained" onClick={openMapDialog}>Show Map</Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* Pass the `editDialogOpen` state as open prop and `modalClosed` as handleClose prop */}
                            {/*<EditGymDetails open={editDialogOpen} handleClose={modalClosed} gym={gym} />*/}
                            <EditGymDetails gym={gym} />

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
