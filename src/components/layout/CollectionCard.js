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
    // BorderColor: theme.palette.grey.light,
    // border: '1px solid',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '2px',
    width: 'calc(100% - 4px)',
    // boxShadow: '2px 1px 1px hsl(0deg 0% 0% / 0.1)',
    borderRadius: '4px',
    marginBottom: '16px',
    padding: '1rem',
    animation: `${scaleUpFromBottom} 1s ${index * 0.3}s ease-in-out forwards`,
    animationFillMode: 'both',
//change background color depending on the theme whether its dark or light mode
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey.medium : theme.palette.grey.white,
    //add a border using theme.palette.grey.white
    border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.grey.white}` : `1px solid ${theme.palette.grey.light}`,

    // hover state
    '&:hover': {
        boxShadow: '0 16px 64px -16px rgba(46,55,77,.24)',
        // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey.dark : '#fff',
    },

    //style child paragraphs
    '& p': {
        color: theme.palette.mode === 'dark' ? theme.palette.grey.light : theme.palette.grey.dark,
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
