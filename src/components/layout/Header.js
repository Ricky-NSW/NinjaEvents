// Import the LoggedInStatus component
import LoggedInStatus from "../user/LoggedInStatus";
import * as React from 'react';

// Firebase
import { signOut } from 'firebase/auth';
import authContext from "../../contexts/AuthContext";

// Import Material-UI components and icons
import NavDrawer from "./NavDrawer";
import {styled, alpha} from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import Notifications from '../messaging/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';

//MUI icons
import {useContext, useState} from "react";
import AuthContext from "../../contexts/AuthContext";

// Create a styled Search component for the search bar
const Search = styled('div')(({theme}) => ({
    // Styling properties for the search component
}));

// Create a styled SearchIconWrapper component for the search icon
const SearchIconWrapper = styled('div')(({theme}) => ({
    // Styling properties for the search icon wrapper
}));

// Create a styled InputBase component for the search input field
const StyledInputBase = styled(InputBase)(({theme}) => ({
    // Styling properties for the search input field
}));

// Define the Header component
export default function Header() {
    // useState hooks for managing anchor elements for the menus
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const [userData, setUserData] = useState(null);
    const { currentUser } = useContext(AuthContext);

    // Check if the menus are open based on the presence of anchor elements
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    // Functions to handle opening and closing of menus
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogout = async () => {
        try {
            await signOut(authContext);
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    // Define menu IDs
    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';


    // Define the desktop menu with MenuItems for Profile and My account
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
        </Menu>
    );

    // Define the mobile menu with MenuItems for Messages, Notifications, and Profile
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon/>
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">

                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    // Return the complete Header component, which includes the AppBar and menus
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{mr: 2}}
                    >
                        <NavDrawer />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{display: {xs: 'none', sm: 'block'}}}
                    >
                        Community
                    </Typography>

                    <Box sx={{flexGrow: 1}}/>
                    <Notifications />
                    {/*<Box sx={{display: {xs: 'none', md: 'flex'}}}>*/}
                    {/*    <IconButton size="large" aria-label="show 4 new mails" color="inherit">*/}
                    {/*        <Badge badgeContent={4} color="error">*/}
                    {/*            <MailIcon/>*/}
                    {/*        </Badge>*/}
                    {/*    </IconButton>*/}
                    {/*    <IconButton*/}
                    {/*        size="large"*/}
                    {/*        aria-label="show 17 new notifications"*/}
                    {/*        color="inherit"*/}
                    {/*    >*/}
                    {/*        <Badge badgeContent={17} color="error">*/}
                    {/*            /!*<NotificationsIcon/>*!/*/}
                    {/*        </Badge>*/}
                    {/*    </IconButton>*/}
                    {/*    <IconButton*/}
                    {/*        size="large"*/}
                    {/*        edge="end"*/}
                    {/*        aria-label="account of current user"*/}
                    {/*        aria-controls={menuId}*/}
                    {/*        aria-haspopup="true"*/}
                    {/*        onClick={handleProfileMenuOpen}*/}
                    {/*        color="inherit"*/}
                    {/*    >*/}
                    {/*        <AccountCircle/>*/}
                    {/*    </IconButton>*/}
                    {/*</Box>*/}
                    {/*<Box sx={{display: {xs: 'flex', md: 'none'}}}>*/}
                    {/*    <IconButton*/}
                    {/*        size="large"*/}

                    {/*        aria-label="show more"*/}
                    {/*        aria-controls={mobileMenuId}*/}
                    {/*        aria-haspopup="true"*/}
                    {/*        onClick={handleMobileMenuOpen}*/}
                    {/*        color="inherit"*/}
                    {/*    >*/}
                    {/*        <MoreIcon/>*/}
                    {/*    </IconButton>*/}
                    {/*</Box>*/}
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}

