import {RouteConfig} from '../types/routes';
import {Navigate} from 'react-router-dom';

import Dashboard from '../pages/Customer/Dashboard';

import MenstrualCycles from '../pages/Customer/Cycle/MenstrualCycleDashboard';
import MenstrualCyclesAll from '../pages/Customer/Cycle/MenstrualCycleHistory';

import Appointments from '../pages/Customer/Appointment/Appointments';
import AppointmentDetail from '../pages/Customer/Appointment/AppointmentDetail';
import AppointmentBooking from '../pages/Customer/Appointment/AppointmentBooking';
import Checkout from '../pages/Customer/Appointment/Checkout';
import VNPayCheckout from '../pages/Customer/Appointment/VNPayCheckout';
import PaymentReturn from '../pages/Customer/Appointment/PaymentReturn';
import DoctorDetail from '../pages/Customer/Appointment/DoctorDetail';

import Examinations from '../pages/Customer/Examination/Examinations';
import ExaminationDetail from '../pages/Customer/Examination/ExaminationDetail';
import ExaminationBooking from '../pages/Customer/Examination/ExaminationBooking';
import VNPayExaminationCheckout from '../pages/Customer/Examination/VNPayExaminationCheckout';
import ExaminationPaymentReturn from '../pages/Customer/Examination/ExaminationPaymentReturn';
import Panels from '../pages/Customer/Examination/Panels';
import PanelDetail from '../pages/Customer/Examination/PanelDetail';

import MyProfile from '../pages/Customer/MyProfile';

export const customerPaths: RouteConfig[] = [
    {
        path: '/customer',
        element: <Navigate to="/customer/dashboard" replace/>,
        showInSidebar: false
    },

    {path: '/customer/dashboard', element: <Dashboard/>, label: 'Dashboard', iconName: 'FaHome', showInSidebar: true},

    {
        path: '/customer/menstrual-cycles',
        element: <MenstrualCycles/>,
        label: 'Menstrual Cycles',
        iconName: 'FaCalendarAlt',
        showInSidebar: true
    },
    {path: '/customer/menstrual-cycles/all', element: <MenstrualCyclesAll/>},

    {
        path: '/customer/appointments',
        element: <Appointments/>,
        label: 'Appointments',
        iconName: 'FaUserMd',
        showInSidebar: true
    },
    {path: '/customer/appointments/:id', element: <AppointmentDetail/>},
    {path: '/customer/appointments/book', element: <AppointmentBooking/>},
    {path: '/customer/checkout/:appointmentId', element: <Checkout/>},
    {path: '/customer/vnpay-checkout/:appointmentId', element: <VNPayCheckout/>},
    {path: '/customer/payment-return', element: <PaymentReturn/>},
    {path: '/customer/doctors/:id', element: <DoctorDetail/>},

    {
        path: '/customer/sti-tests',
        element: <Examinations/>,
        label: 'STI Tests',
        iconName: 'FaFlask',
        showInSidebar: true
    },    {path: '/customer/sti-tests/:id', element: <ExaminationDetail/>},
    {path: '/customer/sti-tests/packages', element: <Panels/>},
    {path: '/customer/sti-tests/packages/:id', element: <PanelDetail/>},
    {path: '/customer/sti-tests/book', element: <ExaminationBooking/>},
    {path: '/customer/vnpay-examination-checkout/:examinationId', element: <VNPayExaminationCheckout/>},
    {path: '/customer/examination-payment-return', element: <ExaminationPaymentReturn/>},

    {path: '/customer/profile', element: <MyProfile/>},
];
