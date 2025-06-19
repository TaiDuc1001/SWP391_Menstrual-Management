import React from 'react';
import { useUser } from '../contexts/UserContext';
import PublicHeader from '../components/layout/Header/PublicHeader';
import Footer from '../components/layout/Footer';
import NotFound from '../pages/NotFound.tsx';

const RequireRole = ({ role, children }: { role: string, children: React.ReactNode }) => {
  const { user } = useUser();
  if (!user || user.role !== role) {
    return (
      <>
        <PublicHeader />
        <main>
          <NotFound />
        </main>
        <Footer />
      </>
    );
  }
  return <>{children}</>;
};

export default RequireRole;
