import React from 'react';
import { Link } from 'react-router-dom';

// Custom Hook
import { useDataLayer } from '../../components/data/DataLayer';

//MUI
import LeaguesList from "../../components/leagues/LeaguesList";

function LeaguesPage() {
    const { leagues } = useDataLayer();

console.log('leagues on leagues page:', leagues)

    return (
        <div>
            <h1>leagues</h1>
            <LeaguesList leagues={leagues} />
        </div>
    );
}

export default LeaguesPage;
