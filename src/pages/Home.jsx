// TODO: show current standings for leagues user is following
import React, { useState, useEffect, useContext } from 'react';
import { List } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { useDataLayer } from '../components/data/DataLayer';
import SearchBar from '../components/layout/tools/SearchBar';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import CollectionLinks from '../components/layout/CollectionLinks';

// cards
import GymCard from '../components/gyms/GymCard';
import UserCard from '../components/user/UserCard';
import LeagueCard from '../components/leagues/LeagueCard';
import EventCard from '../components/events/EventCard';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import CollectionCard from '../components/layout/CollectionCard';
const Home = () => {
    // State to hold the IDs of the gyms the user has subscribed
    const [subscribedGymsIDs, setSubscribedGymsIDs] = useState([]);
    // State to hold the IDs of the leagues the user has subscribed
    const [subscribedLeaguesIDs, setSubscribedLeaguesIDs] = useState([]);
    // State to hold the filtered list of events based on user preferences
    const [filteredEvents, setFilteredEvents] = useState([]);

    // Get current user and user data from the Auth and Data contexts
    const { currentUser } = useContext(AuthContext);
    const { events, user } = useDataLayer();
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // Find the user data for the current user
        if (currentUser && user) {
            const userData = user.find((u) => u.id === currentUser.uid);

            // If user data is found, store subscribed gyms and leagues IDs
            if (userData) {
                if (userData.subscribedGyms) {
                    setSubscribedGymsIDs(userData.subscribedGyms.map((gym) => gym.id));
                }
                if (userData.subscribedLeagues) {
                    setSubscribedLeaguesIDs(userData.subscribedLeagues.map((league) => league.id));
                }
            }
        }
    }, [currentUser, user]);

    useEffect(() => {
        // Filter the events based on the user's subscribed gyms and leagues
        if (events) {
            const filteredEventsArray = events.filter((event) => {
                if (
                    (subscribedGymsIDs.length > 0 && event.gym && event.gym.id && subscribedGymsIDs.includes(event.gym.id)) ||
                    (subscribedLeaguesIDs.length > 0 && event.league && event.league.id && subscribedLeaguesIDs.includes(event.league.id))
                ) {
                    return true;
                }
                return false;
            });
            // Update the state with the filtered events
            setFilteredEvents(filteredEventsArray);
        }
    }, [events, subscribedGymsIDs, subscribedLeaguesIDs]);


    const handleSearch = async (searchText) => {
        console.log('Search text:', searchText);
        const db = getFirestore();
        const collections = ['users', 'leagues', 'gyms', 'events'];
        let allResults = [];

        // Convert the search text to lowercase
        const lowerCaseSearchText = searchText.toLowerCase();

        for (const collectionName of collections) {
            const collRef = collection(db, collectionName);
            const docsSnapshot = await getDocs(collRef);

            docsSnapshot.forEach((doc) => {
                const docData = doc.data();

                if (collectionName === 'users') {
                    // In 'users' collection, search in firstName, lastName, and ninjaName fields
                    if (
                        (docData.firstName && docData.firstName.toLowerCase().includes(lowerCaseSearchText)) ||
                        (docData.lastName && docData.lastName.toLowerCase().includes(lowerCaseSearchText)) ||
                        (docData.ninjaName && docData.ninjaName.toLowerCase().includes(lowerCaseSearchText))
                    ) {
                        allResults.push({ collection: collectionName, id: doc.id, data: docData, slug: docData.slug });
                    }
                } else if (collectionName === 'events') {
                    // In 'events' collection, search in the 'title' field
                    if (docData.title && docData.title.toLowerCase().includes(lowerCaseSearchText)) {
                        allResults.push({ collection: collectionName, id: doc.id, data: docData, slug: docData.slug });
                    }
                } else {
                    // In other collections, continue to search in the 'name' field
                    if (docData.name && docData.name.toLowerCase().includes(lowerCaseSearchText)) {
                        allResults.push({ collection: collectionName, id: doc.id, data: docData, slug: docData.slug });
                    }
                }
            });
        }

        setSearchResults(allResults);
    };

    console.log('Search results:', searchResults);

    return (
        <div>
            <p>&nbsp;</p>
            {/*//TODO: move all the search logic into the search component*/}
            <h1>Ninja Community</h1>
            <Typography>
                Welcome to NinjaConnect, the ultimate online hub for ninja athletes! Discover thrilling events, connect with fellow ninjas, and track dynamic leagues all in one place. Explore nearby gyms equipped for ninja training with our intuitive location-based service. Stay updated with the latest in the ninja athletics world and never miss an event. Join NinjaConnect and step into a vast network of ninja athletes and enthusiasts. Enhance your skills, build lasting friendships, and immerse yourself in the exciting world of ninja athletics. Your journey to becoming the ultimate ninja athlete begins here. Join us now at NinjaConnect!
            </Typography>
            <h4>Use the search bar to find a Gym, League, User or an event.</h4>
            <SearchBar onSearch={handleSearch} />
            {searchResults.length > 0 && (
                <div>
                    <h2>Search results:</h2>
                    {
                        ['users', 'leagues', 'gyms', 'events'].map(collectionName => {
                            const collectionResults = searchResults.filter(result => result.collection === collectionName);

                            if(collectionResults.length > 0) {
                                return (
                                    <Grid
                                        container
                                        spacing={2}
                                        direction="column"
                                        key={collectionName}>

                                        <Divider
                                            sx={{ my: 2 }}
                                        >{collectionName.toUpperCase()}</Divider>

                                        {collectionResults.map((result, index) => {
                                            let content;

                                            if (result.collection === 'users') {
                                                content = (
                                                    <UserCard key={result.data.id} user={result.data} />
                                                );
                                            } else if (result.collection === 'gyms') {
                                                content = (
                                                    <GymCard key={`${result.data.slug}-${index}`} gym={result.data} index={index}/>
                                                );
                                            } else if (result.collection === 'leagues') {
                                                content = (
                                                    <LeagueCard league={result.data} index={index} />
                                                );
                                            } else if (result.collection === 'events') {
                                                content = (
                                                    <EventCard key={result.data.id} event={result.data} />
                                                );
                                            }


                                            return content;
                                        })}


                                    </Grid>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            )}

            <CollectionLinks />



            <h2>Upcoming Events at Gyms and Leagues you follow</h2>
            {filteredEvents.length > 0 ? (
                // If there are filtered events, display them in a list
                <List>
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </List>
            ) : (
                <p>No upcoming events to show.</p>
                //TODO: add a check if the user is following any gyms or leagues, if not, show a message to follow some


            )}
        </div>
    );
};

export default Home;
