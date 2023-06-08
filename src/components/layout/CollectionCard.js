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

    //remove underline from text
    '& a': {
        textDecoration: 'none',
    },

    //hover state
    '&:hover': {
        backgroundColor: theme.palette.grey.light,
    }

}));

const Collection = ({ key, loading, link, index, children}) => {

    if (loading) {
        return (
            <>
                <StyledGrid container direction="row" justify="flex-start" alignItems="center">
                    <Grid item xs={2} sm={2}>
                        <Skeleton variant="circle">
                            <Avatar />
                        </Skeleton>
                    </Grid>
                    <Grid item xs={10} sm={10}>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                    </Grid>

                </StyledGrid>
            </>
        );
    }

    return (
        <>
            <Link
                to={link}
                style={{ display: 'block' }}
            >
                <StyledGrid
                    key={key}
                    index={index}
                    container
                    direction="row"
                    xs={12}
                >
                    {children}
                </StyledGrid>
            </Link>
        </>
    );
};

export default Collection;
