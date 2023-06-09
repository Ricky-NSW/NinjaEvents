import React, { useContext, useEffect, useState } from "react";
import AuthContext from '../../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import CardMedia from "@mui/material/CardMedia";
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
import { useDataLayer, DataLayerContext } from '../data/DataLayer';
import EditLeagueDialog from "./editLeagueDetails";

const LeagueDetails = () => {
    const { id } = useParams();
    const [league, setLeague] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [events, setEvents] = useState([]);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { updateLeague } = useContext(DataLayerContext);

    const {
        getLeagueById,
        fetchLeagues,
        updateUserData,
        fetchEventsForLeague,
        checkUserSubscriptionToLeague,
        updateUserSubscriptionToLeague
    } = useDataLayer();

    // Fetch league data from DataLayer
    // useEffect(() => {
    //     fetchLeagues();
    // }, [fetchLeagues]);

    useEffect(() => {
        const fetchedLeague = getLeagueById(id);
        if (fetchedLeague) {
            setLeague(fetchedLeague);
        }
    }, [id, getLeagueById]);

    // Fetch events associated with the league from DataLayer
    useEffect(() => {
        const eventsData = fetchEventsForLeague(id);
        setEvents(eventsData);
    }, [id, fetchEventsForLeague]);

    // Check if the user is subscribed to this league
    useEffect(() => {
        const isSubscribed = checkUserSubscriptionToLeague(id);
        setIsSubscribed(isSubscribed);
    }, [id, checkUserSubscriptionToLeague]);

    // Handle subscribed/unsubscribed league toggle
    const handleSubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);
        await updateUserSubscriptionToLeague(id, currentUser);
    };

    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    // You can call the function whenever you want to update the league. Here is a sample of how you can call it:
    const updateLeagueDetails = () => {
        const newLeagueData = { name: 'New League Name', /* Add other league details you want to update */ };
        updateLeague(league.id, newLeagueData).then(() => {
            console.log('League details updated successfully');
        }).catch((error) => {
            console.error('Failed to update league details: ', error);
        });
    };

    // console.log('league details user', currentUser)


    return (
        <div>
            {league ? (
                <>
                    <h2>{league.name}</h2>
                    <div>
                        <IsSubscribedSwitch
                            isSubscribed={isSubscribed}
                            handleSubscription={handleSubscribeToggle}
                        />
                        <span>Follow this league</span>
                    </div>
                    <p>{league.description}</p>
                </>
            ) : (
                <p>Loading league details...</p>
            )}

            {(currentUser && league && league.ownerUid && (league.ownerUid.includes(currentUser.uid) || currentUser.type === 'Admin')) ? (
                <>
                    <button onClick={handleEditDialogOpen}>Edit</button>
                    <EditLeagueDialog
                        open={editDialogOpen}
                        handleClose={handleEditDialogClose}
                        league={league}
                        updateLeague={updateLeagueDetails}
                    />
                </>) : null}

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
