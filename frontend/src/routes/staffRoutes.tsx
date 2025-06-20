import React from 'react';
import { RouteConfig } from '../types/routes';
import { Navigate } from 'react-router-dom';

import Dashboard from '../pages/Staff/Dashboard';
import UpdateTestResult from '../pages/Staff/Examination/UpdateTestResult';
import CustomerSupport from '../pages/Staff/CustomerSupport';
import ScheduleConsultation from '../pages/Staff/ScheduleConsultation';
import MyProfile from '../pages/Staff/MyProfile';

export const staffPaths: RouteConfig[] = [  { 
    path: '/staff', 
    element: <Navigate to="/staff/dashboard" replace />,
    showInSidebar: false 
  },
  { 
    path: '/staff/dashboard', 
    element: <Dashboard />,
    label: 'Dashboard', 
    iconName: 'FaHome', 
    showInSidebar: true 
  },  { 
    path: '/staff/examinations', 
    element: <UpdateTestResult />,
    label: 'Examinations', 
    iconName: 'FaFlask', 
    showInSidebar: true 
  },  { 
    path: '/staff/examinations/:id'
  },
  { 
    path: '/staff/customer-support', 
    element: <CustomerSupport />,
    label: 'Customer Support', 
    iconName: 'FaHeadset', 
    showInSidebar: true 
  },
  { 
    path: '/staff/schedule-consultation', 
    element: <ScheduleConsultation />,
    label: 'Schedule Consultation', 
    iconName: 'FaCalendarPlus', 
    showInSidebar: true 
  },  {    path: '/staff/profile', 
    element: <MyProfile />,
    label: 'My Profile', 
    iconName: 'FaUser', 
    showInSidebar: true 
  },
];
