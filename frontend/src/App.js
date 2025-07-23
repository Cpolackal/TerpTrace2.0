import logo from "./logo.svg";
import "./App.css";
import HomePage from "./pages/HomePage";
import FoundSomething from "./pages/FoundSomething";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/FoundSomething" element={<FoundSomething />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
