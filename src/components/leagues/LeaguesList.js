import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

//firebase
import { db, auth } from '../../FirebaseSetup';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
//MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

//style
import styled from 'styled-components';

const LeaguesContainer = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  
  > div{
    margin-bottom: 1rem;
  }
`;

function truncateDescription(description, maxLength) {
    return description && description.length > maxLength
        ? description.substring(0, maxLength) + '...'
        : description;
}

const LeaguesList = ({ leagues }) => {
    return (
        <LeaguesContainer>
            {leagues.map((league) => (
                <Card key={league.id} sx={{ maxWidth: 768 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {league.name}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            {truncateDescription(league.description, 100)}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Share</Button>
                        <Button component={Link} to={`/leagues/` + league.id} size="small">Learn More</Button>
                    </CardActions>
                </Card>
            ))}
        </LeaguesContainer>
    );
};

export default LeaguesList;
