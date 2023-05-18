import React, { useState, useEffect } from 'react';
import { useGyms } from './useGyms';
import { Card, CardContent, Typography, Select, MenuItem, FormControl } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import {states, countries} from './ListOfStates';
import { useDataLayer } from '../data/DataLayer';
import GymCard from './GymCard';
const GymsList = () => {
    const [filters, setFilters] = useState({ country: '', state: '' });
    const [triggerFetchMore, setTriggerFetchMore] = useState(false);

    const { currentUser } = useDataLayer();

    const { gyms, loading, setLoading, hasMore } = useGyms(filters, triggerFetchMore);

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
                <Select value={filters.country} onChange={handleCountryChange}>
                    {Object.entries(countries).map(([key, name]) => (
                        <MenuItem key={key} value={key}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <Select value={filters.state} onChange={handleStateChange}>
                    <MenuItem value="">
                        <em>Select a state</em>
                    </MenuItem>
                    {(states[filters.country] || []).map(({ code, name }) => (
                        <MenuItem key={code} value={code}>
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                {gyms.map((gym, index) => (
                    <GymCard key={`${gym.name}-${index}`} gym={gym} />
                ))}
            </InfiniteScroll>
        </>
    );
};

export default GymsList;
