import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../users/firebase";
import { logout } from "../users/auth";
import Logo from "./Logo";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" style={{ marginRight: "2.5rem" }}>
            <Link
              to="/"
              className="navbar-logo"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
              }}
            >
              <Logo />
              <span
                className="navbar-title"
                style={{ marginLeft: "0.5rem", cursor: "pointer" }}
              >
                TerpTrace
              </span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" style={{ marginRight: "2.5rem" }}>
          <Link
            to="/"
            className="navbar-logo"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <Logo />
            <span
              className="navbar-title"
              style={{ marginLeft: "0.5rem", cursor: "pointer" }}
            >
              TerpTrace
            </span>
          </Link>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <Link
            to="/"
            className={`navbar-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/LostSomething"
            className={`navbar-link ${
              isActive("/LostSomething") ? "active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Lost Something?
          </Link>
          <Link
            to="/FoundSomething"
            className={`navbar-link ${
              isActive("/FoundSomething") ? "active" : ""
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Found Something?
          </Link>
          <Link
            to="/HowItWorks"
            className={`navbar-link ${isActive("/HowItWorks") ? "active" : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </Link>
          
          {!user ? (
            <>
              <Link
                to="/login"
                className={`navbar-link ${isActive("/login") ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`navbar-link ${isActive("/register") ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/account"
                className={`navbar-link ${isActive("/account") ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Account
              </Link>
              <button
                className="navbar-link sign-out-btn"
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "inherit",
                  fontFamily: "inherit",
                  padding: "0.5rem 1rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        <div
          className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
