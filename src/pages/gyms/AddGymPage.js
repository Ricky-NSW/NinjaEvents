import React from 'react';
import CreateGym from "../../components/gyms/CreateGym";
import Button from "@mui/material/Button";


function AddEventPage() {
    const libraries = ["places"];

    return (
        <>
            <h1>Add a Gym</h1>

            <div>
                <CreateGym libraries={libraries} />
            </div>
        </>
    );
}

export default AddEventPage;
