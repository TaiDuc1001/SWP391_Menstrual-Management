import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import Dashboard from '../../../pages/Customer/Dashboard';
import MenstrualCycles from '../../../pages/Customer/MenstrualCycles';
import MenstrualCyclesAll from '../../../pages/Customer/MenstrualCyclesAll';
import Appointments from '../../../pages/Customer/Appointments';
import STITests from '../../../pages/Customer/STITests';
import Profile from '../../../pages/Customer/Profile';
import Home from '../../../pages/Home';
import AboutUs from '../../../pages/AboutUs';
import Blogs from '../../../pages/Blogs';
import Login from '../../../pages/Guest/Login';
import SignUp from '../../../pages/Guest/SignUp';
import NotFound from '../../../pages/NotFound';
import RequireLogin from '../../../pages/Guest/RequireLogin';
import STIPackages from '../../../pages/Customer/STIPackages';
import STIPackageDetail from '../../../pages/Customer/STIPackageDetail';
import BookTestPage from '../../../pages/Customer/BookTestPage';
import BookAppointmentPage from '../../../pages/Customer/BookAppointmentPage';
import CheckoutPage from '../../../pages/Customer/CheckoutPage';
import DoctorDetailPage from '../../../pages/Customer/DoctorDetailPage';
import ForgotPassword from '../../../pages/Guest/ForgotPassword';
import EnterOTP from '../../../pages/Guest/EnterOTP';
import ChangePassword from '../../../pages/Guest/ChangePassword';
import Contact from '../../../pages/Contact';
import Services from '../../../pages/Services';
import PublicLayout from './PublicLayout';

interface AppLayoutProps {
  isAuthenticated: boolean;
  onAuthToggle: () => void;
  handleLogin: (role: string) => void;
  handleSignUp: () => void;
}


const AppLayout: React.FC<AppLayoutProps> = ({ isAuthenticated, onAuthToggle, handleLogin, handleSignUp }) => {
  const location = useLocation();  const sidebarRoutes = [
    '/dashboard',
    '/menstrual-cycles',
    '/appointments',
    '/checkout',
    '/sti-tests',
    '/sti-tests/packages',
    '/doctors',
    '/profile',
  ];
  const isProtectedRoute = sidebarRoutes.some((route) => location.pathname.startsWith(route));
  const showSidebar = isAuthenticated && isProtectedRoute && !location.pathname.startsWith('/login-required');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Only show main Header/Sidebar for protected routes, otherwise use PublicLayout */}
      {isProtectedRoute ? (
        <>
          <Header isAuthenticated={isAuthenticated} onAuthToggle={onAuthToggle} />
          <div className="flex flex-1 min-h-0">
            {showSidebar && <Sidebar />}
            <main className={`flex-1 bg-white min-w-0 rounded-2xl shadow-md transition-all duration-300 m-5 ${showSidebar ? 'ml-[280px]' : ''}`}>
              <Routes>
                {/* Protected routes */}
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <RequireLogin />} />
                <Route path="/menstrual-cycles" element={isAuthenticated ? <MenstrualCycles /> : <RequireLogin />} />
                <Route path="/menstrual-cycles/all" element={<MenstrualCyclesAll />} />
                <Route path="/appointments" element={isAuthenticated ? <Appointments /> : <RequireLogin />} />
                <Route path="/sti-tests" element={isAuthenticated ? <STITests /> : <RequireLogin />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <RequireLogin />} />
                <Route path="/sti-tests/packages" element={<STIPackages />} />
                <Route path="/sti-tests/packages/:id" element={<STIPackageDetail />} />
                <Route path="/sti-tests/book" element={<BookTestPage />} />                <Route path="/appointments/book" element={<BookAppointmentPage />} />
                <Route path="/checkout/:appointmentId" element={<CheckoutPage />} />
                <Route path="/doctors/:id" element={<DoctorDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <PublicLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/enter-otp" element={<EnterOTP />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PublicLayout>
      )}
      <Footer />
    </div>
  );
};

export default AppLayout;
