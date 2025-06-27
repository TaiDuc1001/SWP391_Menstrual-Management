import logo from '../../../assets/icons/logo.svg';
import {useRef} from 'react';
import logoutIcon from '../../../assets/icons/log-out.svg';

interface HeaderProps {
    isAuthenticated: boolean;
    onAuthToggle: () => void;
}

const AdminHeader: React.FC<HeaderProps> = ({isAuthenticated, onAuthToggle}) => {
    const profileRef = useRef<HTMLDivElement>(null);

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
                <span className="flex items-center cursor-pointer group">
                    <img src="https://i.pravatar.cc/36?img=3" alt="MyProfile"
                         className="rounded-full w-10 h-10 border-2 border-blue-300 mx-2 hover:ring-2 hover:ring-blue-200 transition-all duration-200 shadow-md"/>
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
