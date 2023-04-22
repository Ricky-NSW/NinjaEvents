import React, { useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Autocomplete from "@mui/lab/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    // Styling properties for the search input field
}));

const SearchBar = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (searchText) => {
        setLoading(true);
        const db = getFirestore();
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const gymsSnapshot = await getDocs(collection(db, "gyms"));
        const usersSnapshot = await getDocs(collection(db, "users"));

        const events = eventsSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "event",
            ...doc.data(),
        }));

        const gyms = gymsSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "gym",
            ...doc.data(),
        }));

        const users = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            type: "user",
            ...doc.data(),
        }));

        const allData = [...events, ...gyms, ...users];
//title doesnt exist on gyms or users
        // const filteredData = allData.filter((item) =>
        // {item.title ? item.title.toLowerCase().includes(searchText.toLowerCase()) : item.name.toLowerCase().includes(searchText.toLowerCase()) }
        // );

        const filteredData = allData.filter((item) => {
            const searchTerm = searchText.toLowerCase();
            const titleMatch = item.title && item.title.toLowerCase().includes(searchTerm);
            const nameMatch = item.name && item.name.toLowerCase().includes(searchTerm);
            const firstnameMatch = item.firstName && item.firstName.toLowerCase().includes(searchTerm);
            return titleMatch || nameMatch;
        });



        setSearchResults(filteredData);
        setLoading(false);
    };

    const handleSearchChange = (event, value) => {
        if (value) {
            fetchData(value);
        } else {
            setSearchResults([]);
        }
    };

    return (
        <Autocomplete
            freeSolo
            size="small"
            options={searchResults.map((item) => (item.type === "gym" ? item.name : item.title))}
            loading={loading}
            onInputChange={handleSearchChange}
            renderInput={(params) => (
                <StyledInputBase
                    {...params}
                    placeholder="Search…"
                    inputProps={{
                        ...params.inputProps,
                        "aria-label": "search",
                    }}
                    endAdornment={
                        <>
                            {loading ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                        </>
                    }
                />
            )}
        />
    );
};

export default SearchBar;
