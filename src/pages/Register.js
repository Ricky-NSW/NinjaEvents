// TODO: verify password

import React from 'react';
import RegisterUser from '../components/user/RegisterUser';
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
function Register() {

    //modal




    return (
        <div>
            <h1>Register</h1>

            <RegisterUser />

        </div>
    );
}

export default Register;
