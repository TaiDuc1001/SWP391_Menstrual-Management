import {RouteConfig} from '../types/routes';
import {Navigate} from 'react-router-dom';
import ProfileGuard from '../components/ProfileGuard';

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
import CompleteProfile from '../pages/Customer/CompleteProfile';

export const customerPaths: RouteConfig[] = [
    {
        path: '/customer',
        element: <Navigate to="/customer/dashboard" replace/>,
        showInSidebar: false
    },

    {path: '/customer/dashboard', element: <ProfileGuard><Dashboard/></ProfileGuard>, label: 'Dashboard', iconName: 'FaHome', showInSidebar: true},

    {
        path: '/customer/menstrual-cycles',
        element: <ProfileGuard><MenstrualCycles/></ProfileGuard>,
        label: 'Menstrual Cycles',
        iconName: 'FaCalendarAlt',
        showInSidebar: true
    },
    {path: '/customer/menstrual-cycles/all', element: <ProfileGuard><MenstrualCyclesAll/></ProfileGuard>},

    {
        path: '/customer/appointments',
        element: <ProfileGuard><Appointments/></ProfileGuard>,
        label: 'Appointments',
        iconName: 'FaUserMd',
        showInSidebar: true
    },
    {path: '/customer/appointments/:id', element: <ProfileGuard><AppointmentDetail/></ProfileGuard>},
    {path: '/customer/appointments/book', element: <ProfileGuard><AppointmentBooking/></ProfileGuard>},
    {path: '/customer/checkout/:appointmentId', element: <ProfileGuard><Checkout/></ProfileGuard>},
    {path: '/customer/vnpay-checkout/:appointmentId', element: <ProfileGuard><VNPayCheckout/></ProfileGuard>},
    {path: '/customer/payment-return', element: <ProfileGuard><PaymentReturn/></ProfileGuard>},
    {path: '/customer/doctors/:id', element: <ProfileGuard><DoctorDetail/></ProfileGuard>},

    {
        path: '/customer/sti-tests',
        element: <ProfileGuard><Examinations/></ProfileGuard>,
        label: 'STI Tests',
        iconName: 'FaFlask',
        showInSidebar: true
    },    {path: '/customer/sti-tests/:id', element: <ProfileGuard><ExaminationDetail/></ProfileGuard>},
    {path: '/customer/sti-tests/packages', element: <ProfileGuard><Panels/></ProfileGuard>},
    {path: '/customer/sti-tests/packages/:id', element: <ProfileGuard><PanelDetail/></ProfileGuard>},
    {path: '/customer/sti-tests/book', element: <ProfileGuard><ExaminationBooking/></ProfileGuard>},
    {path: '/customer/vnpay-examination-checkout/:examinationId', element: <ProfileGuard><VNPayExaminationCheckout/></ProfileGuard>},
    {path: '/customer/examination-payment-return', element: <ProfileGuard><ExaminationPaymentReturn/></ProfileGuard>},

    {path: '/customer/profile', element: <ProfileGuard><MyProfile/></ProfileGuard>},
    {path: '/customer/complete-profile', element: <CompleteProfile/>, showInSidebar: false},
];
