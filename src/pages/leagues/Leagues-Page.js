import React from 'react';
import { Link } from 'react-router-dom';

// Custom Hook
import { useDataLayer } from '../../components/data/DataLayer';

//MUI
import LeaguesList from "../../components/leagues/LeaguesList";

function LeaguesPage() {
    const { leagues } = useDataLayer();

    return (
        <div>
            <h1>Events</h1>
            <LeaguesList leagues={leagues} />
        </div>
    );
}

export default LeaguesPage;
