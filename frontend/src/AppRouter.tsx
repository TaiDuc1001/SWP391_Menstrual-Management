import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import PublicLayout from './components/layout/Layouts/PublicLayout';
import PrivateLayout from './components/layout/Layouts/PrivateLayout';
import Footer from './components/layout/Footer/Footer';
import RequireLogin from './pages/Guest/RequireLogin';
import Login from './pages/Guest/Login';
import SignUp from './pages/Guest/SignUp';
import {adminPaths, customerPaths, doctorPaths, guestPaths, publicPaths, staffPaths} from './routes';

interface AppRouterProps {
    isAuthenticated: boolean;
    onAuthToggle: () => void;
    handleLogin: (role: string) => void;
    handleSignUp: () => void;
    role: string | null;
}

const AppRouter: React.FC<AppRouterProps> = ({
                                                 isAuthenticated,
                                                 onAuthToggle,
                                                 handleLogin,
                                                 handleSignUp,
                                                 role
                                             }) => {
    const location = useLocation();

    const getPrivateRoutes = () => {
        switch (role) {
            case 'admin':
                return adminPaths;
            case 'staff':
                return staffPaths;
            case 'doctor':
                return doctorPaths;
            case 'customer':
            default:
                return customerPaths;
        }
    };
    const privateRoutes = getPrivateRoutes();
    const allPrivateRoutePaths = privateRoutes.map(route => route.path);
    const isProtectedRoute = allPrivateRoutePaths.some((route) => location.pathname.startsWith(route));
    const showSidebar = isAuthenticated && isProtectedRoute && !location.pathname.startsWith('/login-required');

    return (
        <div className="flex flex-col min-h-screen">      {isProtectedRoute && isAuthenticated ? (
            <PrivateLayout
                isAuthenticated={isAuthenticated}
                onAuthToggle={onAuthToggle}
                showSidebar={showSidebar}
                routes={privateRoutes}
            >
                <Routes>
                    {privateRoutes.map((route, index) => (
                        <Route
                            key={index}
                            path={route.path}
                            element={isAuthenticated ? route.element : <RequireLogin/>}
                        />
                    ))}
                    <Route path="*" element={publicPaths.find(route => route.path === '*')?.element}/>
                </Routes>
            </PrivateLayout>
        ) : (
            <PublicLayout>
                <Routes>
                    {publicPaths.map((route, index) => (
                        <Route key={index} path={route.path} element={route.element}/>
                    ))}
                    <Route path="/login" element={<Login onLogin={handleLogin}/>}/>
                    <Route path="/signup" element={<SignUp onSignUp={handleSignUp}/>}/>
                    {guestPaths.map((route, index) => (
                        <Route key={`guest-${index}`} path={route.path} element={route.element}/>
                    ))}
                </Routes>
            </PublicLayout>
        )}
            <Footer/>
        </div>
    );
};

export default AppRouter;
