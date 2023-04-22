import React from 'react';
import IconButton from '@mui/material/IconButton';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';

function IsSubscribedSwitch({ isSubscribed, handleSubscription }) {

    return (
        <IconButton onClick={handleSubscription}>
            {isSubscribed ? (
                <Favorite style={{ color: '#F07593' }} />
            ) : (
                <FavoriteBorder style={{ color: '#F07593' }} />
            )}
        </IconButton>
    );
}

export default IsSubscribedSwitch;
