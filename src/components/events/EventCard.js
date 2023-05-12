import React from 'react';
import { Link } from 'react-router-dom';

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

const EventCard = ({ event, handleDelete, getGymById, userType }) => {
    console.log('avatar for event list', getGymById(event.gym)?.avatarUrl)

    return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
            <Card sx={{ maxWidth: 768 }}>
                <CardHeader
                    avatar={
                        getGymById(event.gym)?.avatarUrl ? (
                            <Grid item xs={2} sm={6}>
                                <Avatar
                                    alt={getGymById(event.gym)?.name}
                                    src={getGymById(event.gym)?.avatarUrl}
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
                    ) : (
                        null
                    )
                }
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        <Link to={`/events/${event.id}`} size="small">{event.title}</Link>
                    </Typography>
                    <Typography>
                        <span>Gym: {getGymById(event.gym)?.name || 'No gym found'}</span>
                    </Typography>
                    <Typography>
                        {/*<span>League: {event.league.name}</span>*/}
                    </Typography>
                    <Typography>
                        <span>Price: {event.price}</span>
                    </Typography>
                    <Typography>
                        <span>Age: {event.age}</span>
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
    );
};

export default EventCard;