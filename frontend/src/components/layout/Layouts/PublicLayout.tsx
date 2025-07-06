import React from 'react';
import PublicHeader from '../Header/PublicHeader';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({children}) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div className="shadow-lg rounded-b-3xl overflow-hidden">
                <PublicHeader/>
            </div>
            <main className="flex-1 w-full">
                {children}
            </main>
        </div>
    );
};

export default PublicLayout;
