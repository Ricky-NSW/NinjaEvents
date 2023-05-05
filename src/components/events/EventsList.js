//TODO: make it so that you need to be logged in to click and see more event details, hide the 'learn more' button - also add something to the event details page so that not logged in users cant see the page
//TODO: sort events by date - most recent first

import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";

//firebase
import { db, auth } from '../../FirebaseSetup';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import useDataLayer from '../data/DataLayer';

//MUI
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Delete from "@mui/icons-material/Delete";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { GlobalStyles } from '@mui/material';

//Search
import Autocomplete from '@mui/lab/Autocomplete';


//style
import styled from 'styled-components';

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

// TODO: make it so that only gym owners can create events

const EventsList = ({events, noFilter} ) => {

    const [search, setSearch] = useState(''); // Add this state
    const [filteredEvents, setFilteredEvents] = useState(events); // Add this state
    const { currentUser } = useDataLayer();
    const userType = currentUser ? currentUser.userType : null;

    useEffect(() => {
        setFilteredEvents(
            events
                .filter((event) =>
                    event.title.toLowerCase().includes(search.toLowerCase())
                )
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // Add this line for sorting
        );
    }, [search, events]);


    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleDelete = async (id) => {
        const docRef = doc(db, 'events', id);
        await deleteDoc(docRef);
    };

    console.log("Events in EventsList:", {events})

    return (
        <>
            {/*//Search*/}
            {noFilter ? null :
            <Autocomplete
                options={Array.from(new Set(events.map((event) => event.title)))}
                getOptionLabel={(option) => option}
                value={search}
                onChange={(event, newValue) => setSearch(newValue)}
                fullWidth
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search events"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                    />
                )}
            />
            }
            <Container maxWidth={false} disableGutters>
                <Box>
                    <Grid container spacing={2} justifyContent="center">
                        {filteredEvents.map((event) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
                                <Card sx={{ maxWidth: 768 }}>
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                {event.createdBy ? event.createdBy.charAt(0) : "X"}
                                            </Avatar>
                                        }
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                        title={event.address}
                                        subheader={event.date}
                                    />
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
                                            <Link component={Link} to={`/events/` + (event.id)} size="small">{event.title}</Link>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {event.description}

                                            {/*{description.length > maxLength*/}
                                            {/*    ? description.substring(0, maxLength) + '...'*/}
                                            {/*    : description;}*/}
                                        </Typography>
                                        <Typography>
                                            <span>Gym: {event.gym.name}</span>
                                        </Typography>
                                        <Typography>
                                            <span>League: {event.league.name}</span>
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

                                        {auth.currentUser && auth.currentUser.uid === event.createdBy  || userType === "admin" ?(
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
                        ))}
                    </Grid>
                </Box>
            </Container>


        <EventsContainer>
            <Stack spacing={2}>

            </Stack>
        </EventsContainer>
            </>
    );
};

export default EventsList;
