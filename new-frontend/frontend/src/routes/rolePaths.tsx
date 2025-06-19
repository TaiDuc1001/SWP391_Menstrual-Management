import { FaHome } from 'react-icons/fa';


import Home from '../pages/Home.tsx';
import AboutUs from '../pages/AboutUs.tsx';
import Services from '../pages/Services.tsx';
import Blogs from '../pages/Blogs.tsx';
import ContactUs from '../pages/ContactUs.tsx';

import BlogDetail from '../pages/BlogDetail.tsx';
import NotFound from '../pages/NotFound.tsx';

export const publicPaths = [
  { path: '/', element: <Home />, showInNavbar: true },
  { path: '/about-us', element: <AboutUs />, showInNavbar: true },
  { path: '/services', element: <Services />, showInNavbar: true },
  { path: '/blog', element: <Blogs />, showInNavbar: true },
  { path: '/contact-us', element: <ContactUs />, showInNavbar: true },

  { path: '/blog/:id', element: <BlogDetail />, showInNavbar: false },
  { path: '/not-found', element: <NotFound />, showInNavbar: false },
  { path: '/*', element: <NotFound />, showInNavbar: false },
];

import Login from '../pages/Guest/Login.tsx';
import Register from '../pages/Guest/Register.tsx';
import ForgotPassword from '../pages/Guest/ForgotPassword.tsx';

export const guestPaths = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
];

import CustomerDashboard from '../pages/Customer/Dashboard';
import CustomerMenstrualCycles from '../pages/Customer/MenstrualCycle/MenstrualCycleDashboard.tsx';
import CustomerAppointments from '../pages/Customer/Appointment/Appointments.tsx';
import CustomerExaminations from '../pages/Customer/Examination/Examinations.tsx';

import CustomerMenstrualCycleHistory from '../pages/Customer/MenstrualCycle/MenstrualCycleHistory.tsx';
import CustomerMenstrualCycleNew from '../pages/Customer/MenstrualCycle/MenstrualCycleNew.tsx';
import CustomerAppointmentDetail from '../pages/Customer/Appointment/AppointmentDetail.tsx';
import CustomerAppointmentBooking from '../pages/Customer/Appointment/AppointmentBooking.tsx';
import CustomerDoctors from '../pages/Customer/Appointment/Doctors.tsx';
import CustomerDoctorDetail from '../pages/Customer/Appointment/DoctorDetail.tsx';
import CustomerExaminationDetail from '../pages/Customer/Examination/ExaminationDetail.tsx';
import CustomerExaminationBooking from '../pages/Customer/Examination/ExaminationBooking.tsx';
import CustomerCheckout from '../pages/Customer/Checkout.tsx';
import CustomerResultDetail from '../pages/Customer/Examination/ResultDetail.tsx';
import CustomerStaffDetail from '../pages/Customer/Examination/StaffDetail.tsx';
import CustomerPanels from '../pages/Customer/Examination/TestPanels.tsx';
import CustomerPanelDetail from '../pages/Customer/Examination/TestPanelDetail.tsx';
import CustomerMyProfile from '../pages/Customer/MyProfile.tsx';

export const customerPaths = [
  { path: '/', label: 'Dashboard', icon: <FaHome />, element: <CustomerDashboard />, showInSidebar: true },
  { path: '/dashboard', element: <CustomerDashboard /> },

  { path: '/cycle', label: 'Menstrual Cycles', icon: <FaHome />, element: <CustomerMenstrualCycles />, showInSidebar: true },
  { path: '/cycles', element: <CustomerMenstrualCycleHistory /> },
  { path: '/cycle/new', element: <CustomerMenstrualCycleNew /> },

  { path: '/appointment', label: 'Appointments', icon: <FaHome />, element: <CustomerAppointments />, showInSidebar: true },
  { path: '/appointment/new', element: <CustomerAppointmentBooking /> },
  { path: '/appointment/new/checkout', element: <CustomerCheckout /> },
  { path: '/appointment/:id', element: <CustomerAppointmentDetail /> },
  { path: '/doctor', element: <CustomerDoctors /> },
  { path: '/doctor/:id', element: <CustomerDoctorDetail /> },

  { path: '/examination', label: 'Examinations', icon: <FaHome />, element: <CustomerExaminations />, showInSidebar: true },
  { path: '/examination/new', element: <CustomerExaminationBooking /> },
  { path: '/examination/new/checkout', element: <CustomerCheckout /> },
  { path: '/examination/:id', element: <CustomerExaminationDetail /> },
  { path: '/examination/:id/result', element: <CustomerResultDetail /> },
  { path: '/examination/:id/staff', element: <CustomerStaffDetail /> },
  { path: '/panel', element: <CustomerPanels /> },
  { path: '/panel/:id', element: <CustomerPanelDetail /> },

  { path: '/my-profile', element: <CustomerMyProfile /> },
];

