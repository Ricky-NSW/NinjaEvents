import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../FirebaseSetup';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RegisterUser() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [country, setCountry] = useState('');
    const [userType, setUserType] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;

            await setDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                email,
                country,
                userType,
            });

            setMessage('You have successfully registered.');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setCountry('');
            setUserType('');
        } catch (error) {
            console.error(error);
            setError('Failed to register.');
        }
    };

    const handleProfileCompletion = () => {
        navigate('/manageprofile');
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel id="user-type-label">User Type</InputLabel>
                    <Select
                        labelId="user-type-label"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        required
                    >
                        <MenuItem value="Athlete">Athlete</MenuItem>
                        <MenuItem value="Gym Owner">Gym Owner</MenuItem>
                        <MenuItem value="League Admin">League Admin</MenuItem>
                        <MenuItem value="Guardian">Guardian</MenuItem>
                    </Select>
                </FormControl>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button type="submit">Register</Button>
            </form>
            {message && (
                <div>
                    <p style={{ color: 'green' }}>{message}</p>
                    <Button onClick={handleProfileCompletion}>Click here to complete your profile</Button>
                </div>
            )}
        </div>
    );
}

export default RegisterUser;
