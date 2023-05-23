// TODO: show current standings for leagues user is following
import { useState, useEffect, useContext } from 'react';
import EventCard from '../components/events/EventCard';
import { List } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import { useDataLayer } from '../components/data/DataLayer';
import SearchBar from '../components/layout/tools/SearchBar';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

                // Convert the name field value to lowercase and check if it contains the search text
                if (docData.name && docData.name.toLowerCase().includes(lowerCaseSearchText)) {
                    allResults.push({ collection: collectionName, id: doc.id, data: docData });
                }
            });
        }

        setSearchResults(allResults);
    };


    return (
        <div>
            <p>&nbsp;</p>
            {/*//TODO: move all the search logic into the search component*/}
            <SearchBar onSearch={handleSearch} />
            <h1>Ninja Community aaa</h1>
            <h4>or something like that</h4>
            {searchResults.length > 0 && (
                <div>
                    <h2>Search results:</h2>
                    <ul>
                        {searchResults.map((result, index) => (
                            <li key={index}>
                                {result.collection}: {result.data.name} (ID: {result.id})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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
