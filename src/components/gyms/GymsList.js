import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

//firebase
import {db, auth} from '../../FirebaseSetup';
import {doc, deleteDoc} from 'firebase/firestore';
//MUI
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

//style
import styled from 'styled-components';

// DataLayer
import {useDataLayer} from '../data/DataLayer';

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
            <div>
                <label>Filter by Country:</label>
                <input type="text" value={filterCountry} onChange={e => setFilterCountry(e.target.value)}/>
            </div>
            <div>
                <label>Filter by State:</label>
                <input type="text" value={filterState} onChange={e => setFilterState(e.target.value)}/>
            </div>
            <div>
                <label>Filter by Subscribed:</label>
                <input type="checkbox" checked={filterSubscribed}
                       onChange={e => setFilterSubscribed(e.target.checked)}/>
            </div>

            {/* Sort */}
            <div>
                <label>Sort by Name
                    <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
            </div>


            {/* Render Gyms */}
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
