import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

//firebase
import { db, auth } from '../../FirebaseSetup';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
//MUI
import LeagueCard from '../../components/leagues/LeagueCard';
//style
import styled from 'styled-components';

const LeaguesContainer = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  
  > div{
    margin-bottom: 1rem;
  }
`;

function truncateDescription(description, maxLength) {
    return description && description.length > maxLength
        ? description.substring(0, maxLength) + '...'
        : description;
}

const LeaguesList = ({ leagues }) => {
    // console.log('Leagues on league component:', leagues)

    return (
        <LeaguesContainer>
            {leagues && leagues.length && leagues.map((league, index) => (
                <LeagueCard key={league.id} league={league} index={index} />
            ))}
        </LeaguesContainer>
    );
};

export default LeaguesList;
