import React from 'react';
import type { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../components/layout/Layout/PublicLayout';
import PrivateLayout from '../components/layout/Layout/PrivateLayout';
import RequireRole from './requireRole.tsx';
import { publicPaths, guestPaths, adminPaths, customerPaths, doctorPaths, staffPaths } from './rolePaths';

// Define a type for route objects
interface AppRoute {
  path: string;
  element: ReactElement;
  [key: string]: any;
}

// Helper to render route arrays
const renderRoutes = (routes: AppRoute[], basePath = '') =>
  routes.map((route: AppRoute) => (
    <Route
      key={basePath + route.path}
      path={basePath + route.path}
      element={route.element}
    />
  ));

const roleRoutes = [
  {
    role: 'admin',
    options: adminPaths,
  },
  {
    role: 'customer',
    options: customerPaths,
  },
  {
    role: 'doctor',
    options: doctorPaths,
  },
  {
    role: 'staff',
    options: staffPaths,
  },
];

const AppRoutes: React.FC = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      {renderRoutes(publicPaths)}
      {renderRoutes(guestPaths)}
    </Route>
    {roleRoutes.map(({ role, options }) => (
      <Route
        key={role}
        element={
          <RequireRole role={role}>
            <PrivateLayout />
          </RequireRole>
        }
      >
        {renderRoutes(options, `/${role}`)}
      </Route>
    ))}
  </Routes>
);

export default AppRoutes;
