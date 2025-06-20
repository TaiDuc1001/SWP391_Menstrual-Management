import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminHeader from "../Header/AdminHeader";
import StaffSidebar from "../Sidebar/StaffSidebar";
import Footer from '../Footer/Footer';
import StaffDashboard from '../../../pages/Staff/StaffDashboard';
import CustomerSupport from '../../../pages/Staff/CustomerSupport';
import ScheduleConsultation from '../../../pages/Staff/ScheduleConsultation';
import UpdateTestResult from '../../../pages/Staff/UpdateTestResult';
import NotFound from '../../../pages/NotFound';

interface StaffLayoutProps {
    isAuthenticated: boolean;
    onAuthToggle: () => void;
}

const staffSidebarRoutes = [
    '/staff/dashboard',
    '/staff/customers-support',
    '/staff/schedule-consultations',
    '/staff/update-test-results',
];

const StaffLayout: React.FC<StaffLayoutProps> = ({ isAuthenticated, onAuthToggle }) => {
    const location = useLocation();

    const showSidebar = staffSidebarRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <AdminHeader isAuthenticated={isAuthenticated} onAuthToggle={onAuthToggle} />
            <div className="flex flex-1 min-h-0">
                {showSidebar && <StaffSidebar />}
                <main className={`flex-1 bg-white min-w-0 rounded-2xl shadow-md transition-all duration-300 m-5 ${showSidebar ? 'ml-[280px]' : ''}`}>
                    <Routes>

                        <Route path="/staff/dashboard" element={<StaffDashboard />} />
                        <Route path="/staff/customers-support" element={<CustomerSupport />} />
                        <Route path="/staff/schedule-consultations" element={<ScheduleConsultation />} />
                        <Route path="/staff/update-test-results" element={<UpdateTestResult />} />
                        
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default StaffLayout;
