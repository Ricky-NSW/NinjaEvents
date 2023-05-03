// GymListPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import MenuItemIcon from "@mui/material/ListItemIcon";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import GymCard from '../../components/gyms/GymCard';
import { useDataLayer } from '../../components/data/DataLayer'; // Import useDataLayer

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function UsersGymList() {
    const { currentUser } = useDataLayer(); // Get currentUser from the data layer

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    console.log('User details on managed gyms', currentUser);

    return (
        <>
            {currentUser.managedGyms ? (
                <div>
                    <h2>Your Gyms</h2>
                    <Typography variant="p">Click on a Gym to edit it.</Typography>

                    {/* Loop through the currentUser.managedGyms */}
                    <Stack direction="column" spacing={2}>
                        {currentUser.managedGyms.map((gym, index) => {
                            return (
                                <GymCard gym={gym}/>
                            )
                        })}
                    </Stack>
                </div>
            ) : (
                <Typography
                    variant="p"
                    sx={{ color: "text.secondary" }}
                >
                    You need 2 or more gyms to use this feature.
                </Typography>
            )}
        </>
    );
}



export default UsersGymList;
