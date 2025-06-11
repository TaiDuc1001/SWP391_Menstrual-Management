import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import AdminLayout from "./layouts/AdminLayout";
import StaffLayout from './layouts/StaffLayout';
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

        {/*chưa chia role*/}

      {/* <AdminLayout
        isAuthenticated={isAuthenticated}
        onAuthToggle={handleAuthToggle}
      /> */}
      {/* <StaffLayout
        isAuthenticated={isAuthenticated}
        onAuthToggle={handleAuthToggle}
      /> */}
    </Router>
  );
}

export default App;
