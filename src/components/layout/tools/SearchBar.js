import React, { useState } from 'react';
import { Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchText);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
            }}
        >
            <TextField
                value={searchText}
                onChange={handleSearchTextChange}
                label="Search"
                variant="outlined"
                sx={{
                    flexGrow: 1,
                    marginRight: 1,
                    borderRadius: '25px',
                    '& fieldset': { borderRadius: '1rem' },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" sx={{ marginRight: '-14px' }}>
                            <IconButton type="submit" color="primary" aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar;
