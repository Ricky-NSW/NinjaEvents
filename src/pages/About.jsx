import React, { useContext } from 'react';
//gets the global state of user:
import AuthContext from '../contexts/AuthContext';

//MUI
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NavigationIcon from '@mui/icons-material/Navigation';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";

function About() {

    const { currentUser } = useContext(AuthContext);

    return (
        <>
            <h1>About</h1>
            {currentUser ? (
                <p>Hello, {currentUser.email}!</p>
            ) : (
                <p>You are not logged in.</p>
            )}
            <Button variant="contained">Hello World</Button>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mi purus, sodales sit amet volutpat a, laoreet at metus. Integer nisl purus, volutpat at eros vel, elementum sollicitudin tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque rhoncus porttitor semper. Suspendisse egestas porttitor ligula non placerat. Quisque viverra massa aliquet lectus cursus, sed dapibus mauris tincidunt. Integer efficitur vel augue in aliquet. Nam porta, lorem at ultricies faucibus, nulla orci placerat tortor, in auctor justo leo vel risus. Fusce id neque mattis, commodo dui id, convallis libero. Suspendisse viverra sapien quis mauris convallis, eu venenatis urna tempor. Vivamus vel dolor non felis porta ornare sed sed neque. Sed quam sem, tincidunt sit amet augue vitae, sollicitudin congue est. Fusce vehicula risus enim, at tincidunt felis pulvinar nec. Vestibulum vitae cursus eros. Quisque molestie eu urna ut facilisis.

                Nulla porta elit mollis, auctor dui vitae, sagittis sem. Donec sit amet interdum justo. Curabitur dictum porttitor nulla quis feugiat. Vivamus interdum massa ut velit tincidunt, sit amet rutrum nibh finibus. Nam tempor nibh vel fermentum porta. Fusce sed imperdiet arcu. Proin sagittis ut nisi a sollicitudin.</p>

            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                <Fab color="primary" aria-label="add">
                    <AddIcon />
                </Fab>
                <Fab color="secondary" aria-label="edit">
                    <EditIcon />
                </Fab>
                <Fab variant="extended">
                    <NavigationIcon sx={{ mr: 1 }} />
                    Navigate
                </Fab>
                <Fab disabled aria-label="like">
                    <FavoriteIcon />
                </Fab>
            </Box>

            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles, with over 6,000
                        species, ranging across all continents except Antarctica
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Share</Button>
                    <Button component={Link} to="/contact" size="small">Learn More</Button>
                </CardActions>
            </Card>
        </>
    );
}

export default About;
