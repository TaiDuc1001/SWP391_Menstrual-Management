import React from 'react';
import {RouteConfig} from '../types/routes';
import {Navigate} from 'react-router-dom';
import Dashboard from '../pages/Admin/Dashboard';
import Accounts from '../pages/Admin/Account/Accounts';
import Blogs from '../pages/Admin/Blog/Blogs';
import Examinations from '../pages/Admin/Examination/Examinations';
import TestPanels from '../pages/Admin/TestPanel/TestPanels';
import Reports from '../pages/Admin/Statistic/Reports';

export const adminPaths: RouteConfig[] = [
    {
        path: '/admin',
        element: <Navigate to="/admin/dashboard" replace/>,
        showInSidebar: false
    },
    {
        path: '/admin/dashboard',
        element: <Dashboard/>,
        label: 'Dashboard',
        iconName: 'FaHome',
        showInSidebar: true
    }, 
    {
        path: '/admin/accounts',
        element: <Accounts/>,
        label: 'Accounts',
        iconName: 'FaUsers',
        showInSidebar: true
    },
    {
        path: '/admin/examinations',
        element: <Examinations/>,
        label: 'Examinations',
        iconName: 'FaClipboard',
        showInSidebar: true
    },
    {
        path: '/admin/blogs',
        element: <Blogs/>,
        label: 'Blogs',
        iconName: 'FaBlog',
        showInSidebar: true
    },
    {
        path: '/admin/panels',
        element: <TestPanels/>,
        label: 'Test Panels',
        iconName: 'FaFlask',
        showInSidebar: true
    },
    {
        path: '/admin/reports',
        element: <Reports/>,
        label: 'Reports',
        iconName: 'FaChartBar',
        showInSidebar: true
    },
];
