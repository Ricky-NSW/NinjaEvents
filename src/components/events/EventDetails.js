//TODO make it so that the person who created the event can edit it
//TODO: make it check if there is a league assigned to the event, if there is allow any of the league admins to edit it
//TODO: add a MUI <Switch /> to the event page, when the user clicks the <Switch /> it adds the event id to an array on the 'user' called 'eventSubscriptions'. If they disable the <Switch /> it removes it from the array
//TODO: create a list of all the users who have subscribed for the event
// TODO: allow the gym manager to add a register for this event button which linkns away to the official page
//TODO can we careate a calendar file from the event
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import SubmitResultsForm from "./results/SubmitResultsForm";
import GymCard from "../gyms/GymCard";
import LeagueCard from "../leagues/LeagueCard";
import {formatDate} from '../data/formatDate';
import EditEventDetails from './EditEventDetails';

import {getFirestore, doc, getDoc, updateDoc, getDocs, query, collection, where} from 'firebase/firestore';
import {auth} from "../../FirebaseSetup";

//mui
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import styled from "styled-components";


const EventDelete = styled(Button)`
  margin: 0 0 0 1rem;
  padding: 0;
  min-width: 16px;
`

const EventDetails = ( userType, handleDelete, ) => {
    const { id } = useParams();
    const { events, gyms, leagues, currentUser, getEventById, getGymById, getLeagueById } = useDataLayer();
    const [event, setEvent] = useState(null);
    const [open, setOpen] = useState(false); // state for dialog open/closed
    const [searchBox, setSearchBox] = useState(null);
    const [error, setError] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribedUsers, setSubscribedUsers] = useState([]);
    const [editEventOpen, setEditEventOpen] = useState(false); // state for edit event dialog open/closed
    const [selectedEvent, setSelectedEvent] = useState(null); // state for selected event to edit
    const [gym, setGym] = useState(null); // Add a state for the gym data
    const [league, setLeague] = useState(null); // Add a state for the league data

    useEffect(() => {
        const event = getEventById(id);
        setEvent(event);
        if (event && event.gym && event.league) {
            if (event.gym.id) {
                const gymData = getGymById(event.gym.id);
                setGym(gymData);
            } else {
                setGym(null);
            }
            const leagueData = getLeagueById(event.league.id);
            setLeague(leagueData);
        }
    }, [id, getEventById, getGymById, getLeagueById]);



    //allow user to register (subscribe) to the event
    const handleSubscription = async () => {
        const userRef = doc(getFirestore(), 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const currentSubscriptions = userDoc.data()?.eventSubscriptions ?? [];
            let updatedSubscriptions;
            if (isSubscribed) {
                updatedSubscriptions = currentSubscriptions.filter((eventId) => eventId !== id);
            } else {
                updatedSubscriptions = [...currentSubscriptions, id];
            }

            await updateDoc(userRef, { eventSubscriptions: updatedSubscriptions });
            setIsSubscribed(!isSubscribed);
        }
    };


    //allow user to register for an event
    useEffect(() => {
        const event = getEventById(id);
        setEvent(event);
        if (event) {
            if (event.gym && event.gym.id) {
                const gymData = getGymById(event.gym.id);
                setGym(gymData);
            } else {
                setGym(null);
            }
            if (event.league && event.league.id) {
                const leagueData = getLeagueById(event.league.id);
                setLeague(leagueData);
            } else {
                setLeague(null);
            }
        }
    }, [id, getEventById, getGymById, getLeagueById]);




// fetch subscribed users
    const fetchSubscribedUsers = async () => {
        const usersSnapshot = await getDocs(query(collection(getFirestore(), 'users'), where('eventSubscriptions', 'array-contains', id)));
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubscribedUsers(usersData);
    };

    useEffect(() => {
        fetchSubscribedUsers();
    }, [id]);


    const handleOpen = (event) => {
        setSelectedEvent(event);
        setEditEventOpen(true);
    };

    const handleEditEventClose = () => {
        setSelectedEvent(null);
        setEditEventOpen(false);
    };

    // {event && <div>{console.log("event league", event.league.id)}</div>}

    return (
        <>
        <div>
            {event ? (
                <>
                    <h2>{event.title}</h2>
                    <div>
                        <IsSubscribedSwitch
                            isSubscribed={isSubscribed}
                            handleSubscription={handleSubscription}
                        />
                        <span>Register for this event</span>
                    </div>
                    <p>Description: <span dangerouslySetInnerHTML={{ __html: event.description }}></span></p>
                    <p>Date: {formatDate(event.date)}</p>

                    {/*<p>Location: {gym.name}</p>*/}


                    {gym ? (
                        <>
                            <h3>Event Location</h3>
                            <GymCard gym={gym} />
                        </>
                        )   : (
                        <p>No Location has been set for this event, please contact the event organiser for details</p>
                    )}

                    {league ? (
                            <>
                                <h3>League</h3>
                                <LeagueCard league={league} />
                            </>
                        )  : (
                        <p><i>This event is not associated with any leagues.</i></p>
                        )}

                    {subscribedUsers.length > 0 && (
                        <>
                            <h3>Subscribed Users</h3>
                            <ul>
                                {subscribedUsers.map((user) => (
                                    <li key={user.id}>
                                        <Link to={`/users/${user.id}`}>{user.ninjaName || user.displayName || user.email}</Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <hr />
                    <EditEventDetails
                        open={editEventOpen}
                        handleClose={handleEditEventClose}
                        event={event}
                        gym={gym}
                        leagues={leagues}
                    />


                    {auth.currentUser && (auth.currentUser.uid === event.createdBy || userType === "Admin") ? (
                        <EventDelete
                            onClick={() => handleDelete(event.id)}
                            size="small"
                            color="error"
                            variant="outlined"
                        >
                            <DeleteIcon />
                        </EventDelete>
                    ) : null}


                    {/*//TODO: after the events date has passed show the results of the event - this needs to be a notification for the league and gym owner*/}
                    {/*//TODO: once events results have been added, they should be displayed below*/}
                    <SubmitResultsForm eventId={event.id} eventDate={event.date} />
                    {event.results ? (
                        <>
                        <h3>Event Results</h3>
                        <ul>
                            {event.results.map((result) => (
                                <li key={result.id}>
                                    <Link to={`/users/${result.id}`}>{result.ninjaName || result.displayName || result.email}</Link>
                                </li>
                            ))}
                        </ul>
                        </>
                    ) : (
                        <p>No results yet</p>
                    )}
                    <hr />

                    <br />
                </>

            ) : (
                <p>Loading event details...</p>
            )}
        </div>


        </>
    );
};

export default EventDetails;
