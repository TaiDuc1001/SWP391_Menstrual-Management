import logo from '../../../assets/icons/logo.svg';
import notificationIcon from '../../../assets/icons/notification.svg';
import {useEffect, useRef, useState} from 'react';
import logoutIcon from '../../../assets/icons/log-out.svg';

interface HeaderProps {
    isAuthenticated: boolean;
    onAuthToggle: () => void;
}

const AdminHeader: React.FC<HeaderProps> = ({isAuthenticated, onAuthToggle}) => {
    const [showNoti, setShowNoti] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowNoti(false);
            }
        }

        if (showNoti) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNoti]);

    const userName = "Jane Doe";

    return (
        <header
            className="bg-gradient-to-r from-blue-50/90 via-white/80 to-blue-100/80 backdrop-blur-lg px-10 py-5 flex items-center justify-between border-b border-blue-100 sticky top-0 z-50 transition-all duration-300 animate-fade-in">
            <div className="flex items-center flex-1 gap-10">
                <img src={logo} alt="Logo"
                     className="h-12 w-auto mr-10 drop-shadow-lg hover:scale-105 transition-transform duration-200"/>
                <div className="h-10 w-px bg-blue-100 mx-2 hidden md:block"/>
            </div>
            <div className="flex items-center gap-4 relative" ref={profileRef}>
                <span className="relative">
                    <img
                        src={notificationIcon}
                        alt="Notifications"
                        className="w-7 h-7 cursor-pointer hover:scale-110 hover:bg-blue-100/70 rounded-full p-1 transition-all duration-200 shadow hover:shadow-blue-100"
                        onClick={() => setShowNoti((prev) => !prev)}
                    />
                    {showNoti && (
                        <div
                            className="absolute right-0 top-12 z-50 bg-white/95 backdrop-blur-lg border-2 border-blue-200 rounded-3xl shadow-xl py-3 w-72 flex flex-col gap-2 transition-all duration-300 animate-fade-in mt-2 mx-1">
                            <div
                                className="px-5 py-2 text-base text-gray-700 font-poppins font-medium border-b border-blue-100">Notifications
                            </div>
                            <div
                                className="px-5 py-2 hover:bg-blue-50 rounded-xl cursor-pointer text-gray-700 font-poppins transition-all duration-200">Your
                                appointment is confirmed!
                            </div>
                            <div
                                className="px-5 py-2 hover:bg-blue-50 rounded-xl cursor-pointer text-gray-700 font-poppins transition-all duration-200">New
                                blog post: Women's Health Tips
                            </div>
                            <div
                                className="px-5 py-2 hover:bg-blue-50 rounded-xl cursor-pointer text-gray-700 font-poppins transition-all duration-200">Cycle
                                tracking reminder
                            </div>
                            <button className="mt-2 text-blue-500 hover:underline font-poppins text-sm self-end px-5"
                                    onClick={() => setShowNoti(false)}>Close
                            </button>
                        </div>
                    )}
                </span>
                <span className="flex items-center cursor-pointer group">
                    <img src="https://i.pravatar.cc/36?img=3" alt="MyProfile"
                         className="rounded-full w-10 h-10 border-2 border-blue-300 mx-2 hover:ring-2 hover:ring-blue-200 transition-all duration-200 shadow-md"/>
                    <span
                        className="ml-2 font-poppins font-semibold text-gray-700 group-hover:text-blue-500 transition-colors duration-200">{userName}</span>
                </span>
                <button
                    onClick={() => {
                        onAuthToggle();
                        window.location.href = 'http://localhost:3000/';
                    }}
                    className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-600 font-poppins px-4 py-1.5 rounded-full transition-all duration-200 shadow hover:shadow-blue-200 text-sm"
                >
                    <img src={logoutIcon} alt="Log out" className="w-4 h-4"/>
                    <span>Log out</span>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;
