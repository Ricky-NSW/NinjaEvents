import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Avatar, IconButton, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import styled from 'styled-components';
import { auth } from '../../FirebaseSetup';

const EventDelete = styled(Button)`
  margin-left: auto;
  margin-right: 0;
  padding: 0;
  min-width: 16px;
`;

const EventCard = ({ event, handleDelete }) => {
    return (
        <Card sx={{ maxWidth: 768, marginBottom: '1rem' }}>
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
            {event.imageUrl ? (
                <CardMedia
                    sx={{ height: 140 }}
                    image={event.imageUrl}
                    title="green iguana"
                    type="image"
                />
            ) : null}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    <Link to={`/events/` + event.id} size="small">
                        {event.title}
                    </Link>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {event.description}
                </Typography>
                <Typography>
                    <span>Gym: {event.gym?.name}</span>
                </Typography>
                <Typography>
                    <span>League: {event.league?.name}</span>
                </Typography>
                <Typography>
                    <span>Price: {event.price}</span>
                </Typography>
                <Typography>
                    <span>Age: {event.age}</span>
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Share</Button>
                <Button component={Link} to={`/events/` + event.id} size="small">
                    Learn More
                </Button>

                {auth.currentUser && auth.currentUser.uid === event.createdBy ? (
                    <EventDelete
                        onClick={() => handleDelete(event.id)}
                        size="small"
                        color="error"
                        variant="outlined"
                    >
                        <DeleteIcon />
                    </EventDelete>
                ) : null}
            </CardActions>
        </Card>
    );
};

export default EventCard;
