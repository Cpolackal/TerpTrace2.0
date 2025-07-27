import logo from "./logo.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import FoundSomething from "./pages/FoundSomething";
import LostSomething from "./pages/LostSomething";
import MatchesForLostItem from "./pages/MatchesForLostItem"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MatchesForFoundItem from "./pages/MatchesForFoundItem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/FoundSomething" element={<FoundSomething />} />
        <Route path="/LostSomething" element={<LostSomething />} />
        <Route path="/MatchesForLostItem" element={<MatchesForLostItem />} />
        <Route path="/MatchesForFoundItem" element={<MatchesForFoundItem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
