import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import API_ENDPOINTS from "../config/api.js";

function Account() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  function getS3ImageUrl(imageName) {
    const bucket = "terpitems";
    const region = "us-east-2";
    return `https://${bucket}.s3.${region}.amazonaws.com/${imageName}`;
  }

  async function getItems() {
    console.log("Fetching user items...");
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("No user logged in");
        setLoading(false);
        return;
      }

      setUser(currentUser);
      const userId = currentUser.uid;
      const items = await fetch(API_ENDPOINTS.getUserItems(userId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (items.ok) {
        const data = await items.json();
        console.log("User items:", data);
        setMatches(data.lostItems || []);
      } else {
        console.error("Failed to fetch user items");
        setMatches([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getItems();
  }, []);

  if (loading) {
    return (
      <div className="matches-container">
        <h1 className="matches-title">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="matches-container">
      <div style={{ 
        textAlign: "center", 
        marginBottom: "2rem",
        fontSize: "2rem",
        fontWeight: "600",
        background: "linear-gradient(45deg, white, #ff4444)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        Hi, {user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'User'} • Your Lost Items
      </div>
      {matches.length === 0 ? (
        <p className="no-matches">No lost items found.</p>
      ) : (
        matches.map((item, index) => (
          <div key={index} className="match-card">
            <div className="match-content">
              <div className="match-text">
                <h3 className="match-title">
                  {item.itemName || "Unnamed Item"}
                </h3>

                {item.locationLost && (
                  <p className="match-detail">
                    <strong>Location Lost:</strong>{" "}
                    {item.locationLost}
                  </p>
                )}

                {item.description && (
                  <p className="match-detail">
                    <strong>Description:</strong> {item.description}
                  </p>
                )}
              </div>

              {item.imageName && (
                <img
                  src={getS3ImageUrl(item.imageName)}
                  alt="Lost Item"
                  className="match-image"
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Account;
