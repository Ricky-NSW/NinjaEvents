import React, { useContext } from 'react';
import { useDataLayer } from "../data/DataLayer";
import { List, ListItem, ListItemText } from '@mui/material';
import UserCard from "./UserCard";

const UsersList = () => {
    const { users } = useDataLayer();

    if (!users) {
        return <p>Loading...</p>
    }

    return (
        <List>
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </List>
    );
}

export default UsersList;
