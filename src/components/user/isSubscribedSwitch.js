import React from 'react';
import IconButton from '@mui/material/IconButton';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

function IsSubscribedSwitch({ isSubscribed, handleSubscription }) {

    return (
        <IconButton onClick={handleSubscription}>
            {isSubscribed ? (
                <BookmarkIcon style={{ color: '#F07593' }} />
            ) : (
                <BookmarkBorderIcon style={{ color: '#F07593' }} />
            )}
        </IconButton>
    );
}

export default IsSubscribedSwitch;
