import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../Header/PublicHeader';
import Footer from '../Footer';

const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col">
    <PublicHeader />
    <main className="flex-1 flex justify-center items-start p-6">
      <div>
        <Outlet />
      </div>
    </main>
    <Footer />
  </div>
);

export default PublicLayout;