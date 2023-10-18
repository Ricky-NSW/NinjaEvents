import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../FirebaseSetup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import {Link, useNavigate} from 'react-router-dom';

//alert
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import MenuItem from "@mui/material/MenuItem";
import MenuItemIcon from "@mui/material/ListItemIcon";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail('')
            setPassword('');
            setLoggedIn(true);
            navigate('/manageprofile');
        } catch (error) {
            console.error(error);
            setError('Failed to sign in.');
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            setLoggedIn(true);
        } catch (error) {
            console.error(error);
            setError('Failed to sign in with Google.');
        }
    };

    const resetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent.');
        } catch (error) {
            console.error(error);
            setError('Failed to send password reset email.');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setError('');
    };

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
                You need to be logged in to view this content.
            </Typography>
            <Collapse in={loggedIn}>
                <Alert severity="success" onClose={() => setLoggedIn(false)}>
                    You are logged in!
                </Alert>
            </Collapse>
            <form onSubmit={handleLogin}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    {error && (
                        <Grid item>
                            <Typography color="error">{error}</Typography>
                        </Grid>
                    )}
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <br />
            <Grid container justifyContent="center" spacing={2}>
                <Grid item>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<GoogleIcon />}
                        onClick={signInWithGoogle}
                    >
                        Login with Google
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="text" color="primary" onClick={resetPassword}>
                        Reset Password
                    </Button>
                </Grid>
            </Grid>
            <Typography variant="body2" gutterBottom mt={2}>
                Don&apos;t have an account? <Link to="/register">Register</Link>
            </Typography>

        </>
    );
}

export default Login;
