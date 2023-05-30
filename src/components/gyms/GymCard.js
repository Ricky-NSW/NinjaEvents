import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import Skeleton from '@mui/material/Skeleton';
import { keyframes } from '@emotion/react';

const scaleUpFromBottom = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const StyledGrid = styled(Grid)(({ theme, index }) => ({
    BorderColor: theme.palette.grey.light,
    border: '1px solid',
    borderRadius: '4px',
    marginBottom: '16px',
    padding: '1rem',
    animation: `${scaleUpFromBottom} 1s ${index * 0.3}s ease-in-out forwards`,
    animationFillMode: 'both',

    //hover state
    '&:hover': {
        backgroundColor: theme.palette.grey.light,
    }

}));

const GymCard = ({ gym, loading, index }) => {

    if (loading) {
        return (
            <>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item xs={10} sm={10}>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <Skeleton variant="circle">
                            <Avatar />
                        </Skeleton>
                    </Grid>
                </Grid>
            </>
        );
    }

    return (
        <>
            <Link
                to={`/gyms/${gym.slug}`}
                target="_self"
                style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}
            >
                <StyledGrid
                    key={gym.id}
                    index={index}
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >

                    <Grid item xs={10} sm={10}>
                        <Typography variant="h3">{gym.name}</Typography>
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
                    </Grid>
                    {gym.avatarUrl ? (
                        <Grid item xs={2} sm={2}>
                            <Avatar alt={gym.name} src={gym.avatarUrl} />
                        </Grid>
                    ) : null}
                </StyledGrid>
            </Link>
        </>
    );
};

export default GymCard;
