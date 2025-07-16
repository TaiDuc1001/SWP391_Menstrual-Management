import React from 'react';
import {RouteConfig} from '../types/routes';
import {Navigate} from 'react-router-dom';

import Dashboard from '../pages/Doctor/Dashboard';
import MyProfile from '../pages/Doctor/MyProfile';
import ManageProfile from '../pages/Doctor/ManageProfile';


import Appointments from '../pages/Doctor/Appointment/Appointments';
import DoctorRescheduleRequests from '../pages/Doctor/Reschedule/RescheduleRequests';

import DoctorProfileGuard from '../components/DoctorProfileGuard';
import DoctorRatingHistory from '../pages/Doctor/RatingHistory';

export const doctorPaths: RouteConfig[] = [

    {
        path: '/doctor',
        element: <Navigate to="/doctor/dashboard" replace/>,
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
        path: '/doctor/reschedule',
        element: <DoctorProfileGuard><DoctorRescheduleRequests/></DoctorProfileGuard>,
        label: 'Reschedule Requests',
        iconName: 'FaCalendarAlt',
        showInSidebar: true
    },
    {
        path: '/doctor/appointments/:id'
    },    {
        path: '/doctor/appointments/:id/customer'
    },
    {
        path: '/doctor/rating-history',
        element: <DoctorProfileGuard><DoctorRatingHistory/></DoctorProfileGuard>,
        label: 'Rating History',
        iconName: 'FaStar',
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

