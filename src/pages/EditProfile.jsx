// TODO: ADD a control to manage thae avatar image

import React, { useContext, useEffect, useState } from "react";
import UpdateUserForm from "../components/user/UpdateUserForm";
import { useDataLayer } from '../components/data/DataLayer';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import GymCard from '../components/gyms/GymCard';
import LeagueCard from '../components/leagues/LeagueCard';
//MUI
import Avatar from '@mui/material/Avatar';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';


const Item = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    boxShadow: 'none', // Add this line to remove the drop shadow
}));

const UserProfile = () => {

    const { currentUser, gyms, leagues } = useDataLayer();

    if (!currentUser) {
        return (
            <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="center"
            >
                <Grid item xs={8}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width={200} height={40} />
                </Grid>
                <Grid item xs={4}>
                    <Skeleton variant="circular" width={56} height={56} />
                </Grid>
                <Grid item xs={8}>
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width={200} height={40} />
                    <Skeleton variant="text" width={200} height={40} />
                </Grid>
                <Grid item xs={12}>
                    <Skeleton variant="rectangular" height={100} />
                </Grid>
            </Grid>
        );
    }

    console.log('editProfile page:', currentUser)

    return (
        <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center" // Add this line to vertically align the items
            justifyContent="center" // Add this line to horizontally align the items
        >
            <Grid xs={8}>
                <Item>
                    <Typography
                        variant="h1"
                        component="h1"
                        gutterBottom
                        gutterTop
                    >
                        {currentUser.ninjaName}
                    </Typography>
                </Item>
            </Grid>
            <Grid xs={4}>
                <Item>
                    <Avatar
                        alt={currentUser.ninjaName}
                        src={currentUser.avatarUrl}
                        sx={{ width: 56, height: 56 }}
                    />
                </Item>
            </Grid>
            <Grid xs={12}>
                <UpdateUserForm />
            </Grid>
            <Grid xs={12}>
                <Item>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Achievements:</span> {currentUser.achievements}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Country:</span> {currentUser.country}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Ninja Name:</span> {currentUser.ninjaName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Date of Birth:</span> {currentUser.dob}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Email:</span> {currentUser.email}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>First Name:</span> {currentUser.firstName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Last Name:</span> {currentUser.lastName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Phone:</span> {currentUser.phone}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>How long have you been training?</span> {currentUser.trainingDuration}
                    </Typography>
<br />
                    <Divider>Leagues You're Following</Divider>
                <br />
                    {/*List of Leagues that the user has subscribed to*/}
                    {currentUser.subscribedLeagues && (
                        <>
                            {currentUser.subscribedLeagues.map((league) => (
                                <LeagueCard key={league.id} league={league} />
                                ))}
                        </>
                    )}
                    <br />
                    <Divider>Gyms You're Following</Divider>
                    <br />
                    {/*List of Gyms that the user has subscribed to*/}
                    {currentUser.subscribedGyms && (
                        <>
                            {currentUser.subscribedGyms.map((gym) => (
                                <GymCard key={gym.id} gym={gym} />
                            ))}
                        </>
                    )}
                </Item>
            </Grid>
        </Grid>
    );
};

export default UserProfile;
