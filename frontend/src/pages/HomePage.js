import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    // Start counting when component mounts
    setIsCounting(true);
    
    const targetCount = 1934;
    const duration = 3000; // 3 seconds
    const increment = targetCount / (duration / 16); // 60fps
    
    let currentCount = 0;
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= targetCount) {
        setCount(targetCount);
        setIsCounting(false);
        clearInterval(timer);
      } else {
        setCount(Math.floor(currentCount));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1 className="hero-title">
          Welcome to TerpTrace
        </h1>
        <p className="hero-subtitle">
          Connect lost items with their owners at the University of Maryland
        </p>
        <div className="hero-buttons">
          <button className="hero-button primary" onClick={() => navigate("/LostSomething")}>
            Lost Something?
          </button>
          <button className="hero-button secondary" onClick={() => navigate("/FoundSomething")}>
            Found Something?
          </button>
        </div>
      </div>
      
      <div className="stats-section">
        <div className="stats-card">
          <div className="stats-number">
            {count.toLocaleString()}
          </div>
          <div className="stats-label">Items Reported</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
