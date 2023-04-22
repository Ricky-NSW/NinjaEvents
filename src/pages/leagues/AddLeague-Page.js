import React from 'react';
import CreateLeague from "../../components/leagues/CreateLeague";
import Button from "@mui/material/Button";


function AddLeaguePage() {

    return (
        <>
            <h1>Add an League</h1>

            <div>
                <CreateLeague />
            </div>
        </>
    );
}

export default AddLeaguePage;
