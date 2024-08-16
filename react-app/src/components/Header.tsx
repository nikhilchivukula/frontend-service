import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="branding">
          <h1>VT SEVA</h1>
          <p>Volunteering together for service</p>
          <p>A USA based non-profit 501(c)3 organization with 25+ centers across cities</p>
        </div>
        <div className="header-buttons">
          <button className="donate-button">Donate Now</button>
          <button className="events-button">Events</button>
        </div>
      </div>
      <nav className="nav-bar">
        <Link to="/">HOME</Link>
        <Link to="/impact">Impact</Link>
        <Link to="/locations">Locations</Link>
        <Link to="/signup">SignUp</Link>
        <Link to="/pvsa">PVSA</Link>
        <Link to="/articles">Articles</Link>
        <Link to="/other">Other</Link>
        <Link to="/aboutus">AboutUs</Link>
        <Link to="/events">Events</Link>
      </nav>
    </header>
  );
};

export default Header;
