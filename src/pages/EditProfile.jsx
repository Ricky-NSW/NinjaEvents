import React, { useContext, useEffect, useState } from "react";
import UpdateUserForm from "../components/user/UpdateUserForm";
import AuthContext from "../contexts/AuthContext";
import { doc, getDoc, getFirestore } from "firebase/firestore";

//MUI
import Avatar from '@mui/material/Avatar';
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const UserProfile = () => {
    const { currentUser } = useContext(AuthContext);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            const db = getFirestore();
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnapshot = await getDoc(userDocRef);
            setUserDetails(userDocSnapshot.data());
        };

        fetchUserDetails();
    }, [currentUser.uid]);


    console.log('editProfile page:', userDetails)

    return (
        <Grid container spacing={2}>
            <Grid xs={8}>
                <Item> {userDetails.ninjaName}</Item>
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
                        {userDetails.achievements}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.country}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.displayName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.dob}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.email}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.firstName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.lastName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.ninjaName}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.phone}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.trainingDuration}
                    </Typography>
                    <Typography variant="body1" component="p" gutterBottom>
                        {userDetails.userType}
                    </Typography>

                    <UpdateUserForm />
                </Item>
            </Grid>
        </Grid>
    );
};

export default UserProfile;
