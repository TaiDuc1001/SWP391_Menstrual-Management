import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Sidebar/AdminSidebar";
import Footer from '../Footer/Footer';
import Dashboard from '../../../pages/Admin/Dashboard';
import Accounts from '../../../pages/Admin/Account/Accounts';
import TestPanels from '../../../pages/Admin/TestPanel/TestPanels';
import Blogs from '../../../pages/Admin/Blog/Blogs';
import Reports from '../../../pages/Admin/Statistic/Reports';
import Examinations from '../../../pages/Admin/Examination/Examinations';
import NotFound from '../../../pages/NotFound';

interface AdminLayoutProps {
    isAuthenticated: boolean;
    onAuthToggle: () => void;
}

const adminSidebarRoutes = [
    '/admin/dashboard',
    '/admin/users-management',
    '/admin/approve-results',
    '/admin/services-management',
    '/admin/content-management',
    '/admin/reports',
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ isAuthenticated, onAuthToggle }) => {
    const location = useLocation();

    const showSidebar = adminSidebarRoutes.some((route) =>
        location.pathname.startsWith(route)
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <AdminHeader isAuthenticated={isAuthenticated} onAuthToggle={onAuthToggle} />
            <div className="flex flex-1 min-h-0">
                {showSidebar && <AdminSidebar />}
                <main className={`flex-1 bg-white min-w-0 rounded-2xl shadow-md transition-all duration-300 m-5 ${showSidebar ? 'ml-[280px]' : ''}`}>
                    <Routes>

                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/users-management" element={<Accounts />} />
                        <Route path="/admin/services-management" element={<TestPanels />} />
                        <Route path="/admin/content-management" element={<Blogs />} />
                        <Route path="/admin/reports" element={<Reports />} />
                        <Route path="/admin/approve-results" element={<Examinations />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminLayout;
