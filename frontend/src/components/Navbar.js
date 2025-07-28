import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <Logo />
          </Link>
          <span className="navbar-title">TerpTrace</span>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/LostSomething" 
            className={`navbar-link ${isActive('/LostSomething') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Lost Something?
          </Link>
          <Link 
            to="/FoundSomething" 
            className={`navbar-link ${isActive('/FoundSomething') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Found Something?
          </Link>
          <Link 
            to="/HowItWorks" 
            className={`navbar-link ${isActive('/HowItWorks') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </Link>
        </div>

        <div 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
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