import StaffDashboard from '../pages/Staff/Dashboard.tsx';
import StaffExaminations from '../pages/Staff/Examination/Examinations.tsx';
import StaffExaminationDetail from '../pages/Staff/Examination/ExaminationDetail.tsx';
import StaffMyProfile from '../pages/Staff/MyProfile.tsx';

export const staffPaths = [
  { path: '/', label: 'Dashboard', icon: <FaHome />, element: <StaffDashboard />, showInSidebar: true },
  { path: '/dashboard', element: <StaffDashboard /> },

  { path: '/examination', label: 'Examinations', icon: <FaHome />, element: <StaffExaminations />, showInSidebar: true },
  { path: '/examination/:id', element: <StaffExaminationDetail /> },
  
  { path: '/my-profile', element: <StaffMyProfile /> },
];

import DoctorDashboard from '../pages/Doctor/Dashboard.tsx';
import DoctorAppointments from '../pages/Doctor/Appointment/Appointments.tsx';
import DoctorAppointmentDetail from '../pages/Doctor/Appointment/AppointmentDetail.tsx';
import DoctorCustomerProfile from '../pages/Doctor/Appointment/CustomerProfile.tsx';
import DoctorMyProfile from '../pages/Doctor/MyProfile.tsx';

export const doctorPaths = [
  { path: '/', label: 'Dashboard', icon: <FaHome />, element: <DoctorDashboard />, showInSidebar: true },
  { path: '/dashboard', element: <DoctorDashboard /> },

  { path: '/appointment', label: 'Appointments', icon: <FaHome />, element: <DoctorAppointments />, showInSidebar: true },
  { path: '/appointment/:id', element: <DoctorAppointmentDetail /> },
  { path: '/appointment/:id/customer', element: <DoctorCustomerProfile /> },
  
  { path: '/my-profile', element: <DoctorMyProfile /> },
];


import AdminDashboard from '../pages/Admin/Dashboard.tsx';
import AdminAccounts from '../pages/Admin/Account/Accounts.tsx';
import AdminAppointments from '../pages/Admin/Appointment/Appointments.tsx';
import AdminExaminations from '../pages/Admin/Examination/Examinations.tsx';
import AdminBlogs from '../pages/Admin/Blog/Blogs.tsx';
import AdminPanels from '../pages/Admin/TestPanel/TestPanels.tsx';

import AdminCustomerDetail from '../pages/Admin/Account/RoleDetail/CustomerDetail.tsx';
import AdminDoctorDetail from '../pages/Admin/Account/RoleDetail/DoctorDetail.tsx';
import AdminStaffDetail from '../pages/Admin/Account/RoleDetail/StaffDetail.tsx';
import AdminAppointmentDetail from '../pages/Admin/Appointment/AppointmentDetail.tsx';
import AdminBlogDetail from '../pages/Admin/Blog/BlogDetail.tsx';
import AdminExaminationDetail from '../pages/Admin/Examination/ExaminationDetail.tsx';
import AdminResultDetail from '../pages/Admin/Examination/ResultDetail.tsx';
import AdminPanelDetail from '../pages/Admin/TestPanel/TestPanelDetail.tsx';

export const adminPaths = [
  { path: '/', label: 'Dashboard', icon: <FaHome />, element: <AdminDashboard />, showInSidebar: true },
  { path: '/dashboard', element: <AdminDashboard /> },

  { path: '/account', label: 'Accounts', icon: <FaHome />, element: <AdminAccounts />, showInSidebar: true },
  { path: '/account/customer/:id', element: <AdminCustomerDetail /> },
  { path: '/account/doctor/:id', element: <AdminDoctorDetail /> },
  { path: '/account/staff/:id', element: <AdminStaffDetail /> },

  { path: '/appointment', label: 'Appointments', icon: <FaHome />, element: <AdminAppointments />, showInSidebar: true },
  { path: '/appointment/:id', element: <AdminAppointmentDetail /> },

  { path: '/examination', label: 'Examinations', icon: <FaHome />, element: <AdminExaminations />, showInSidebar: true },
  { path: '/examination/:id', element: <AdminExaminationDetail /> },
  { path: '/examination/:id/result', element: <AdminResultDetail /> },

  { path: '/blog', label: 'Blogs', icon: <FaHome />, element: <AdminBlogs />, showInSidebar: true },
  { path: '/blog/:id', element: <AdminBlogDetail /> },

  { path: '/panel', label: 'Test Panels', icon: <FaHome />, element: <AdminPanels />, showInSidebar: true },
  { path: '/panel/:id', element: <AdminPanelDetail /> },
];