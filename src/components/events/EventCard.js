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

const EventCard = ({ event, handleDelete, userType }) => {
    const { gyms, leagues } = useDataLayer();

    // Find the gym with the same id as event.gym.id
    const gym = gyms.find(gym => event.gym?.id === gym.id);

    // Find the league with the same id as event.league.id
    const league = leagues.find(league => event.league?.id === league.id);


    return (
        // <Link to={`/gyms/${gym.id}`} size="small">{gym.name}>
            <CardActionArea component={Link} to={`/events/${event.id}`}>
        <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <Card sx={{ maxWidth: 768 }}>
                <CardHeader
                    avatar={
                        gym && gym?.avatarUrl ? (
                            <Grid item xs={2} sm={6}>
                                <Avatar
                                    alt={gym?.name}
                                    src={gym.avatarUrl}
                                    //TODO: Add a primary color border
                                />
                            </Grid>
                        ) : null
                    }
                    title={event.address}
                    subheader={formatDate(event.date)}/>
                {
                    event.imageUrl ? (
                        <CardMedia
                            sx={{ height: 140 }}
                            image={event.imageUrl}
                            title="green iguana"
                            type="image"
                        />
                    ) : null
                }
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <Link to={`/events/${event.id}`} size="small">{event.title}</Link>
                    </Typography>
                    <Typography>
                        Gym: <Link to={`/gyms/${gym.id}`} size="small">{gym.name}</Link>
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
                    <Button size="small">Share</Button>
                    <Button component={Link} to={`/events/` + (event.id)} size="small">Learn More</Button>

                    {auth.currentUser && auth.currentUser.uid === event.createdBy  || userType === "Admin" ?(
                        <EventDelete
                            onClick={() => handleDelete(event.id)}
                            size="small"
                            color="error"
                            variant="outlined"
                        >
                            <DeleteIcon />
                        </EventDelete>
                    ): null }

                </CardActions>
            </Card>
        </Grid>
            </CardActionArea>
    );
};

export default EventCard;
