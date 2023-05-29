import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDataLayer } from '../data/DataLayer';
import { doc, getDoc } from "firebase/firestore";
import { CardActionArea } from '@mui/material';

import styled from 'styled-components';
import { auth } from '../../FirebaseSetup';

//MUI
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import Delete from "@mui/icons-material/Delete";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

const EventDelete = styled(Button)`
  margin: 0 0 0 1rem;
  padding: 0;
  min-width: 16px;
`

const EventsContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 0;

  > div{
    margin-bottom: 1rem;
  }
`


const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

const EventCard = ({ event, handleDelete, userType, hideGym }) => {
    const { gyms, leagues, isLoading } = useDataLayer();

    // Find the gym with the same id as event.gym.id
    const gym = gyms.find(gym => event.gym?.id === gym.id);

    // Find the league with the same id as event.league.id
    const league = leagues.find(league => event.league?.id === league.id);


    return (
        // If isLoading is true, display Skeleton component
        isLoading ? (
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Card sx={{ maxWidth: 768 }}>
                        <CardHeader
                            avatar={<Skeleton variant="circular" width={40} height={40} />}
                            title={<Skeleton variant="text" />}
                            subheader={<Skeleton variant="text" />}
                        />
                        <Skeleton variant="rectangular" sx={{ height: 140 }} />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                <Skeleton variant="text" />
                            </Typography>
                            <Typography><Skeleton variant="text" /></Typography>
                            <Typography><Skeleton variant="text" /></Typography>
                            <Typography><Skeleton variant="text" /></Typography>
                            <Typography><Skeleton variant="text" /></Typography>
                        </CardContent>
                        <CardActions>
                            <Skeleton variant="text" width="50%" />
                        </CardActions>
                    </Card>
                </Grid>
        ) : (
            // If isLoading is false, display your actual component
            <Grid item xs={12} sm={6} md={4} lg={6} key={event.id}>
                <Card sx={{ maxWidth: 768 }}>
                    {!hideGym && (
                        <>
                            <CardHeader
                                avatar={
                                    gym && gym?.avatarUrl ? (
                                        <Grid item xs={2} sm={6}>
                                            <Avatar
                                                alt={gym?.name}
                                                src={gym?.avatarUrl}
                                                //TODO: Add a primary color border
                                            />
                                        </Grid>
                                    ) : null
                                }
                                title={gym?.address}
                                subheader={formatDate(event.date)}
                            />
                            {event.imageUrl && (
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={event.imageUrl}
                                    title="green iguana"
                                    type="image"
                                />
                            )}
                        </>
                    )}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            <Link to={`/events/${event.id}`} size="small">
                                {event.title}
                            </Link>
                        </Typography>
                        <Typography>
                            {gym ? (
                                <span>
                                    Gym: <Link to={`/gyms/${gym.id}`} size="small">{gym.name}</Link>
                                  </span>
                            ) : (
                                <span>No gym available</span>
                            )}
                        </Typography>
                        {league?.name && (
                            <Typography>
                                League: <Link to={`/leagues/${league?.id}`} size="small">{league.name}</Link>
                            </Typography>
                        )}
                        <Typography>
                            {/*<span>League: {event.league.name}</span>*/}
                        </Typography>
                        <Typography>
                            Price: {event.price}
                        </Typography>
                        <Typography>
                            Age: {event.age}
                            {/*{event.GeoPoint.latitude} {event.GeoPoint.longitude}*/}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button component={Link} to={`/events/${event.id}`} size="small">Learn More</Button>
                        {/*{auth.currentUser && (auth.currentUser.uid === event.createdBy || userType === "Admin") ? (*/}
                        {/*    <EventDelete*/}
                        {/*        onClick={() => handleDelete(event.id)}*/}
                        {/*        size="small"*/}
                        {/*        color="error"*/}
                        {/*        variant="outlined"*/}
                        {/*    >*/}
                        {/*        <DeleteIcon />*/}
                        {/*    </EventDelete>*/}
                        {/*) : null}*/}
                    </CardActions>
                </Card>
            </Grid>
        )
    );
};

export default EventCard;
