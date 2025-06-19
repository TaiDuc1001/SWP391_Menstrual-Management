import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/feature/home.css';

const Home: React.FC = () => (
  <div className="home-container">
    <h1 className="home-title">Welcome to the Home Page</h1>
    <p className="home-desc">This is the main landing page of the application.</p>
    <Link
      to="/login"
      className="home-login-btn"
    >
      Login
    </Link>
  </div>
);

export default Home;