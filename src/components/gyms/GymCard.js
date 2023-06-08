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

const GymCard = ({ gym, index }) => {
    const { events, leagues } = useDataLayer();

    //search through the events collection and find events that have the same gym id as the gym id
    const upcomingEvents = events.filter(event => (event.gym?.id === gym.id) || (event.gymId === gym.id));

    //TODO: make it so that I only need to send the gym id to thei coponent and it will use the ID to lookup and find that gym
    return (
        <CollectionCard key={gym.id} index={index}>
            <Link to={`/gyms/${gym.slug}`}>

                <Grid
                    container
                    direction="row"
                    spacing={2}
                    xs={12}
                >
                    {gym.avatarUrl ? (
                        <Grid item xs={2} sm={2}>
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
                       >
                        <Typography variant="h3">{gym.name}</Typography>
                        {gym.address && (
                            <>
                                {/*<Typography variant="subtitle1">{gym.address}</Typography>*/}
                                <Typography variant="subtitle2">
                                    {gym.state}, {gym.country}
                                </Typography>
                            </>
                        )}
                        {upcomingEvents.length>0 ? <Typography variant="body2">Upcoming events: {upcomingEvents.length}</Typography> : null}
                        {/*{upcomingEvents.map((event, index) => {*/}
                        {/*    const league = leagues.find(league => league.id === event.league.id);*/}
                        {/*    return (*/}
                        {/*        <Typography key={index} variant="body2">{league ? league.title : ''}</Typography>*/}
                        {/*    )*/}
                        {/*})}*/}

                    {/*    document ID*/}
                        {gym.leagues && gym.leagues.map((leagueId, index) => {
                            const league = leagues.find(league => league.id === leagueId);
                            return (
                                <Typography key={index} variant="body2">{league ? league.name : ''}</Typography>
                            )
                        })}



                    </Grid>

                </Grid>
                <Grid
                    container
                    direction="row"
                    spacing={2}
                    xs={12}
                >
                    {/*// show how many events are at this gym here*/}

                </Grid>
            </Link>
        </CollectionCard>
    );
};

export default GymCard;
