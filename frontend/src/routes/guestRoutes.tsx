import React from 'react';
import {RouteConfig} from '../types/routes';

import ForgotPassword from '../pages/Guest/ForgotPassword';
import EnterOTP from '../pages/Guest/EnterOTP';
import ChangePassword from '../pages/Guest/ChangePassword';

export const guestPaths: RouteConfig[] = [
    {path: '/forgot-password', element: <ForgotPassword/>, label: 'Forgot Password', iconName: 'FaKey'},
    {path: '/enter-otp', element: <EnterOTP/>},
    {path: '/change-password', element: <ChangePassword/>},
];

