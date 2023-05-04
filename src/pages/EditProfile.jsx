// TODO: ADD a control to manage thae avatar image

import React, { useContext, useEffect, useState } from "react";
import UpdateUserForm from "../components/user/UpdateUserForm";
import AuthContext from "../contexts/AuthContext";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import GymCard from '../components/gyms/GymCard';
import LeagueCard from '../components/leagues/LeagueCard';
import { Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
//MUI
import Avatar from '@mui/material/Avatar';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';


const Item = styled(Paper)(({ theme }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
    boxShadow: 'none', // Add this line to remove the drop shadow
}));

const UserProfile = () => {
    const { currentUser } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState({});
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };
    useEffect(() => {
        const fetchUserDetails = async () => {
            const db = getFirestore();
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            setUserDetails(userDocSnapshot.data());
        };

        fetchUserDetails();
    }, [currentUser.uid]);


    // console.log('editProfile page:', userDetails)

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
                        {userDetails.ninjaName}
                    </Typography>
                </Item>
            </Grid>
            <Grid xs={4}>
                <Item>
                    <Avatar
                        alt={userDetails.ninjaName}
                        src={userDetails.avatarUrl}
                        sx={{ width: 56, height: 56 }}
                    />
                </Item>
            </Grid>
            <Grid xs={12}>
                <Item>
                    <Typography variant="h4" component="h1" gutterBottom>

                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Achievements:</span> {userDetails.achievements}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Country:</span> {userDetails.country}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Ninja Name:</span> {userDetails.displayName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Date of Birth:</span> {userDetails.dob}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Email:</span> {userDetails.email}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>First Name:</span> {userDetails.firstName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Last Name:</span> {userDetails.lastName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>Phone:</span> {userDetails.phone}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        <span style={{ fontWeight: 'bold' }}>How long have you been training?</span> {userDetails.trainingDuration}
                    </Typography>
<br />
                    <Divider>Leagues You're Following</Divider>
                <br />
                    {/*List of Leagues that the user has subscribed to*/}
                    {userDetails.subscribedLeagues && (
                        <>
                            {userDetails.subscribedLeagues.map((league) => (
                                <LeagueCard key={league.id} league={league} />
                                ))}
                        </>
                    )}
                    <br />
                    <Divider>Gyms You're Following</Divider>
                    <br />
                    {/*List of Gyms that the user has subscribed to*/}
                    {userDetails.subscribedGyms && (
                        <>
                            {userDetails.subscribedGyms.map((gym) => (
                                <GymCard key={gym.id} gym={gym} />
                            ))}
                        </>
                    )}

                    <UpdateUserForm />
                </Item>
            </Grid>
        </Grid>
    );
};

export default UserProfile;
