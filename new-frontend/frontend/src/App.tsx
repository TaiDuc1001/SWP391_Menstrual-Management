import React from 'react';
import AppRoutes from './routes';
import { UserProvider } from './contexts/UserContext';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './api/queryClient';
import './index.css';

const App: React.FC = () => {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </UserProvider>
  );
};

export default App;
