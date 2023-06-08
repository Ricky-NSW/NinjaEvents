import React, { useState, useEffect } from 'react';

//Firebase
import { db } from '../../FirebaseSetup';
import { useDataLayer } from '../../components/data/DataLayer';  // Import the hook

//MUI
import UsersList from '../../components/user/UsersList';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
function UsersPage() {
    //import users from datalayer
    const { users } = useDataLayer();
    console.log("Gyms in UsersPage:", {users});

    return (
        <div>
            <h1>Users</h1>
            <UsersList users={users} />


        </div>
    );
}

export default UsersPage;
