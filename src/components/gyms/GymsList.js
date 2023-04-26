import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

//firebase
import {db, auth} from '../../FirebaseSetup';
import {doc, deleteDoc} from 'firebase/firestore';
//MUI
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Delete from '@mui/icons-material/Delete';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import {red} from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
//style
import styled from 'styled-components';

// DataLayer
import {useDataLayer} from '../data/DataLayer';
import GoogleMapArray from "../api/GoogleMapArray";

const GymDelete = styled(Button)`
  margin: 0 0 0 1rem;
  padding: 0;
  min-width: 16px;
`;

const GymsContainer = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;

  > div {
    margin-bottom: 1rem;
  }
`;


const GymsList = () => {
    const {gyms} = useDataLayer();

    // Filter states
    const [filterCountry, setFilterCountry] = useState("");
    const [filterState, setFilterState] = useState("");
    const [filterSubscribed, setFilterSubscribed] = useState(false);

    // Sorting state
    const [sortOrder, setSortOrder] = useState("asc");

    // Filter function
    const filteredGyms = gyms.filter(gym => {
        if (filterCountry && gym.country !== filterCountry) return false;
        if (filterState && gym.state !== filterState) return false;
        if (filterSubscribed && !gym.subscribed) return false;
        return true;
    });

    // Sorting function
    const sortedGyms = filteredGyms.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === "asc") {
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        } else {
            if (nameA > nameB) return -1;
            if (nameA < nameB) return 1;
            return 0;
        }
    });

    const handleDelete = async (id) => {
        const docRef = doc(db, 'gyms', id);
        await deleteDoc(docRef);
    };

    return (
        <GymsContainer>
            {/* Filter */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <form noValidate autoComplete="off">
                    <TextField size="small" label="Filter by Country" value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} />
                    <TextField size="small" label="Filter by State" value={filterState} onChange={(e) => setFilterState(e.target.value)} />
                    <FormControl>
                        <InputLabel size="small" id="filter-by-subscribed-label">Filter by Subscribed</InputLabel>
                        <Select size="small" labelId="filter-by-subscribed-label" id="filter-by-subscribed" value={filterSubscribed} onChange={(e) => setFilterSubscribed(e.target.value)}>
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem  value={false}>No</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel size="small" id="sort-by-name-label">Sort by Name</InputLabel>
                        <Select size="small" labelId="sort-by-name-label" id="sort-by-name" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </FormControl>
                </form>
                <Button variant="contained" sx={{ mt: 2 }}>Apply Filters</Button>
            </Box>

            {sortedGyms.map((gym) => (
                <Card key={gym.id} sx={{maxWidth: 768}}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{bgcolor: red[500]}} aria-label="recipe">
                                {gym.createdBy ? gym.createdBy.charAt(0) : 'X'}
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon/>
                            </IconButton>
                        }
                        title={gym.address}
                        subheader={gym.date}
                    />
                    {gym.imageUrl ? (
                        <CardMedia
                            sx={{height: 140}}
                            image={gym.imageUrl}
                            title="green iguana"
                            type="image"
                        />
                    ) : (
                        null
                    )}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {gym.name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            size="small"
                            sx={{
                                color: 'black',
                            }}
                        >Share</Button>
                        <Button
                            component={Link}
                            to={/gyms/ + gym.id}
                            size="small"
                            //style the button
                            sx={{
                                color: 'black',
                            }}
                        >
                            Learn More
                        </Button>
                        {auth.currentUser && auth.currentUser.uid === gym.createdBy ? (
                            <GymDelete
                                onClick={() => handleDelete(gym.id)}
                                size="small"
                                color="error"
                                variant="outlined"
                            >
                                <DeleteIcon/>
                            </GymDelete>
                        ) : null}
                    </CardActions>
                </Card>
            ))}
        </GymsContainer>
    );

};

export default GymsList;
