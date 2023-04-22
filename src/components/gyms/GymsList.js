import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

//firebase
import { db, auth } from '../../FirebaseSetup';
import { doc, deleteDoc } from 'firebase/firestore';
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
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

//style
import styled from 'styled-components';

// DataLayer
import { useDataLayer } from '../data/DataLayer';

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
    const { gyms } = useDataLayer();

    const handleDelete = async (id) => {
        const docRef = doc(db, 'gyms', id);
        await deleteDoc(docRef);
    };

    return (
        <GymsContainer>
            {gyms.map((gym) => (
                <Card key={gym.id} sx={{ maxWidth: 768 }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {gym.createdBy ? gym.createdBy.charAt(0) : 'X'}
                            </Avatar>
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={gym.address}
                        subheader={gym.date}
                    />
                    {gym.imageUrl ? (
                        <CardMedia
                            sx={{ height: 140 }}
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
                        <Button size="small">Share</Button>
                        <Button component={Link} to={`/gyms/` + gym.id} size="small">
                            Learn More
                        </Button>

                        {auth.currentUser && auth.currentUser.uid === gym.createdBy ? (
                            <GymDelete
                                onClick={() => handleDelete(gym.id)}
                                size="small"
                                color="error"
                                variant="outlined"
                            >
                                <DeleteIcon />
                            </GymDelete>
                        ) : null}
                    </CardActions>
                </Card>
            ))}
        </GymsContainer>
    );
};

export default GymsList;
