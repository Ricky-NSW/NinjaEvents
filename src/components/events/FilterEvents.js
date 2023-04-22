import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const FilterEvents = ({ onFilterChange }) => {
    const [age, setAge] = useState('');
    const [price, setPrice] = useState('');
    const [search, setSearch] = useState('');

    const handleAgeChange = (event) => {
        setAge(event.target.value);
        onFilterChange({ age: event.target.value, price, search });
    };

    const handlePriceChange = (event) => {
        setPrice(event.target.value);
        onFilterChange({ age, price: event.target.value, search });
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        onFilterChange({ age, price, search: event.target.value });
    };

    return (
        <form>
            <FormControl fullWidth variant="outlined">
                <InputLabel>Age</InputLabel>
                <Select value={age} onChange={handleAgeChange} label="Age">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Children'}>Children</MenuItem>
                    <MenuItem value={'Adults'}>Adults</MenuItem>
                    <MenuItem value={'All Ages'}>All Ages</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" style={{ marginTop: 16 }}>
                <InputLabel>Price</InputLabel>
                <Select value={price} onChange={handlePriceChange} label="Price">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={'Free'}>Free</MenuItem>
                    <MenuItem value={'Paid'}>Paid</MenuItem>
                </Select>
            </FormControl>

            <TextField
                fullWidth
                variant="outlined"
                style={{ marginTop: 16 }}
                label="Search"
                value={search}
                onChange={handleSearchChange}
            />
        </form>
    );
};

export default FilterEvents;
