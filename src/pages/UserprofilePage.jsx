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

const UserprofilePage = () => {
    const {
        currentUser,
        gyms,
        leagues,
        getGymById,
        getLeagueById,
        // getEventById,
    } = useDataLayer();

    const {
        ninjaName,
        avatarUrl,
        achievements,
        country,
        dob,
        email,
        firstName,
        lastName,
        phone,
        trainingDuration,
        subscribedLeagues,
        subscribedGyms,
    } = currentUser || {};



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

    // console.log('editProfile page:', currentUser)
// console.log('user page gyms',currentUser.subscribedGyms)
    return (
        <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center" // Add this line to vertically align the items
            justifyContent="center" // Add this line to horizontally align the items
        >
            <Grid item xs={8}>
                <Item>
                    <Typography
                        variant="h1"
                        component="h1"
                        gutterBottom
                    >
                        {ninjaName}
                    </Typography>
                </Item>
            </Grid>
            <Grid item xs={4}>
                <Item>
                    <Avatar
                        alt={ninjaName}
                        src={avatarUrl}
                        sx={{ width: 56, height: 56 }}
                    />
                </Item>
            </Grid>
            <Grid item xs={12}>
                <UpdateUserForm />
            </Grid>
            <Grid item xs={12}>
                <Item>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Achievements:</span> {achievements}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Country:</span> {country}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Ninja Name:</span> {ninjaName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Date of Birth:</span> {dob}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Email:</span> {email}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>First Name:</span> {firstName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Last Name:</span> {lastName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Phone:</span> {phone}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>How long have you been training?</span> {trainingDuration}
                    </Typography>
<br />
                    <Divider>Leagues You're Following</Divider>
                <br />
                    {/*List of Leagues that the user has subscribed to*/}
                    {/*{leagues && currentUser.subscribedLeagues && (*/}
                    {/*    <>*/}
                    {/*        {currentUser.subscribedLeagues.map((leagueId) => {*/}
                    {/*            const league = getLeagueById(leagueId);*/}
                    {/*            return league ? <LeagueCard key={league.id} league={league} /> : null;*/}
                    {/*        })}*/}
                    {/*    </>*/}
                    {/*)}*/}

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
                    {/*{gyms && currentUser.subscribedGyms && (*/}
                    {/*    <>*/}
                    {/*        {currentUser.subscribedGyms.map((gymId) => {*/}
                    {/*            const gym = getGymById(gymId);*/}
                    {/*            return gym ? <GymCard key={gym.id} gym={gym} /> : null;*/}
                    {/*        })}*/}
                    {/*    </>*/}
                    {/*)}*/}

                    {currentUser.subscribedGyms && (
                        <>
                            {currentUser.subscribedGyms.map((gym) => (
                                <LeagueCard key={gym.id} league={gym} />
                            ))}
                        </>
                    )}
                </Item>
            </Grid>
        </Grid>
    );
};

export default UserprofilePage;
