import React from 'react';
import { Avatar as MuiAvatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Avatar = ({ user, avatarURL }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/manageprofile');
    };

    const getInitials = () => {
        if (user && user.firstName && user.lastName) {
            return user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
        } else if (user && user.email) {
            return user.email.charAt(0).toUpperCase();
        } else {
            return '';
        }
    };

    const getAvatar = () => {
        if (avatarURL) {
            return <MuiAvatar
                src={avatarURL}
                // alt={`${user.firstName} ${user.lastName}`}
                sx={{ width: 30, height: 30, cursor: 'pointer', objectFit: 'cover' }}
                onClick={handleClick}
            />;
        } else {
            const initials = getInitials();
            const colors = [
                '#f44336', // red
                '#e91e63', // pink
                '#9c27b0', // purple
                '#673ab7', // deep purple
                '#3f51b5', // indigo
                '#2196f3', // blue
                '#03a9f4', // light blue
                '#00bcd4', // cyan
                '#009688', // teal
                '#4caf50', // green
                '#8bc34a', // light green
                '#cddc39', // lime
                '#ffeb3b', // yellow
                '#ffc107', // amber
                '#ff9800', // orange
                '#ff5722', // deep orange
                '#795548', // brown
                '#9e9e9e', // grey
                '#607d8b', // blue grey
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
                <MuiAvatar
                    sx={{
                        width: 30,
                        height: 30,
                        cursor: 'pointer',
                        backgroundColor: randomColor,
                    }}
                    onClick={handleClick}
                >
                    {initials}
                </MuiAvatar>
            );
        }
    };

    return getAvatar();
};

export default Avatar;
