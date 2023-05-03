import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Firebase
import { signOut } from 'firebase/auth';
import {onSnapshot, doc, getFirestore, getDoc} from 'firebase/firestore';
import { auth } from '../../FirebaseSetup';
import authContext from "../../contexts/AuthContext";

//avatar
import Avatar from '../user/Avatar';


//MUI
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import MenuItemIcon from '@mui/material/ListItemIcon';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Typography from '@mui/material/Typography';
import DarkModeToggle from './DarkModeToggle';
import Stack from '@mui/material/Stack';

//MUI icons
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import InfoIcon from '@mui/icons-material/Info';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
// MUI Theming
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import ThemeContext from '../../contexts/ThemeContext';
export default function NavDrawer() {

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [userData, setUserData] = useState(null);
    const { currentUser } = useContext(authContext);
    const [userDetails, setUserDetails] = useState({});

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [anchor]: open});
    };
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };


    useEffect(() => {
        if (currentUser) {
            const fetchUserDetails = async () => {
                const db = getFirestore();
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                setUserDetails(userDocSnapshot.data());
            };

            fetchUserDetails();
        } else {
            setUserDetails(null);
        }
    }, [currentUser]);

    // console.log("user from navDrawer", userDetails.avatarUrl)
    const list = (anchor) => (
<>
        <Box
            sx={{width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250}}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', padding: '2rem 1rem 1rem 1rem' }}>
                {userDetails && (
                    <>
                        <Avatar avatarURL={userDetails.avatarUrl} />
                        <Typography variant="body1" gutterBottom>
                            {userDetails.ninjaName ? userDetails.ninjaName : userDetails.firstName}
                        </Typography>
                    </>
                )}
            </Box>
            <Divider />
            <DarkModeToggle />
            <MenuList>
                <MenuItem component={Link} to="/"><MenuItemIcon><HomeIcon /></MenuItemIcon>Home</MenuItem>
                <MenuItem component={Link} to="/about"><MenuItemIcon><InfoIcon /></MenuItemIcon>About</MenuItem>
                <MenuItem component={Link} to="/contact"><MenuItemIcon><PermContactCalendarIcon /></MenuItemIcon>Contact</MenuItem>
                {/*Event*/}
                <MenuItem component={Link} to="/events"><MenuItemIcon><EmojiEventsIcon /></MenuItemIcon>Event Finder</MenuItem>
                <MenuItem component={Link} to="/gyms"><MenuItemIcon><AddLocationIcon /></MenuItemIcon>Gym Finder</MenuItem>
                <Divider/>

                {/*if the user is a gym owner then show these menu items*/}
                {userDetails && userDetails.userType === 'Gym Owner' && (
                    <>
                    {userDetails.managedGyms.length !== 0 && (
                        <MenuItem component={Link} to="/addevent"><MenuItemIcon><EmojiEventsIcon /></MenuItemIcon>Add an Event</MenuItem>
                    )}
                        {/*// if userDetails.managedGym is equal to or less than 0 then show the add gym menu item*/}
                        {/*// if userDetails.managedGym is equal 1 then show the menu item linking to their gym*/}
                        {userDetails.managedGyms.length === 1 && (
                            <>
                                <MenuItem component={Link} to="/create-gym"><MenuItemIcon><AddLocationIcon /></MenuItemIcon>Add another Gym</MenuItem>

                                <MenuItem component={Link} to={`/gyms/${userDetails.managedGyms}`} style={{ textDecoration: 'none' }}>
                                    <MenuItemIcon><AddLocationIcon /></MenuItemIcon>Manage your Gym
                                </MenuItem>
                            </>
                        )}
                        {/*// if userDetails.managedGym is greater than 1 then show the menu item linking to their gyms*/}
                        {userDetails.managedGyms.length >= 2 && (
                            <>
                                <MenuItem component={Link} to="/create-gym"><MenuItemIcon><AddLocationIcon /></MenuItemIcon>Add another Gym</MenuItem>

                                <MenuItem component={Link} to="/gyms/manage-gyms" style={{ textDecoration: 'none' }}>
                                    <MenuItemIcon><AddLocationIcon /></MenuItemIcon>Manage your Gyms
                                </MenuItem>
                            </>
                        )}
                    </>
                )}
                {/*if the user is a leage admin and has not created a league yet*/}
                {userDetails && userDetails.userType === 'League Admin' && !userDetails.league && (
                    <>
                        <MenuItem component={Link} to="add-league"><MenuItemIcon><EmojiEventsIcon /></MenuItemIcon>Add your League</MenuItem>
                    </>
                )}
                {/*Linkl to the league associated with the users account*/}
                {userDetails && userDetails.league && (
                    <Link to={`/leagues/${userData.league}`} style={{ textDecoration: 'none' }}>
                        <Button variant="contained">Go to Your League</Button>
                    </Link>
                )}
                <MenuItem component={Link} to="/leagues"><MenuItemIcon><AddLocationIcon /></MenuItemIcon>Leagues</MenuItem>
            </MenuList>
            <Divider/>
            <MenuItem component={Link} to="/timers"><MenuItemIcon><AddLocationIcon /></MenuItemIcon>Timers</MenuItem>


            <Divider/>
            {userDetails ? <MenuItem component={Link} to="/manageprofile"><MenuItemIcon><PersonOutlineIcon /></MenuItemIcon>Manage Profile</MenuItem> : null }
            {/*login or logout button depending on user status*/}
            {userDetails ? <MenuItem onClick={handleLogout}><MenuItemIcon><ExitToAppIcon /></MenuItemIcon>Logout</MenuItem> : <MenuItem component={Link} to="/login"><MenuItemIcon><LoginIcon /></MenuItemIcon>Login</MenuItem> }

        </Box>
</>
    );
    // console.log('User info:', userDetails);


    return (
        <div>
            {['left'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <MenuIcon
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(anchor, true)}>
                        {anchor}
                    </MenuIcon>
                    <Drawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                    >
                        {list(anchor)}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
