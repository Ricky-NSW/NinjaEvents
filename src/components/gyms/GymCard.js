import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';

import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import Skeleton from '@mui/material/Skeleton';
import { keyframes } from '@emotion/react';
import CollectionCard from '../layout/CollectionCard';
import {useDataLayer} from "../data/DataLayer";
import Box from '@mui/material/Box';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EventIcon from '@mui/icons-material/Event';
const GymCard = ({ gym, index }) => {
    const { events, leagues, users } = useDataLayer();
    const theme = useTheme(); // Add this line to instantiate the theme object

    //search through the events collection and find events that have the same gym id as the gym id - hide events from the past
    const now = new Date(); // get current date and time
    const upcomingEvents = events.filter(event =>
        ((event.gym?.id === gym.id) || (event.gymId === gym.id)) && // match gym ID
        new Date(event.date) > now // only include events in the future
    );

    //find all the user who are following this gym
    // const followers = users.filter(user => user.followingGyms.includes(gym.id));
    const followingUsers = users.filter(user => user.subscribedGyms?.includes(gym.slug));


    //TODO: make it so that I only need to send the gym id to thei coponent and it will use the ID to lookup and find that gym
    return (
        <CollectionCard key={gym.id} index={index} link={`/gyms/${gym.slug}`}>
                <Grid
                    container
                    direction="row"
                    spacing={2}
                    xs={12}
                >
                    {gym.avatarUrl ? (
                        <Grid
                            item
                            xs={2}
                            sm={2}
                        //         take up the full height of the container
                                sx={{
                                    height: '100%'
                            }}
                        >
                            <Avatar
                                alt={gym.name}
                                src={gym.avatarUrl}
                                //set make the avatar image fit the width of the container
                                sx={{ width: '100%', height: 'auto' }}
                            />
                        </Grid>
                    ) : null}
                    <Grid
                        item
                        xs={gym.avatarUrl ? 10 : 12}
                        sx={{ flexGrow: 1  }} // allow this item to grow and take up remaining space

                    >
                        <Typography
                            variant="h3"
                            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'none' }, '& *': { textDecoration: 'none' } }}
                        >
                            {gym.name}</Typography>
                        {gym.address && (
                            <>
                                {/*<Typography variant="subtitle1">{gym.address}</Typography>*/}
                                <Typography variant="subtitle2" sx={{mb: 2}}>
                                    {gym.state}, {gym.country}
                                </Typography>
                            </>
                        )}

                        <Grid
                            item
                            direction="row"
                            spacing={2}
                            xs={12}
                        >
                            {upcomingEvents.length>0 ?
                                <Box display="flex" alignItems="center">
                                    <EventIcon sx={{ mr: 1 }} />
                                        <Typography variant="body2">{upcomingEvents.length} Upcoming events:</Typography>
                                </Box>
                                : null}
                        </Grid>


                            {gym.leagues ?
                                <>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        xs={12}
                                        spacing={0}
                                    >
                                        <Typography variant="body2">Associated Leagues: </Typography>
                                        {gym.leagues && gym.leagues.map((leagueId, index) => {
                                            const league = leagues.find(league => league.id === leagueId);

                                            if (!league) {
                                                // If the league was not found, skip this iteration
                                                return null;
                                            }

                                            return (
                                                // <Typography key={index} variant="body2">{league ? league.name : ''}</Typography>
                                                //     insert the leagues small avatar image here
                                                //     if league.smallAvatarUrl ||  league.AvatarUrl
                                                //     else show a skeleton
                                                <div
                                                    // style the div to be a circle
                                                    key={index}
                                                    style={{width: '25px', height: '25px', margin: '0 2px', borderRadius: '50%'}}
                                                >
                                                    {league.smallAvatarUrl ||  league.AvatarUrl ? (
                                                        <img
                                                            alt={league.name}
                                                            src={league.smallAvatarUrl}
                                                            style={{
                                                                width: '25px',
                                                                height: '25px',
                                                                margin: '0',
                                                                borderRadius: '50%',
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: '25px',
                                                                height: '25px',
                                                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300], // Use the theme object to access colors

                                                                borderRadius: '50%',
                                                                textAlign: 'center',
                                                                margin: '0 2px',
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                style={{
                                                                    lineHeight: '25px',
                                                                }}
                                                            >{league.name.charAt(0)}</Typography>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </Grid>
                                </>: null}




                        <Grid
                            item
                            direction="row"
                            spacing={2}
                            xs={12}
                        >
                            {/*add a line that checks if followingUsers.length is greater than 0 then show the number of subscribed users.*/}
                            {followingUsers.length>0 ?
                                <Box display="flex" alignItems="center">
                                    <AccountCircleOutlinedIcon sx={{ mr: 1 }} />
                                    <Typography variant="body2"> {followingUsers.length} Followers</Typography>
                                </Box>
                                : null}
                        </Grid>
                    </Grid>
                </Grid>
        </CollectionCard>
    );
};

export default GymCard;
