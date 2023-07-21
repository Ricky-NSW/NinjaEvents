import React from "react";
import {Outlet} from "react-router-dom";
import NavDrawer from "./NavDrawer";
import Box from '@mui/material/Box';
import Header from "./Header";
import Container from '@mui/material/Container';
const Layout = () => {
    return (
        <>
        <Header />
            <Container maxWidth="sm" sx={{ height: '100vh' }}>
                <Outlet />
            </Container>
        </>
    );
};

export default Layout;
