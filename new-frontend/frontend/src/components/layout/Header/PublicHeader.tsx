import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicPaths } from '../../../routes/rolePaths';
import { Button } from '../../common/Button/Button';

const PublicHeader: React.FC = () => {
  const location = useLocation();
  return (
    <header className="public-header">
      <div className="public-header-logo">
        <img src="./logo.svg" alt="Logo" className="public-logo-img" />
      </div>
      <nav className="public-navbar">
        {publicPaths.filter(p => p.showInNavbar).map(({ path }) => (
          <Link
            key={path}
            to={path}
            className={`public-navbar-link${location.pathname === path ? ' active' : ''}`}
          >
            {path === '/'
              ? 'Home'
              : path
                  .replace('/', '')
                  .replace('-', ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
        ))}
      </nav>
      <div className="public-header-actions">
        <Link to="/login">
          <Button variant="primary" className="public-login-btn">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="outline" className="public-register-btn">Register</Button>
        </Link>
      </div>
    </header>
  );
};

export default PublicHeader;