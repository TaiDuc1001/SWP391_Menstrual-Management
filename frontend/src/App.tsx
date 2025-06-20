import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './components/layout/layouts/AppLayout';
import AdminLayout from './components/layout/layouts/AdminLayout';
import StaffLayout from './components/layout/layouts/StaffLayout';
import DoctorLayout from './components/layout/layouts/DoctorLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [role, setRole] = React.useState<string | null>(null);

  
  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole.toLowerCase());
    }
  }, []);

  const handleLogin = (userRole: string) => {
    const lowerRole = userRole.toLowerCase();
    setIsAuthenticated(true);
    setRole(lowerRole);
    localStorage.setItem('role', lowerRole);
  };

  const handleAuthToggle = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('role');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    setRole('customer');
    localStorage.setItem('role', 'customer');
  };

  return (
    <Router>
      {role === 'admin' && isAuthenticated ? (
        <AdminLayout isAuthenticated={isAuthenticated} onAuthToggle={handleAuthToggle} />
      ) : role === 'staff' && isAuthenticated ? (
        <StaffLayout isAuthenticated={isAuthenticated} onAuthToggle={handleAuthToggle} />
      ) : role === 'doctor' && isAuthenticated ? (
        <DoctorLayout isAuthenticated={isAuthenticated} onAuthToggle={handleAuthToggle} />
      ) : (
        <AppLayout
          isAuthenticated={isAuthenticated}
          onAuthToggle={handleAuthToggle}
          handleLogin={handleLogin}
          handleSignUp={handleSignUp}
        />
      )}
    </Router>
  );
}

export default App;
