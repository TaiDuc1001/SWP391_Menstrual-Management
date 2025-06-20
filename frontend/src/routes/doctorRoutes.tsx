import React from 'react';
import {RouteConfig} from '../types/routes';
import {Navigate} from 'react-router-dom';

import Dashboard from '../pages/Doctor/Dashboard';
import MyProfile from '../pages/Doctor/MyProfile';
import Appointments from '../pages/Doctor/Appointment/Appointments';
import ConsultationSchedule from '../pages/Doctor/ConsultationSchedule';
import QuestionInbox from '../pages/Doctor/QuestionInbox';

export const doctorPaths: RouteConfig[] = [
    {
        path: '/doctor',
        element: <Navigate to="/doctor/dashboard" replace/>,
        showInSidebar: false
    },
    {
        path: '/doctor/dashboard',
        element: <Dashboard/>,
        label: 'Dashboard',
        iconName: 'FaHome',
        showInSidebar: true
    }, {
        path: '/doctor/appointments',
        element: <Appointments/>,
        label: 'Appointments',
        iconName: 'FaUserMd',
        showInSidebar: true
    },
    {
        path: '/doctor/appointments/:id'
    }, {
        path: '/doctor/appointments/:id/customer'
    },
    {
        path: '/doctor/consultation-schedule',
        element: <ConsultationSchedule/>,
        label: 'Consultation Schedule',
        iconName: 'FaCalendarAlt',
        showInSidebar: true
    },
    {
        path: '/doctor/question-inbox',
        element: <QuestionInbox/>,
        label: 'Question Inbox',
        iconName: 'FaEnvelope',
        showInSidebar: true
    },
    {
        path: '/doctor/profile',
        element: <MyProfile/>,
        label: 'My Profile',
        iconName: 'FaUser',
        showInSidebar: true
    },
];
