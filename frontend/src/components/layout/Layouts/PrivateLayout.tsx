import React from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import {RouteConfig} from '../../../types/routes';

interface PrivateLayoutProps {
    children: React.ReactNode;
    routes?: RouteConfig[];
    showSidebar?: boolean;
    isAuthenticated: boolean;
    onAuthToggle: () => void;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = ({
                                                         children,
                                                         routes = [],
                                                         showSidebar = true,
                                                         isAuthenticated,
                                                         onAuthToggle
                                                     }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            <Header isAuthenticated={isAuthenticated} onAuthToggle={onAuthToggle}/>
            <div className="flex flex-1 min-h-0">
                {showSidebar && <Sidebar routes={routes}/>}
                <main
                    className={`flex-1 bg-white min-w-0 rounded-2xl shadow-md transition-all duration-300 m-5 ${showSidebar ? 'ml-[280px]' : ''}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;
