import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { styled } from "@mui/system";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledHeading = styled(Typography)`
  color: #333;
  font-weight: bold;
  font-size: 1.1rem;
`;

const ResultsDisplay = ({ results }) => {
    useEffect(() => {
        displayResults();
    }, [results]);

    const displayResults = ( isEventDatePassed ) => {
        if (Object.keys(results).length > 0) {
            return Object.entries(results).map(([divisionId, divisionData]) => {
                const divisionName = divisionData.name;
                const participants = divisionData.results;

                return (
                    <Accordion key={divisionId}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <StyledHeading variant="h3">Division: {divisionName}</StyledHeading>
                        </AccordionSummary>
                        <AccordionDetails>
                            {participants.map((participant, index) => {
                                const placeLabel =
                                    index === 0
                                        ? "First"
                                        : index === 1
                                            ? "Second"
                                            : index === 2
                                                ? "Third"
                                                : `${index + 1}th`;
                                return (
                                    <div key={participant.id || participant.displayName || index}>
                                        {participant.displayName ? (
                                            <div>
                                                <Typography variant="body1">
                                                    {placeLabel}: {participant.displayName}
                                                </Typography>
                                            </div>
                                        ) : (
                                            <div>
                                                <Typography variant="body1">
                                                    {placeLabel}:
                                                    <Link to={`/users/${participant.id}`}>
                                                        {participant.firstName} {participant.lastName}
                                                    </Link>
                                                </Typography>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </AccordionDetails>
                    </Accordion>
                );
            });
        }

        return isEventDatePassed ? <p>Results have not been posted for this event.</p> : null;
    };

    return displayResults();
};

export default ResultsDisplay;
