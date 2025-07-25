import React from "react";
import BackendTest from "./BackendTest";
import DatabaseTest from "./DatabaseTest";

import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="page-center">
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          TerpTrace
        </h1>
        <button>Lost Something?</button>
        <button onClick={() => navigate("/FoundSomething")}>
          Found an item?
        </button>
        <BackendTest />
        <DatabaseTest />
      </div>
    </>
  );
}

export default HomePage;
