import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

interface ProfileDropdownProps {
    onAuthToggle: () => void;
    closeDropdown: () => void;
}

const DropDown: React.FC<ProfileDropdownProps> = ({onAuthToggle, closeDropdown}) => {
    const navigate = useNavigate();
    
    const getProfilePath = () => {
        const role = localStorage.getItem('role')?.toLowerCase();
        switch (role) {
            case 'doctor':
                return '/doctor/profile';
            case 'admin':
                return '/admin/profile';
            case 'staff':
                return '/staff/dashboard'; // Staff profile removed
            case 'customer':
            default:
                return '/customer/profile';
        }
    };
    
    return (
        <div
            className="profile-dropdown-menu bg-white/95 backdrop-blur-lg border-2 border-pink-200 rounded-3xl shadow-xl py-3 w-56 flex flex-col gap-2 transition-all duration-300 animate-fade-in mt-2 mx-1">
            <Link to={getProfilePath()}
                  className="profile-dropdown-item px-5 py-2 hover:bg-pink-50 hover:text-pink-500 text-base text-gray-700 text-left rounded-xl transition-all duration-200 font-poppins font-medium mb-1"
                  onClick={closeDropdown}>
                My Profile
            </Link>
            <button
                className="profile-dropdown-item px-5 py-2 hover:bg-pink-50 hover:text-pink-500 text-base text-gray-700 text-left rounded-xl transition-all duration-200 font-poppins font-medium"
                onClick={() => {
                    closeDropdown();
                    onAuthToggle();
                    navigate('/');
                }}>
                Logout
            </button>
        </div>
    );
};

export default DropDown;

