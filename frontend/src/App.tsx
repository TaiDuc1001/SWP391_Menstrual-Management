import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const handleAuthToggle = () => setIsAuthenticated((prev) => !prev);
  const handleLogin = () => setIsAuthenticated(true);
  const handleSignUp = () => setIsAuthenticated(true);

  return (
    <Router>
      <AppLayout
        isAuthenticated={isAuthenticated}
        onAuthToggle={handleAuthToggle}
        handleLogin={handleLogin}
        handleSignUp={handleSignUp}
      />
    </Router>
  );
}

export default App;
