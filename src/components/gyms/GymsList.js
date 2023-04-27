import React, { useState, useEffect } from 'react';
import { useGyms } from './useGyms';
import { Card, CardContent, Typography, Select, MenuItem, FormControl } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import {states, countries} from './ListOfStates';
import { useDataLayer } from '../data/DataLayer';

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
                    <a key={`${gym.id}-${index}`}
                       href={`gyms/${gym.id}`}
                       target="_self"
                       rel="noopener noreferrer"
                       style={{ textDecoration: 'none', display: 'block', marginBottom: '16px' }}>
                        <Card key={`${gym.id}-${index}`} style={{ marginBottom: '16px' }}>
                            <CardContent>
                                <Typography variant="h5">{gym.name}</Typography>
                                <Typography variant="subtitle1">{gym.address}</Typography>
                                <Typography variant="subtitle2">{gym.state}, {gym.country}</Typography>
                                {/*<Typography variant="body1">Latitude: {gym.latitude}</Typography>*/}
                                {/*<Typography variant="body1">Longitude: {gym.longitude}</Typography>*/}

                            </CardContent>
                        </Card>
                    </a>
                ))}
            </InfiniteScroll>
        </>
    );
};

export default GymsList;
