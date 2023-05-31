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

const GymCard = ({ gym, index }) => {


    return (
        <CollectionCard key={gym.id} index={index}>
            <Link to={`/gyms/${gym.slug}`}>
                <Grid item xs={10} sm={10}>
                    <Typography variant="h3">{gym.name}</Typography>
                    {gym.address && (
                        <>
                            <Typography variant="subtitle1">{gym.address}</Typography>
                            <Typography variant="subtitle2">
                                {gym.state}, {gym.country}
                            </Typography>
                        </>
                    )}
                    {/*<Typography variant="body1">Latitude: {gym.latitude}</Typography>*/}
                    {/*<Typography variant="body1">Longitude: {gym.longitude}</Typography>*/}
                </Grid>
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
            </Link>
        </CollectionCard>
    );
};

export default GymCard;
