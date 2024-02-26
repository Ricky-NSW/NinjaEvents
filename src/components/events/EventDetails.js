// this component shows the data from a document inside the 'events' collection
// Each event document has a field called gymId which contains the id of one of the gyms in the gyms collections.
//     Some events also have a leagueId which is the id of a league from the leagues collection.
//     Each gym and league has a field called ownerUid which is a id of a user from the users collection.
//
//     For each event I would like to find the corresponding gym and league and get the data for that gym and league.
//
//     Once that data has been found, if the logged in user is the admin of either the gym or the league then allow them to see the <EditEventDetails component on line 256//TODO make it so that the person who created the event can edit it

//TODO: make it check if there is a league assigned to the event, if there is allow any of the league admins to edit it
//TODO: add a MUI <Switch /> to the event page, when the user clicks the <Switch /> it adds the event id to an array on the 'user' called 'eventSubscriptions'. If they disable the <Switch /> it removes it from the array
//TODO: create a list of all the users who have subscribed for the event
// TODO: allow the gym manager to add a register for this event button which linkns away to the official page
//TODO can we careate a calendar file from the event
import React, { useCallback, useContext, useEffect, useState } from "react";

import AuthContext from '../../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';
import IsSubscribedSwitch from "../user/isSubscribedSwitch";
import SubmitResultsForm from "./results/SubmitResultsForm";
import GymCard from "../gyms/GymCard";
import LeagueCard from "../leagues/LeagueCard";
import {formatDate} from '../data/formatDate';
import EditEventDetails from './EditEventDetails';
import { onSnapshot } from 'firebase/firestore';

import {getFirestore, doc, getDoc, updateDoc, getDocs, query, collection, where} from 'firebase/firestore';
import {auth} from "../../FirebaseSetup";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

//mui
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import styled from "styled-components";

import ResultsDisplay from "./ResultsDisplay";



const EventDelete = styled(Button)`
  margin: 0 0 0 1rem;
  padding: 0;
  min-width: 16px;
`

const EventDetails = ( userType, handleDelete, ) => {
    const { id } = useParams();
    const { events, gyms, leagues, getEventById: originalGetEventById } = useDataLayer();
    //TODO check authcontext implementation
    const { currentUser } = useContext(AuthContext);
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
    const [results, setResults] = useState([]);

    const getEventById = useCallback((id) => {
        return originalGetEventById(id);
    }, [events]);

    // find the matching gym basd on the gym id in the event
    const getGymById = useCallback((gymId) => {
        const gym = gyms.find((g) => g.id === gymId);
        return gym || { error: 'Gym not found' };
    }, [gyms]);



    //find the matching league based on the id in the event
    const getLeagueById = useCallback((leagueId) => {
        const league = leagues.find((l) => l.id === leagueId);
        return league || { error: 'League not found' };
    }, [leagues]);


    useEffect(() => {
        console.log('useEffect for fetching event, gym, and league data is running. Id: ', id);

        const fetchData = async () => {
            const eventData = await getEventById(id);
            setEvent(eventData);

            if (eventData) {
                const gymData = eventData.gymId ? await getGymById(eventData.gymId) : null;
                setGym(gymData);

                const leagueData = eventData.leagueId ? await getLeagueById(eventData.leagueId) : null;
                console.log('Fetched League Data:', leagueData);
                setLeague(leagueData);            }
        };

        fetchData();
    }, [id, getEventById, getGymById, getLeagueById]);




    // useEffect(() => {
    //     const event = getEventById(id);
    //     setEvent(event);
    //     if (event && event.gym && event.league) {
    //         if (event.gymId) {
    //             const gymData = getGymById(event.gymId);
    //             setGym(gymData);
    //         } else {
    //             setGym(null);
    //         }
    //         const leagueData = getLeagueById(event.league.id);
    //         setLeague(leagueData);
    //     }
    // }, [id, getEventById, getGymById, getLeagueById]);



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
        console.log('useEffect for fetching event, gym and league data is running. Id: ', id);

        setEvent(event);
        if (event) {
            if (event.gym && event.gymId) {
                const gymData = getGymById(event.gymId);
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

    const fetchResults = () => {
        const eventResultsRef = collection(getFirestore(), 'events', id, 'results');
        const unsubscribe = onSnapshot(eventResultsRef, (querySnapshot) => {
            const resultsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResults(resultsData);
        });

        // Clean up the listener when the component unmounts
        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchResults();
        return () => unsubscribe();
    }, [id]);



// console.log('gym on eventDetails'.getGymById);

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

    //check if the date has passed
    const isEventDatePassed = event && new Date(event.date) < new Date();



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
                    ) : (
                        <p><i>This event is not associated with any leagues.</i></p>
                    )}

                    {subscribedUsers.length > 0 && (
                        <>
                            <h3>Subscribed Ninjas</h3>
                            <ul>
                                {subscribedUsers.map((user, index) => (
                                    <li key={user.id || index}>
                                        <Link to={`/users/${user.id}`}>{user.ninjaName || user.displayName || user.email}</Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <hr />
                    {event && (currentUser?.uid === event.createdBy || (gym && gym.ownerUid === currentUser?.uid) || (league && league.ownerUid === currentUser?.uid) || userType === 'Admin') &&

                        <>
                            <EditEventDetails
                                open={editEventOpen}
                                handleClose={handleEditEventClose}
                                event={event}
                                gym={gym}
                                leagues={leagues}
                            />

                            <EventDelete
                                onClick={() => handleDelete(event.id)}
                                size="small"
                                color="error"
                                variant="outlined"
                            >
                                <DeleteIcon />
                            </EventDelete>
                        </>
                    }


                    {isEventDatePassed && (<SubmitResultsForm eventId={event.id} eventDate={event.date} isEventDatePassed />)}

                    <ResultsDisplay results={results} />
                </>

            ) : (
                <p>Loading event details...</p>
            )}
        </div>


        </>
    );
};

export default EventDetails;
