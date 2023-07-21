// TODO: ADD a control to manage thae avatar image

import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { useDataLayer } from '../components/data/DataLayer';

import UpdateUserForm from "../components/user/UpdateUserForm";
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

const UserprofilePage = () => {

    const { currentUser } = useContext(AuthContext);
    const { getGymById, getLeagueById, leagues, gyms } = useDataLayer();

    const Item = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    boxShadow: 'none', // Add this line to remove the drop shadow
}));




console.log('manage user page', currentUser)
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

                    <Typography
                        variant="h1"
                        component="h1"
                        gutterBottom
                    >
                        {currentUser.ninjaName}
                    </Typography>

            </Grid>
            <Grid item xs={4}>

                    <Avatar
                        alt={currentUser.ninjaName}
                        src={currentUser.avatarUrl}
                        sx={{ width: 56, height: 56 }}
                    />

            </Grid>
            <Grid item xs={12}>
                {/*<UpdateUserForm />*/}
            </Grid>
            <Grid item xs={12}>
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
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>What is your favourite obstacle</span> {currentUser.favouriteObstacle}
                    </Typography>
<br />
                    <Divider>Leagues You're Following</Divider>
                <br />
                    {/*List of Leagues that the user has subscribed to*/}
                    {leagues && currentUser.subscribedLeagues && (
                        <>
                            {currentUser.subscribedLeagues.map((leagueId) => {
                                const league = getLeagueById(leagueId);
                                return league ? <LeagueCard key={league.id} league={league} /> : null;
                            })}
                        </>
                    )}
                    <br />
                    <Divider>Gyms You're Following</Divider>
                    <br />
                    {/*List of Gyms that the user has subscribed to*/}
                    {gyms && currentUser.subscribedGyms && (
                        <>
                            {currentUser.subscribedGyms.map((gymId) => {
                                const gym = getGymById(gymId);
                                return gym ? <GymCard key={gym.id} gym={gym} /> : null;
                            })}
                        </>
                    )}

                    <br />
                    {/*display all gyms that have this users id as that gyms ownerUid*/}
                    {leagues && leagues.filter((league) => league.OwnerUid && league.OwnerUid.includes(currentUser.uid)).length > 0 && (
                        <>
                            <Divider>Leagues You're Managing</Divider>
                            <br />
                            {leagues.filter((league) => league.OwnerUid && league.OwnerUid.includes(currentUser.uid)).map((league) => (
                                <LeagueCard key={league.id} league={league} />
                            ))}
                        </>
                    )}
                    {console.log('leagues', leagues)}

                    <br />
                    {gyms && gyms.filter((gym) => gym.ownerUid && gym.ownerUid.includes(currentUser.uid)).length > 0 && (
                        <>
                            <Divider>Gyms You're managing</Divider>
                            <br />
                            {gyms.filter((gym) => gym.ownerUid && gym.ownerUid.includes(currentUser.uid)).map((gym) => (
                                <GymCard key={gym.id} gym={gym} />
                            ))}
                        </>
                    )}

                    <Typography
                        variant="body2"
                        component="p"
                        gutterBottom
                        sx={{ fontStyle: 'italic', color: 'text.disabled' }}

                    >
                        {currentUser.id}
                    </Typography>

                    {/*{currentUser.subscribedGyms && (*/}
                    {/*    <>*/}
                    {/*        {currentUser.subscribedGyms.map((gym) => (*/}
                    {/*            <GymCard key={gym.id} league={gym} />*/}
                    {/*        ))}*/}
                    {/*    </>*/}
                    {/*)}*/}
                </Item>
            </Grid>
        </Grid>
    );
};

export default UserprofilePage;
