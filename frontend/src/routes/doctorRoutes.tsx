import React from 'react';
import {RouteConfig} from '../types/routes';
import {Navigate} from 'react-router-dom';

import Dashboard from '../pages/Doctor/Dashboard';
import MyProfile from '../pages/Doctor/MyProfile';
import ManageProfile from '../pages/Doctor/ManageProfile';
import SetupProfile from '../pages/Doctor/SetupProfile';
import Appointments from '../pages/Doctor/Appointment/Appointments';
import ConsultationSchedule from '../pages/Doctor/ConsultationSchedule';
import QuestionInbox from '../pages/Doctor/QuestionInbox';
import DoctorProfileGuard from '../components/DoctorProfileGuard';

export const doctorPaths: RouteConfig[] = [
    {
        path: '/doctor',
        element: <Navigate to="/doctor/dashboard" replace/>,
        showInSidebar: false
    },
    {
        path: '/doctor/setup-profile',
        element: <SetupProfile/>,
        showInSidebar: false
    },
    {
        path: '/doctor/manage-profile',
        element: <ManageProfile/>,
        showInSidebar: false
    },
    {
        path: '/doctor/dashboard',
        element: <DoctorProfileGuard><Dashboard/></DoctorProfileGuard>,
        label: 'Dashboard',
        iconName: 'FaHome',
        showInSidebar: true
    }, {
        path: '/doctor/appointments',
        element: <DoctorProfileGuard><Appointments/></DoctorProfileGuard>,
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
        element: <DoctorProfileGuard><ConsultationSchedule/></DoctorProfileGuard>,
        label: 'Consultation Schedule',
        iconName: 'FaCalendarAlt',
        showInSidebar: true
    },
    {
        path: '/doctor/question-inbox',
        element: <DoctorProfileGuard><QuestionInbox/></DoctorProfileGuard>,
        label: 'Question Inbox',
        iconName: 'FaEnvelope',
        showInSidebar: true
    },
    {
        path: '/doctor/profile',
        element: <DoctorProfileGuard><MyProfile/></DoctorProfileGuard>,
        label: 'My Profile',
        iconName: 'FaUser',
        showInSidebar: true
    },
];
