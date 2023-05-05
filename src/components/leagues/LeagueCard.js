//TODO: add a mark for gyms that are part of thei league
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const LeagueCard = ({ league }) => (
    <>
        <a
            href={`leagues/${league.id}`}
            target="_self"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}
        >
            <Card key={league.id} style={{ marginBottom: '16px' }}>
                <CardContent>
                    <Typography variant="h5">{league.name}</Typography>
                    {league.address && (
                        <>
                            <Typography variant="subtitle1">{league.address}</Typography>
                            <Typography variant="subtitle2">
                        {league.state}, {league.country}
                            </Typography>
                        </>
                    )}
                    {/*<Typography variant="body1">Latitude: {league.latitude}</Typography>*/}
                    {/*<Typography variant="body1">Longitude: {league.longitude}</Typography>*/}
                </CardContent>
            </Card>
        </a>
    </>
);

export default LeagueCard;
