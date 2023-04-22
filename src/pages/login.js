import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import Login from '../components/user/Login';
import loginBackground from '../../src/images/login-background.jpg';

const StyledRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage: `url(${loginBackground})`,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(4),
}));

const WelcomeMessage = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

function LoginPage() {
    return (
        <StyledRoot>
            <StyledContainer maxWidth="sm">
                <WelcomeMessage variant="h4" component="h1">
                    {/*Welcome to GymApp*/}
                </WelcomeMessage>
                <Container fixed>
                    <Login />
                </Container>
            </StyledContainer>
        </StyledRoot>
    );
}

export default LoginPage;
