//TODO: add a mark for gyms that are part of thei league
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { Link } from 'react-router-dom';
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import CollectionCard from "../layout/CollectionCard";
const LeagueCard = ({ league, index }) => (
    <>
        <CollectionCard key={league.id} index={index} link={`/leagues/${league.slug}`}>
                {league.avatarUrl ? (
                    <Grid
                        item
                        xs={1}
                        // sx={{paddingRight: '1rem'}}
                    >
                        <Avatar
                            alt={league.name}
                            src={league.smallAvatarUrl}
                            xs={12}
                            //set make the avatar image fit the width of the container
                            sx={{ width: '100%', height: 'auto', maxWidth: '35px' }}
                        />
                    </Grid>
                ) : null}
                <Grid
                    item
                    xs={league.avatarUrl ? 11 : 12}
                >
                    <Typography
                        item
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{marginBottom: '0'}}
                    >
                        {league.name}
                    </Typography>
                </Grid>
                {/*<Typography gutterBottom variant="h5" component="div">*/}
                {/*    <span dangerouslySetInnerHTML={{ __html: league.description }} />*/}
                {/*</Typography>*/}
        </CollectionCard>
    </>
);

export default LeagueCard;
