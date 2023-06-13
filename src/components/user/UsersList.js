import React, { useContext } from 'react';
import { useDataLayer } from "../data/DataLayer";
import { List, ListItem, ListItemText } from '@mui/material';
import UserCard from "./UserCard";
import Loading from '../data/Loading';
const UsersList = () => {
    const { users } = useDataLayer();

    if (!users) {
        return <Loading />
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
