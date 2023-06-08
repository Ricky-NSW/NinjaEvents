//TODO: Fix permissions for not logged in users
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDataLayer } from '../data/DataLayer';
import { Typography, Card, CardContent, Avatar } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { List, ListItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import CollectionCard from '../layout/CollectionCard';
const UserProfile = () => {
    const { userId } = useParams();
    const { getUserById, getLeagueById, getGymBySlug, fetchUserResults } = useDataLayer();
    const [user, setUser] = useState(null);
    const [leagues, setLeagues] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [results, setResults] = useState([]); // Added for results

    //fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await getUserById(userId);
                setUser(fetchedUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [userId, getUserById]);



    //fetch leagues data
    useEffect(() => {
        const fetchLeagues = async () => {
            if (user && user.subscribedLeagues) {
                const fetchedLeagues = await Promise.all(user.subscribedLeagues.map(leagueId => getLeagueById(leagueId)));
                setLeagues(fetchedLeagues);
            }
        };
        fetchLeagues();
    }, [user, getLeagueById]);

    //fetch gyms data
    useEffect(() => {
        const fetchGyms = async () => {
            if (user && user.subscribedGyms) {
                const fetchedGyms = await Promise.all(user.subscribedGyms.map(gymSlug => getGymBySlug(gymSlug)));
                console.log('fetchedGyms', fetchedGyms); // <-- Add this line
                setGyms(fetchedGyms);
            }
        };
        fetchGyms();
    }, [user, getGymBySlug]);

    // Fetch results data
    // useEffect(() => {
    //     fetchUserResults(userId).then(fetchedResults => {
    //         setResults(fetchedResults);
    //     });
    // }, [userId, fetchUserResults]);

// Fetch results data
//     useEffect(() => {
//         if (typeof fetchUserResults === 'function') {
//             fetchUserResults(userId).then(fetchedResults => {
//                 setResults(fetchedResults);
//             });
//         }
//     }, [userId, fetchUserResults]);

// Fetch results data
    useEffect(() => {
        if (typeof fetchUserResults === 'function') {
            fetchUserResults(userId).then(fetchedResults => {
                setResults(fetchedResults);
            });
        }
    }, [userId, fetchUserResults]);




    useEffect(() => {
        if(user){
            console.log('gyms on user page', user.subscribedGyms);
            console.log('leagues on user page', user.subscribedLeagues);
            // console.log('use results on user page', results);
        }
    }, [user]);

    if (!user) {
        return (
            <>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={16} />
                <Skeleton variant="rectangular" width={210} height={16} />
                <Skeleton variant="rectangular" width={210} height={16} />
                <Skeleton variant="rectangular" width={210} height={16} />
            </>
        );
    }

    return (
        <Grid
            container
            direction="column"
            justifyContent="left"
            alignItems="left"
            spacing={2}


        >
            <Grid
                item
                xs={12}

            >
                <Avatar src={user.avatarUrl} alt={user.ninjaName} />
                <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
                <Typography variant="body1">Ninja Name: {user.ninjaName}</Typography>
                <Typography variant="body1">Country: {user.country}</Typography>
                <Typography variant="body1">Favorite Obstacle: {user.favouriteObstacle}</Typography>
                <Typography variant="body1">Achievements: {user.achievements}</Typography>
                <Typography variant="body1">Training Duration: {user.trainingDuration}</Typography>

                <br />
                <br />

                {results && results.length > 0 && <Divider>Results</Divider>}
                <List>
                    {results && results.map(result => (
                        // <CollectionCard link={`/#/events/${result.eventId}`}>
                        <CollectionCard link={`/events/${result.eventId}`}>
                            <ListItem
                                key={result.id}
                            >
                                <Typography variant="body1"><strong>Result Place: {result.resultPlace}</strong></Typography>
                                {/*<Typography variant="body1">Event ID: {result.eventId}</Typography>*/}
                                <Typography variant="body1">Date: {new Date(result.timestamp.seconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                            </ListItem>
                        </CollectionCard>
                    ))}
                </List>

                {leagues && leagues.length > 0 && <Divider>Liked Leagues</Divider>}
                <List>
                    {leagues && leagues.map(league => (
                        <ListItem key={league.id}>{league.name}</ListItem>
                    ))}
                </List>

                {gyms && gyms.length > 0 && <Divider>Liked Gyms</Divider>}
                <List>
                    {gyms && gyms.map(gym => (
                        <Link to={`/gyms/${gym.slug}`} key={gym.id}>{gym.name}</Link>
                        // <ListItem key={gym.id}>{gym.name}</ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
};

export default UserProfile
