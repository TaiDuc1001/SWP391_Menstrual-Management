import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PrivateHeader from '../Header/PrivateHeader';
import Sidebar from '../Sidebar';
import Footer from '../Footer';

const PrivateLayout: React.FC = () => {
  const location = useLocation();
  const hideSidebar = /\/my-profile$/.test(location.pathname);
  return (
    <div className="min-h-screen flex flex-col">
      <PrivateHeader />
      <div className="flex flex-1 items-start">
        {!hideSidebar && <Sidebar />}
        <main className="flex-1 flex justify-center items-start p-6">
          <div >
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default PrivateLayout;