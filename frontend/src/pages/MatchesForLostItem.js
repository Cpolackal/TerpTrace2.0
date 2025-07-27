import React from 'react';
import { useLocation } from 'react-router-dom';
function MatchesForLostItem() {
    const location = useLocation();
    const matches = location.state?.matches || [];
    
    return(
      <div>
        <h1>Matched Results</h1>
        {matches.length === 0 ? (
            <p>No matches found.</p>
        ) : (
            matches.map((match, index) => (
              <div key = {index} >
                <p>{match.metadata?.name}</p>
                <p>Score: {match.score}</p>
              </div>
            ))
        )}
      </div>
    );
}

export default MatchesForLostItem;