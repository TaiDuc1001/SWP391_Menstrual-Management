import logo from '../../../assets/icons/logo.svg';
import dropDownIcon from '../../../assets/icons/drop-down.svg';
import {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import DropDown from './DropDown';
import { getCurrentUserProfile } from '../../../utils/auth';

interface HeaderProps {
    isAuthenticated: boolean;
    onAuthToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({isAuthenticated, onAuthToggle}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('User');
    const [userAvatar, setUserAvatar] = useState('');
    const profileRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const getDashboardPath = () => {
        const role = localStorage.getItem('role')?.toLowerCase();
        switch (role) {
            case 'admin':
                return '/admin/dashboard';
            case 'doctor':
                return '/doctor/dashboard';
            case 'staff':
                return '/staff/dashboard';
            case 'customer':
            default:
                return '/customer/dashboard';
        }
    };

    const generateAvatarUrl = (name: string) => {
        const encodedName = encodeURIComponent(name || 'User');
        return `https://ui-avatars.com/api/?name=${encodedName}&size=40&background=ec4899&color=ffffff&bold=true`;
    };

    const updateUserInfo = () => {
        const userProfile = getCurrentUserProfile();
        if (userProfile?.profile?.name) {
            setUserName(userProfile.profile.name);
            setUserAvatar(generateAvatarUrl(userProfile.profile.name));
        } else if (userProfile?.email) {

            const emailName = userProfile.email.split('@')[0];
            setUserName(emailName);
            setUserAvatar(generateAvatarUrl(emailName));
        }
    };

    useEffect(() => {
        updateUserInfo();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            updateUserInfo();
        };

        window.addEventListener('storage', handleStorageChange);

        window.addEventListener('profileUpdated', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('profileUpdated', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <header
            className="bg-gradient-to-r from-pink-50/90 via-white/80 to-pink-100/80 backdrop-blur-lg px-10 py-5 flex items-center justify-between border-b border-pink-100 sticky top-0 z-50 transition-all duration-300 animate-fade-in">
            <div className="flex items-center flex-1 gap-10">
                <img src={logo} alt="Logo"
                     className="h-12 w-auto mr-10 drop-shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                     onClick={() => navigate(getDashboardPath())}/>
                <div className="h-10 w-px bg-pink-100 mx-2 hidden md:block"/>
                <nav className="navbar">
                    <ul className="flex gap-3 md:gap-6">
                        {isAuthenticated && localStorage.getItem('role')?.toLowerCase() !== 'customer' && (
                            <li>
                                <Link to={getDashboardPath()}
                                      className="font-poppins font-semibold text-base md:text-lg px-6 py-2 rounded-full transition-all duration-200 hover:bg-pink-200/60 hover:text-pink-600 focus:bg-pink-300/80 focus:text-pink-700 shadow-sm hover:shadow-pink-100">Dashboard</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
            <div className="flex items-center gap-4 relative" ref={profileRef}>
                <span className="flex items-center cursor-pointer group" onClick={() => {
                    setDropdownOpen(false);
                    const role = localStorage.getItem('role')?.toLowerCase();
                    switch (role) {
                        case 'doctor':
                            navigate('/doctor/profile');
                            break;
                        case 'admin':
                            navigate('/admin/profile');
                            break;
                        case 'staff':
                            navigate('/staff/profile');
                            break;
                        case 'customer':
                        default:
                            navigate('/customer/profile');
                            break;
                    }
                }}>
                    <img src={userAvatar || generateAvatarUrl(userName)} alt="MyProfile"
                         className="rounded-full w-10 h-10 border-2 border-pink-300 mx-2 hover:ring-2 hover:ring-pink-200 transition-all duration-200 shadow-md"/>
                </span>
                <span className="cursor-pointer flex items-center" onClick={() => {
                    setDropdownOpen((open) => !open);
                }}>
                    <img src={dropDownIcon} alt="Dropdown" className="w-5 h-5 transition-transform duration-200"
                         style={{transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'}}/>
                </span>
                {dropdownOpen && (
                    <div className="absolute right-0 top-14 z-50">
                        <DropDown onAuthToggle={onAuthToggle} closeDropdown={() => setDropdownOpen(false)}/>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;

