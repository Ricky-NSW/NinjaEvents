import React, { useContext, useEffect, useState } from "react";
import AuthContext from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import IsSubscribedSwitch from "../user/isSubscribedSwitch";

import { useDataLayer, DataLayerContext } from '../data/DataLayer';
import EditLeagueDialog from "./editLeagueDetails";
import {Stack} from "@mui/material";
import EventCard from '../events/EventCard';
import EventTabs from '../events/EventTabs';
const LeagueDetails = () => {
    //change this to use the league.slug instead of the league.id
    const { slug } = useParams();
    const [league, setLeague] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [events, setEvents] = useState([]);
    const [mapDialogOpen, setMapDialogOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const { updateLeague } = useContext(DataLayerContext);

    const {
        gyms,
        getLeagueBySlug,
        fetchLeagues,
        updateUserData,
        fetchEventsForLeague,
        checkUserSubscriptionToLeague,
        updateUserSubscriptionToLeague
    } = useDataLayer();

    useEffect(() => {
        const fetchLeagueAndEvents = async () => {
            const fetchedLeague = await getLeagueBySlug(slug);
            if (fetchedLeague) {
                setLeague(fetchedLeague);

                const eventsData = await fetchEventsForLeague(fetchedLeague.id);
                setEvents(eventsData);
            }
        };

        fetchLeagueAndEvents();
    }, [slug, getLeagueBySlug, fetchEventsForLeague]);


    // Check if the user is subscribed to this league
    useEffect(() => {
        const checkSubscription = async () => {
            const isSubscribed = await checkUserSubscriptionToLeague(slug);
            setIsSubscribed(isSubscribed);
        };
        checkSubscription();
    }, [slug, checkUserSubscriptionToLeague]);


    // Handle subscribed/unsubscribed league toggle
    const handleSubscribeToggle = async () => {
        setIsSubscribed(!isSubscribed);
        await updateUserSubscriptionToLeague(slug, !isSubscribed, currentUser);
    };

    // const handleSubscribeToggle = async () => {
    //     setIsSubscribed(!isSubscribed);
    //     await updateUserSubscriptionToLeague(slug, currentUser);
    // };

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


console.log('gyms', gyms)
    // console.log('league details user', currentUser)
    if (league) {
        console.log('league details', league.id);
    }    // const associatedGyms = gyms.filter(gym => gym.leagues.includes(league.id));

    return (
        <div>
            {league ? (
                <>
                    <h2>{league.name}</h2>
                    {league.avatarUrl ? (
                        <Stack
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                            xs={2}
                            sm={3}
                        >
                            <Stack>
                                <img
                                    alt={league.name}
                                    src={league.avatarUrl}
                                    // make the avatar fill the width and height
                                    style={{ width: '100%', height: 'auto', padding: '10px' }}
                                />
                            </Stack>
                        </Stack>
                    ) : null}
                    <div>
                        <IsSubscribedSwitch
                            isSubscribed={isSubscribed}
                            handleSubscription={handleSubscribeToggle}
                        />
                        <span>Follow this league</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: league.description }} />

                    <EventTabs
                        collection={league}
                        collectionType='league'
                    />

                    {/*<h2>Gyms:</h2>*/}
                    {/*{associatedGyms.map((gym) => (*/}
                    {/*    <div key={gym.slug}>*/}
                    {/*        <h3>{gym.name}</h3>*/}
                    {/*        /!* display other gym details *!/*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </>
            ) : (
                <p>Loading league details...</p>
            )}

            {(currentUser && league && league.ownerUid && league.ownerUid.includes(currentUser.uid)) || (currentUser && currentUser.type === 'Admin') ? (
                    <>
                        <button onClick={handleEditDialogOpen}>Edit</button>
                        <EditLeagueDialog
                            isOpen={editDialogOpen}
                            onClose={handleEditDialogClose}
                            leagueId={league.id}
                            updateLeague={updateLeagueDetails}
                        />
                    </>)
                : null}

            {/*//TODO: wrap this in a ternary so that it only shows if there are events*/}


        </div>
    );
};

export default LeagueDetails;
