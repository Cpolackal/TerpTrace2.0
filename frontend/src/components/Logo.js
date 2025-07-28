import React from "react";
import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="logo-container" onClick={handleClick}>
      <img
        src="/Distressed_Black_Testudo.png"
        alt="TerpTrace Logo"
        className="logo-image"
      />
    </div>
  );
}

export default Logo; 