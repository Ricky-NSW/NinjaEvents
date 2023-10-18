import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDataLayer } from '../data/DataLayer';
import { doc, getDoc } from "firebase/firestore";
import { CardActionArea } from '@mui/material';
import CollectionCard from '../layout/CollectionCard';
import styled from 'styled-components';
import { auth } from '../../FirebaseSetup';
import {colors} from '../theming/colors';
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
    const { gyms, leagues, isAnyDataLoading } = useDataLayer();

// Find the gym with the same id as event.gym.id or event.gymId
    const gym = gyms.find(gym => (event.gym ? event.gym.id : event.gymId) === gym.id);

    // Find the league with the same id as event.league.id
    const league = leagues.find(league => event.leagueId === league.id);


    return (
        // If isAnyDataLoading is true, display Skeleton component
        isAnyDataLoading ? (
                <Grid item xs={12} sm={12} md={12} lg={6}>
                    <Card style={{ maxWidth: 768 }}>
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
            // If isAnyDataLoading is false, display your actual component
            <CollectionCard key={event.id}>
                <CardContent
                    sx={{ p: 0 }}
                >
                    <Typography
                        gutterBottom
                        variant="h2"
                        component="h2"
                        //make it bold
                        sx={{ fontWeight: 600, fontSize: '1.5rem' }}
                    >
                        <Link to={`/events/${event.id}`} size="small">
                            {event.title}
                        </Link>
                    </Typography>
                    <Typography variant={"body2"} color={"secondary.main"}>
                        {formatDate(event.date)}
                    </Typography>
                    {/*<Typography>*/}
                    {/*    {gym ? (*/}
                    {/*        <span>*/}
                    {/*            Gym: <Link to={`/gyms/${gym.slug}`} size="small">{gym.name}</Link>*/}
                    {/*          </span>*/}
                    {/*    ) : (*/}
                    {/*        <span>No gym available</span>*/}
                    {/*    )}*/}
                    {/*</Typography>*/}
                    <Typography>
                        {/*<span>League: {event.league.name}</span>*/}
                    </Typography>
                    <Typography>
                        Age: {event.age}
                        {/*{event.GeoPoint.latitude} {event.GeoPoint.longitude}*/}
                    </Typography>
                    {/*{league?.name && (*/}
                    {/*    <Typography>*/}
                    {/*        League: <Link to={`/leagues/${league?.slug}`} size="small">{league.name}</Link>*/}
                    {/*    </Typography>*/}
                    {/*)}*/}
                    {league?.name && (
                        <>
                            {/*<Typography variant={"h6"}>League:</Typography>*/}
                            <Grid item xs={12} sx={{ padding: '10px 0 0 0' }}>
                                {league && league?.avatarUrl ? (
                                    <Grid container alignItems="center" wrap="nowrap">
                                        <Grid item sx={{ padding: '10px' }}> {/* Padding added here */}
                                            <Avatar
                                                alt={league?.name}
                                                src={league?.avatarUrl}
                                                //TODO: Add a primary color border
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body2">{league?.name}</Typography>
                                        </Grid>
                                    </Grid>
                                ) : null}
                            </Grid>
                        </>
                    )}
                    {!hideGym && (
                        <>
                            <Grid item xs={12} sx={{ padding: '10px 0 0 0' }}>
                                {gym && gym?.avatarUrl ? (
                                    <>
                                        {/*<Typography variant={"h6"}>Location:</Typography>*/}
                                        <Grid container alignItems="center" wrap="nowrap">
                                            <Grid item sx={{ padding: '10px' }}> {/* Padding added here */}
                                                <Avatar
                                                    alt={gym?.name}
                                                    src={gym?.avatarUrl}
                                                    //TODO: Add a primary color border
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Typography
                                                    variant="body3"
                                                    color="grey.almostBlack"
                                                >{gym?.name}</Typography>
                                            </Grid>
                                        </Grid>
                                    </>
                                ) : null}
                            </Grid>
                        </>
                    )}

                </CardContent>
                {/*<CardActions>*/}
                {/*    <Button*/}
                {/*        component={Link}*/}
                {/*        to={`/events/${event.id}`}*/}
                {/*        size="small"*/}
                {/*        //   make the button solid with a background*/}
                {/*        variant="contained"*/}
                {/*        color="primary"*/}
                {/*        sx={{ mt: 3, mb: 0 }}*/}
                {/*    >*/}
                {/*        Learn More*/}
                {/*    </Button>*/}
                {/*</CardActions>*/}
            </CollectionCard>
        )
    );
};

export default EventCard;
