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

const UserCard = ({ user, index }) => {

    //search through the events collection and find events that have the same user id as the user id

    return (
        <CollectionCard key={user.id} index={index}>
            <Link to={`/users/${user.id}`}>

                <Grid
                    container
                    direction="row"
                    spacing={2}
                    xs={12}
                >
                    {user.ninjaName ? (
                        <Typography variant="h3">{user.ninjaName}</Typography>
                    ) : (
                        <Typography variant="h3"><span>{user.firstName} {user.LastName}</span></Typography>
                    )}

                    {/*{user.avatarUrl ? (*/}
                    {/*    <Grid item xs={2} sm={2}>*/}
                    {/*        <Avatar*/}
                    {/*            alt={user.name}*/}
                    {/*            src={user.avatarUrl}*/}
                    {/*            //set make the avatar image fit the width of the container*/}
                    {/*            sx={{ width: '100%', height: 'auto' }}*/}
                    {/*        />*/}
                    {/*    </Grid>*/}
                    {/*) : null}*/}
                </Grid>
            </Link>
        </CollectionCard>
    );
};

export default UserCard;
