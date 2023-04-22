// import * as React from 'react';
//
// //AUTH
// import AuthContext from "../../contexts/AuthContext";
//
// //MUI
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Switch from '@mui/material/Switch';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormGroup from '@mui/material/FormGroup';
// import MenuItem from '@mui/material/MenuItem';
// import Menu from '@mui/material/Menu';
// import NavDrawer from "./NavDrawer";
// import Avatar from "@mui/material/Avatar";
// import {deepOrange} from "@mui/material/colors";
// import {useContext} from "react";
//
// import styled from "styled-components";
// export default function Navbar() {
//     const [anchorEl, setAnchorEl] = React.useState(null);
//     const { currentUser } = useContext(AuthContext);
//
//     const handleMenu = (event) => {
//         setAnchorEl(event.currentTarget);
//     };
//
//     const handleClose = () => {
//         setAnchorEl(null);
//     };
//
//     const Hamburger = styled(Menu)`
//       justify-self: flex-start;
//       display: none;
//     `
//
//
//     return (
//         <Box sx={{ flexGrow: 1 }}>
//             <AppBar position="static">
//                 <Toolbar>
//                     <NavDrawer />
//                     <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//                         Photos
//                     </Typography>
//                     {currentUser ? (
//                         <>
//                             {/*<div>*/}
//                             {/*    <Avatar alt="Travis Howard" src="https://mui.com/static/images/avatar/1.jpg" />*/}
//                             {/*</div>*/}
//                             <IconButton
//                                 size="large"
//                                 aria-label="account of current user"
//                                 aria-controls="menu-appbar"
//                                 aria-haspopup="true"
//                                 onClick={handleMenu}
//                                 color="inherit"
//                             >
//                                 <AccountCircle />
//                             </IconButton>
//                             <Hamburger
//                                 id="menu-appbar"
//                                 anchorEl={anchorEl}
//                                 anchorOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'right',
//                                 }}
//                                 keepMounted
//                                 transformOrigin={{
//                                     vertical: 'top',
//                                     horizontal: 'right',
//                                 }}
//                                 open={Boolean(anchorEl)}
//                                 onClose={handleClose}
//                             >
//                                 <MenuItem onClick={handleClose}>Profile</MenuItem>
//                                 <MenuItem onClick={handleClose}>My account</MenuItem>
//                             </Hamburger>
//                         </>
//                     ) : (
//                         <>
//                             <Avatar sx={{ bgcolor: deepOrange[500] }}>X</Avatar>
//                             <p>LOGIN</p>
//                         </>
//                     )}
//                 </Toolbar>
//             </AppBar>
//         </Box>
//     );
// }
