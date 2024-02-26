import { Card, CardContent, Typography, Grid, Avatar, Box } from "@mui/material";
import React from "react";
import { useTheme } from '@mui/material/styles';
import CollectionCard from '../layout/CollectionCard';
import { useDataLayer } from "../data/DataLayer";
import EventIcon from '@mui/icons-material/Event';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const GymCard = ({ gym, index }) => {
    const { events, leagues, users } = useDataLayer();
    const theme = useTheme();

    const upcomingEvents = events.filter(event => (event.gym?.id === gym.id || event.gymId === gym.id) && new Date(event.date) > new Date());
    const followingUsers = users.filter(user => user.subscribedGyms?.includes(gym.slug));

    return (
        <CollectionCard key={gym.id} index={index} link={`/gyms/${gym.slug}`}>
            <Grid container spacing={2} alignItems="center">
                {gym.avatarUrl && (
                    <Grid item xs={2}>
                        <Avatar alt={gym.name} src={gym.avatarUrl} sx={{ width: '100%', height: 'auto' }} />
                    </Grid>
                )}
                <Grid item xs={gym.avatarUrl ? 10 : 12}>
                    <Typography variant="h5">{gym.name}</Typography>
                    {gym.address && <Typography variant="body2">{gym.state}, {gym.country}</Typography>}
                    {upcomingEvents.length > 0 && (
                        <Box display="flex" alignItems="center">
                            <EventIcon sx={{ mr: 1 }} />
                            <Typography variant="body2">{upcomingEvents.length} Upcoming events</Typography>
                        </Box>
                    )}
                    {gym.leagues && gym.leagues.length > 0 && (
                        <Box display="flex" alignItems="center" flexDirection="row">
                            <Typography variant="body2" sx={{ mr: 1 }}>Associated Leagues:</Typography>
                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                {gym.leagues.map((leagueId, index) => {
                                    const league = leagues.find(league => league.id === leagueId);
                                    if (!league) return null; // Skip if not found

                                    return (
                                        <Box key={index} sx={{ width: '25px', height: '25px', margin: '0 2px', borderRadius: '50%', overflow: 'hidden' }}>
                                            {league.smallAvatarUrl || league.AvatarUrl ? (
                                                <img src={league.smallAvatarUrl || league.AvatarUrl} alt={league.name} style={{ width: '100%', height: 'auto' }} />
                                            ) : (
                                                <Box sx={{
                                                    width: '25px', height: '25px',
                                                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[300],
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    <Typography variant="body2">{league.name.charAt(0)}</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}
                    {followingUsers.length > 0 && (
                        <Box display="flex" alignItems="center">
                            <AccountCircleOutlinedIcon sx={{ mr: 1 }} />
                            <Typography variant="body2">{followingUsers.length} Followers</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </CollectionCard>
    );
};

export default GymCard;
