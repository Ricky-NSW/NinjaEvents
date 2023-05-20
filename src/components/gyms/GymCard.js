import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { Link } from 'react-router-dom';

const GymCard = ({ gym }) => (
    <>
        <Link
            to={`/gyms/${gym.slug}`}
            target="_self"
            style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}
        >
            <Card key={gym.id} style={{ marginBottom: '16px' }}>
                <CardContent>
                        {gym.avatarUrl ? (
                            <Grid item xs={2} sm={6}>
                                <Avatar alt={gym.name} src={gym.avatarUrl} />
                            </Grid>
                        ) : null}
                    <Typography variant="h5">{gym.name}</Typography>
                    {gym.address && (
                        <>
                            <Typography variant="subtitle1">{gym.address}</Typography>
                            <Typography variant="subtitle2">
                        {gym.state}, {gym.country}
                            </Typography>
                        </>
                    )}
                    {/*<Typography variant="body1">Latitude: {gym.latitude}</Typography>*/}
                    {/*<Typography variant="body1">Longitude: {gym.longitude}</Typography>*/}
                </CardContent>
            </Card>
        </Link>
    </>
);

export default GymCard;
