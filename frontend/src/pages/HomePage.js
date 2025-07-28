import React, { useState, useEffect } from "react";
import Logo from "../components/Logo";
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
    <>
      <Logo />
      <div className="page-center">
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          TerpTrace
        </h1>
        <div className="homepage-buttons">
          <button className="homepage-button" onClick={() => navigate("/LostSomething")}>
            Lost Something?
          </button>
          <button className="homepage-button" onClick={() => navigate("/FoundSomething")}>
            Found Something?
          </button>
        </div>
      </div>
      <div className="counter-container">
        <div className="counter-number">
          {count.toLocaleString()}
        </div>
        <div className="counter-label">Items Reported</div>
      </div>
    </>
  );
}

export default HomePage;
