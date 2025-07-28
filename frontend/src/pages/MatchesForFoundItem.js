import React from "react";
import { useLocation } from "react-router-dom";

function MatchesForFoundItems() {
  const location = useLocation();
  const matches = location.state?.matches || [];

  function getS3ImageUrl(imageName) {
    const bucket = "terpitems";
    const region = "us-east-2";
    return `https://${bucket}.s3.${region}.amazonaws.com/${imageName}`;
  }

  return (
    <div className="matches-container">
      <h1 className="matches-title">Matched Results</h1>
      {matches.length === 0 ? (
        <p className="no-matches">No matches found.</p>
      ) : (
        matches.map((match, index) => (
          <div key={index} className="match-card">
            <div className="match-content">
              <div className="match-text">
                <h3 className="match-title">
                  {match.metadata?.itemName || "Unnamed Item"}
                </h3>

                {match.metadata?.locationFound && (
                  <p className="match-detail">
                    <strong>Location Found:</strong> {match.metadata.locationFound}
                  </p>
                )}

                {match.metadata?.locationLost && (
                  <p className="match-detail">
                    <strong>Location Lost:</strong> {match.metadata.locationLost}
                  </p>
                )}

                {match.metadata?.description && (
                  <p className="match-detail">
                    <strong>Description:</strong> {match.metadata.description}
                  </p>
                )}

                {match.metadata?.returnedTo && (
                  <p className="match-detail">
                    <strong>Returned To:</strong> {match.metadata.returnedTo}
                  </p>
                )}

                {match.metadata?.phoneNumber && (
                  <p className="match-detail">
                    <strong>Phone:</strong> {match.metadata.phoneNumber}
                  </p>
                )}

                {match.metadata?.emailAdress && (
                  <p className="match-detail">
                    <strong>Email:</strong> {match.metadata.emailAdress}
                  </p>
                )}

                <p className="match-score">
                  Match Score: {(match.score * 100).toFixed(1)}%
                </p>
              </div>

              <img
                src={getS3ImageUrl(match.id)}
                alt="Matched Item"
                className="match-image"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MatchesForFoundItems;
