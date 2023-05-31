import React, { useState, useEffect } from 'react';
import { useGyms } from './useGyms';
import { Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDataLayer } from '../data/DataLayer';
import GymCard from './GymCard';
import GoogleMapArray from "../api/GoogleMapArray";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    select: {
        minWidth: '12rem',
    }
}));

const GymsList = () => {
    const [filters, setFilters] = useState({ country: '', state: '' });
    const [triggerFetchMore, setTriggerFetchMore] = useState(false);
    const { currentUser } = useDataLayer();
    const { gyms, loading, setLoading, hasMore } = useGyms(filters, triggerFetchMore);
    const classes = useStyles();

    const countriesFromGyms = Array.from(new Set(gyms.map(gym => gym.country)));
    const statesFromGyms = Array.from(new Set(gyms.map(gym => gym.state)));


    useEffect(() => {
        if (currentUser) {
            setFilters((prevFilters) => ({ ...prevFilters, country: currentUser.country }));
        }
    }, [currentUser]);

    const handleCountryChange = (event) => {
        setFilters({ ...filters, country: event.target.value });
        setTriggerFetchMore(false);
    };

    const handleStateChange = (event) => {
        setFilters({ ...filters, state: event.target.value });
        setTriggerFetchMore(false);
    };

    // console.log('gyms list info', gyms);
    return (
        <>
            <FormControl>
                <InputLabel id="demo-simple-select-placeholder-label-label">
                    Country
                </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={filters.country || ""}
                    onChange={handleCountryChange}
                    className={classes.select}
                    label="Select"
                >
                    <MenuItem value="">
                        <em>All Countries</em>
                    </MenuItem>
                    {countriesFromGyms.map(country => (
                        <MenuItem key={country} value={country}>
                            {country}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel id="demo-simple-select-placeholder-label-label">
                    State
                </InputLabel>
                <Select
                    value={filters.state}
                    onChange={handleStateChange}
                    className={classes.select}
                >
                    <MenuItem value="">
                        <em>All States</em>
                    </MenuItem>
                    {statesFromGyms.map(state => (
                        <MenuItem key={state} value={state}>
                            {state}
                        </MenuItem>
                    ))}
                </Select>

            </FormControl>
            <br />
            <br />

            <GoogleMapArray markers={gyms}/>


            <InfiniteScroll
                dataLength={gyms.length}
                next={() => {
                    if (hasMore) {
                        setLoading(true);
                        setTriggerFetchMore(true);
                    }
                }}
                hasMore={hasMore}
                loader={gyms.length === 0 && <h4>Loading...</h4>}
            >
                <br />
                {gyms.map((gym, index) => (
                    <GymCard key={`${gym.name}-${index}`} gym={gym} isLoading={loading} index={index}/>
                ))}
            </InfiniteScroll>


        </>
    );
};

export default GymsList;
