import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const GymCard = ({ gym }) => (
    <>
        <a
            href={gym.id}
            target="_self"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}
        >
            <Card key={gym.id} style={{ marginBottom: '16px' }}>
                <CardContent>
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
        </a>
    </>
);

export default GymCard;
