import React from 'react';
import { RouteConfig } from '../types/routes';

import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import Services from '../pages/Services';
import Blogs from '../pages/Blogs';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

export const publicPaths: RouteConfig[] = [
  { path: '/', element: <Home />, label: 'Home', iconName: 'FaHome', showInNavbar: true },
  { path: '/about-us', element: <AboutUs />, label: 'About Us', iconName: 'FaInfoCircle', showInNavbar: true },
  { path: '/services', element: <Services />, label: 'Services', iconName: 'FaCogs', showInNavbar: true },
  { path: '/blogs', element: <Blogs />, label: 'Blogs', iconName: 'FaBlog', showInNavbar: true },
  { path: '/contact', element: <Contact />, label: 'Contact', iconName: 'FaEnvelope', showInNavbar: true },
  { path: '*', element: <NotFound />, showInNavbar: false },
];
