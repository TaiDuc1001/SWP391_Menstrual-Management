import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import Dashboard from '../pages/Customer/Dashboard';
import MenstrualCycles from '../pages/Customer/MenstrualCycles';
import Appointments from '../pages/Customer/Appointments';
import STITests from '../pages/Customer/STITests';
import Profile from '../pages/Customer/Profile';
import Home from '../pages/Public/Home';
import AboutUs from '../pages/Public/AboutUs';
import Blogs from '../pages/Public/Blogs';
import Login from '../pages/Public/Login';
import SignUp from '../pages/Public/SignUp';
import NotFound from '../pages/Public/NotFound';
import RequireLogin from '../pages/Public/RequireLogin';
import STIPackages from '../pages/Customer/STIPackages';

interface AppLayoutProps {
  isAuthenticated: boolean;
  onAuthToggle: () => void;
  handleLogin: () => void;
  handleSignUp: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ isAuthenticated, onAuthToggle, handleLogin, handleSignUp }) => {
  const location = useLocation();
  const sidebarRoutes = [
    '/dashboard',
    '/menstrual-cycles',
    '/appointments',
    '/sti-tests',
    '/sti-tests/packages',
    '/profile',
  ];
  const isProtectedRoute = sidebarRoutes.some((route) => location.pathname.startsWith(route));
  const showSidebar = isAuthenticated && isProtectedRoute && !location.pathname.startsWith('/login-required');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header isAuthenticated={isAuthenticated} onAuthToggle={onAuthToggle} />
      <div className="flex flex-1 min-h-0">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 bg-white min-w-0 rounded-2xl shadow-md transition-all duration-300 m-5 ${showSidebar ? 'ml-[280px]' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
            {/* Protected routes */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <RequireLogin />} />
            <Route path="/menstrual-cycles" element={isAuthenticated ? <MenstrualCycles /> : <RequireLogin />} />
            <Route path="/appointments" element={isAuthenticated ? <Appointments /> : <RequireLogin />} />
            <Route path="/sti-tests" element={isAuthenticated ? <STITests /> : <RequireLogin />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <RequireLogin />} />
            <Route path="/sti-tests/packages" element={<STIPackages />} />
            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
