import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminHeader from "../components/Header/AdminHeader";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import Footer from '../components/Footer/Footer';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import UserManagement from '../pages/Admin/UserManagement';
import ServiceManagement from '../pages/Admin/ServiceManagement';
import ContentManagement from '../pages/Admin/ContentManagement';
import ApproveResult from '../pages/Admin/ApproveResult';
import NotFound from '../pages/Public/NotFound';

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

                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users-management" element={<UserManagement />} />
                        <Route path="/admin/services-management" element={<ServiceManagement />} />
                        <Route path="/admin/content-management" element={<ContentManagement />} />
                        <Route path="/admin/reports" element={<ContentManagement />} />
                        <Route path="/admin/approve-results" element={<ApproveResult />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default AdminLayout;
