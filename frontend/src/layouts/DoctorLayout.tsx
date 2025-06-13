import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminHeader from "../components/Header/AdminHeader";
import DoctorSidebar from "../components/Sidebar/DoctorSidebar";
import Footer from '../components/Footer/Footer';
import DoctorDashboard from '../pages/Doctor/Dashboard';
import ScheduleConsultation from '../pages/Doctor/ConsultationSchedule';
import OnlineConsultation from '../pages/Doctor/OnlineConsultation';
import QuestionInbox from '../pages/Doctor/QuestionInbox';
import PersonalProfile from '../pages/Doctor/PersonalProfile';

import NotFound from '../pages/Public/NotFound';

interface DoctorLayoutProps {
    isAuthenticated: boolean;
    onAuthToggle: () => void;
}

const doctorSidebarRoutes = [
    '/doctor/dashboard',
    '/doctor/consultation-schedule',
    '/doctor/online-consultation',
    '/doctor/question-inbox',
    '/doctor/personal-profile',
];

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ isAuthenticated, onAuthToggle }) => {
    const location = useLocation();

    const showSidebar = doctorSidebarRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <AdminHeader isAuthenticated={isAuthenticated} onAuthToggle={onAuthToggle} />
            <div className="flex flex-1 min-h-0">
                {showSidebar && <DoctorSidebar />}
                <main className={`flex-1 bg-white min-w-0 rounded-2xl shadow-md transition-all duration-300 m-5 ${showSidebar ? 'ml-[280px]' : ''}`}>
                    <Routes>

                        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                        <Route path="/doctor/consultation-schedule" element={<ScheduleConsultation />} />
                        <Route path="/doctor/online-consultation" element={<OnlineConsultation />} />
                        <Route path="/doctor/question-inbox" element={<QuestionInbox />} />
                        <Route path="/doctor/personal-profile" element={<PersonalProfile />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default DoctorLayout;
