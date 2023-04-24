import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    getDocs,
    query,
    collection, where, onSnapshot
} from 'firebase/firestore';
import CardMedia from "@mui/material/CardMedia";
import { auth } from "../../FirebaseSetup";
import Switch from "@mui/material/Switch";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import { requestNotificationPermission } from './../messaging/fcm';
import Grid from "@mui/material/Grid";
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

const LeagueDetails = () => {
    const { id } = useParams();
    const [league, setLeague] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [events, setEvents] = useState([]);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);

    // Fetch league data from Firebase Firestore
    useEffect(() => {
        // The issue was here, you missed the 'id' in the doc function
        const leagueRef = doc(getFirestore(), 'leagues', id);
        const getLeague = async () => {
            const leagueDoc = await getDoc(leagueRef);
            if (leagueDoc.exists()) {
                setLeague(leagueDoc.data());
            }
        };

        getLeague();
    }, [id]);

    // Fetch events associated with the league from Firestore
    useEffect(() => {
        const fetchEvents = async () => {
            const db = getFirestore();
            const eventsRef = collection(db, 'events');
            const q = query(eventsRef, where('league.id', '==', id));

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

    // Check if the user is subscribed to this league
    useEffect(() => {
        const checkSubscribedLeague = async () => {
            if (auth.currentUser) {
                const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const subscribedLeagues = userDoc.data().subscribedLeagues || [];
                    setIsSubscribed(subscribedLeagues.some(league => league.id === id));
                }
            }
        };

        checkSubscribedLeague();
    }, [id, auth.currentUser]);

    // Handle subscribed/unsubscribed league toggle
    const handlesubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);
        const userRef = doc(getFirestore(), "users", auth.currentUser.uid);
        const leagueRef = doc(getFirestore(), "leagues", id);
        const leagueDoc = await getDoc(leagueRef);
        const leagueName = leagueDoc.data().name;

        if (!isSubscribed) {
            await updateDoc(userRef, {
                subscribedLeagues: arrayUnion({ id, name: leagueName }),
            });
        } else {
            await updateDoc(userRef, {
                subscribedLeagues: arrayRemove({ id, name: leagueName }),
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
            {league ? (
                <>
                    <h2>{league.name}</h2>
                    <div>
                        <IsSubscribedSwitch
                            isSubscribed={isSubscribed}
                            handleSubscription={handlesubscribeToggle}
                        />
                        <span>Follow this league</span>
                    </div>
                    <p>{league.description}</p>
                </>
            ) : (
                <p>Loading league details...</p>
            )}

            {/*//TODO: wrap this in a ternary so that it only shows if there are events*/}

            <Typography variant={"h2"}>Upcoming Events</Typography>
            {/* Display events associated with the league */}
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
                                <span>League: {event.league.name}</span>
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

export default LeagueDetails;
