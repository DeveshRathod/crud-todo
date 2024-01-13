import React from "react";
import { Link } from "react-router-dom";
// Import your CSS file for Navbar styles

const Header = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
