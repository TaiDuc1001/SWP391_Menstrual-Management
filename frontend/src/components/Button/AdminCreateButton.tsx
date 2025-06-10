import React from 'react';

interface CreateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

const AdminCreateButton: React.FC<CreateButtonProps> = ({ icon, children = 'Thêm mới', ...props }) => (
    <button
        className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition text-base gap-1 focus:outline-none"
        {...props}
    >
        {icon}
        {children}
    </button>
);

export default AdminCreateButton;
