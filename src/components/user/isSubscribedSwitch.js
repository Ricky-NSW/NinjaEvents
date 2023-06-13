import React from 'react';
import IconButton from '@mui/material/IconButton';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { styled } from '@mui/system';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    marginLeft: '0',
}));

const StyledBookmarkIcon = styled(BookmarkIcon)(({ theme }) => ({
    color: '#F07593',
    marginLeft: '0',
    [theme.breakpoints.up('sm')]: {
        color: 'green',
    },
}));

const StyledBookmarkBorderIcon = styled(BookmarkBorderIcon)(({ theme }) => ({
    color: '#F07593',
    marginLeft: '0',
    [theme.breakpoints.up('sm')]: {
        color: '#F07593',
    },
}));

function IsSubscribedSwitch({ isSubscribed, handleSubscription }) {
    return (
        <StyledIconButton onClick={handleSubscription}>
            {isSubscribed ? (
                <StyledBookmarkIcon />
            ) : (
                <StyledBookmarkBorderIcon />
            )}
        </StyledIconButton>
    );
}

export default IsSubscribedSwitch;
