import logo from "./logo.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import FoundSomething from "./pages/FoundSomething";
import LostSomething from "./pages/LostSomething";
import MatchesForLostItem from "./pages/MatchesForLostItem"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MatchesForFoundItem from "./pages/MatchesForFoundItem";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/FoundSomething" element={<FoundSomething />} />
            <Route path="/LostSomething" element={<LostSomething />} />
            <Route path="/MatchesForLostItem" element={<MatchesForLostItem />} />
            <Route path="/MatchesForFoundItem" element={<MatchesForFoundItem />} />
            <Route path="/HowItWorks" element={<HowItWorks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
