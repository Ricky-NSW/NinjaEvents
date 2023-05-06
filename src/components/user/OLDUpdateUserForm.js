//TODO revoke some stuff so tht it gets the user information from the userData layer not whatever it was getting it from earlier today

import React, { useState, useEffect } from 'react';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

//import the users logged in status
//see userData
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../FirebaseSetup';
import Avatar from './Avatar';

const OLDUpdateUserForm = ({ currentUser, onSubmit }) => {
    const [firstName, setFirstName] = useState(currentUser.firstName || "");
    const [lastName, setLastName] = useState(currentUser.lastName || "");
    const [userType, setUserType] = useState(currentUser.userType || "");
    const [avatarURL, setAvatarURL] = useState(currentUser.avatarURL);
    const [ninjaName, setNinjaName] = useState(currentUser.ninjaName || "");
    const [dateOfBirth, setDateOfBirth] = useState(currentUser.dateOfBirth || "");
    const [trainingLength, setTrainingLength] = useState(currentUser.trainingLength || "");
    const [favoriteObstacle, setFavoriteObstacle] = useState(currentUser.favoriteObstacle || "");
    const [localGym, setLocalGym] = useState(currentUser.localGym || "");
    const [bestAchievement, setBestAchievement] = useState(currentUser.bestAchievement || "");
    const [registeredLeagues, setRegisteredLeagues] = useState(currentUser.registeredLeagues || []);

    const [trainingDuration, setTrainingDuration] = useState(currentUser.trainingDuration || "");
    const [favouriteObstacle, setFavouriteObstacle] = useState(currentUser.favouriteObstacle || "");

    const [gyms, setGyms] = useState([]);
    const [leagues, setLeagues] = useState([]);

    const storage = getStorage();
    const [avatarFile, setAvatarFile] = useState(null); // Move this line here
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (currentUser) {
            const unsubscribe = onSnapshot(
                doc(db, 'users', currentUser.uid),
                (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        setUserData(docSnapshot.data());
                    } else {
                        console.error('User document not found in Firestore');
                    }
                },
                (error) => {
                    console.error('Error getting user data from Firestore: ', error);
                }
            );

            return () => {
                unsubscribe();
            };
        }
    }, [currentUser]);

    const fetchUserData = async (uid) => {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setUserType(userData.userType || '');

            // Log the current user's userType
            // console.log("Current user's userType:", userData.userType);
        } else {
            console.log('No such document!');
        }
    };


    const handleAvatarChange = (e) => {
        if (currentUser.avatarURL) {
            const oldAvatarRef = ref(storage, currentUser.avatarURL);
            oldAvatarRef
                .delete()
                .then(() => {
                    console.log("Old avatar image deleted successfully");
                })
                .catch((error) => {
                    console.error("Error deleting old avatar image:", error);
                });
        }

        setAvatarFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (avatarFile) {
            const storageRef = ref(storage, `users/uploads/${userData.uid}/${avatarFile.name}`);
            const metadata = { contentType: avatarFile.type };
            const uploadTask = uploadBytesResumable(storageRef, avatarFile, metadata);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Handle progress, success, and errors
                },
                (error) => {
                    console.error("Avatar upload error: ", error);
                },
                async () => {
                    const [filename, extension] = avatarFile.name.split(".");
                    const newAvatarRef = ref(storage, `users/uploads/${userData.uid}/avatars/${filename}_200x200.${extension}`);
                    const newAvatarURL = await getDownloadURL(newAvatarRef);
                    setAvatarURL(newAvatarURL);

                    if (userData.avatarURL) {
                        const oldAvatarRef = ref(storage, userData.avatarURL);
                        oldAvatarRef
                            .delete()
                            .then(() => {
                                console.log("Old avatar image deleted successfully");
                            })
                            .catch((error) => {
                                console.error("Error deleting old avatar image:", error);
                            });
                    }

                    onSubmit({
                        firstName,
                        lastName,
                        userType,
                        avatarURL: newAvatarURL,
                        ninjaName,
                        dateOfBirth,
                        trainingLength,
                        favouriteObstacle,
                        localGym,
                        bestAchievement,
                        registeredLeagues,
                    });
                });
        } else {
            const updatedUser = {
                firstName,
                lastName,
                userType,
                avatarURL,
                ninjaName,
                dateOfBirth,
                trainingLength,
                favouriteObstacle,
                localGym,
                bestAchievement,
                registeredLeagues,
            };

            onSubmit({
                ...updatedUser,
            });
        }
    };








    useEffect(() => {
        const fetchGyms = async () => {
            const gymsRef = db.collection('gyms');
            const snapshot = await gymsRef.get();
            const gymData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGyms(gymData);
        };

        const fetchLeagues = async () => {
            const leaguesRef = db.collection('leagues');
            const snapshot = await leaguesRef.get();
            const leagueData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLeagues(leagueData);
        };

        fetchGyms();
        fetchLeagues();
    }, []);

    // console.log("avatar image is", userData);

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <Box marginBottom={2}>
                <TextField
                    label="First Name"
                    placeholder={setFirstName || "Enter First Name"}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    fullWidth
                />
            </Box>

            <Box marginBottom={2}>
                <TextField
                    label="Last Name"
                    placeholder={setLastName || "Enter Last Name"}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box marginBottom={2}>
                <TextField
                    label="User Type"
                    placeholder={setUserType || "Enter user type"}
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    fullWidth
                />
            </Box>

            <Box marginBottom={2}>
                <TextField
                    label="Ninja Name"
                    placeholder={ninjaName || "Enter Ninja Name"}
                    value={ninjaName}
                    onChange={(e) => setNinjaName(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box marginBottom={2}>
                <TextField
                    label="Date of Birth"
                    type="date"
                    defaultValue={dateOfBirth}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box marginBottom={2}>
                <TextField
                    label="How long have you been training"
                    placeholder={trainingLength || "Enter Training Length"}
                    value={trainingLength}
                    onChange={(e) => setTrainingLength(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box marginBottom={2}>
                <TextField
                    label="Favourite Obstacle"
                    placeholder={favoriteObstacle || "Enter Favorite Obstacle"}
                    value={favoriteObstacle}
                    onChange={(e) => setFavoriteObstacle(e.target.value)}
                    fullWidth
                />
            </Box>
            <Box marginBottom={2}>
                <FormControl fullWidth>
                    <InputLabel id="local-gym-label">Local Gym</InputLabel>
                    <Select
                        labelId="local-gym-label"
                        id="local-gym"
                        value={localGym}
                        onChange={(e) => setLocalGym(e.target.value)}
                    >
                        {gyms.map((gym) => (
                            <MenuItem key={gym.id} value={gym.id}>
                                {gym.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box marginBottom={2}>
                <TextField
                    label="Best Achievement"
                    placeholder={bestAchievement || "Enter Best Achievement"}
                    value={bestAchievement}
                    onChange={(e) => setBestAchievement(e.target.value)}
                    fullWidth
                    multiline
                    maxRows={4}
                />
            </Box>
            <Box marginBottom={2}>
                <FormControl fullWidth>
                    <InputLabel id="registered-leagues-label">Registered Leagues</InputLabel>
                    <Select
                        labelId="registered-leagues-label"
                        id="registered-leagues"
                        multiple
                        value={registeredLeagues}
                        onChange={(e) => setRegisteredLeagues(e.target.value)}
                    >
                        {leagues.map((league) => (
                            <MenuItem key={league.id} value={league.id}>
                                {league.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
                <img src={userData?.avatarURL} alt="Avatar" style={{ width: "200px", height: "200px", borderRadius: "50%" }} />

            </Box>
            <Box marginBottom={2}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                    <Button variant="outlined" component="span">
                        {userData.avatarURL ? 'Update Profile Image' : 'Upload Avatar'}
                    </Button>
                </label>

            </Box>

            <Button type="submit" variant="contained">
                Update User Data
            </Button>
        </Box>
    );
};

export default OLDUpdateUserForm;
