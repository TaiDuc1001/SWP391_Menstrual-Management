import React, {useState, useEffect, useRef} from 'react';
import dropDownIcon from '../../assets/icons/drop-down.svg';
import NewUserButton from "../../components/Button/NewUserButton";
import plusWhiteIcon from "../../assets/icons/plus-white.svg";
import searchIcon from "../../assets/icons/search.svg";
import refreshIcon from "../../assets/icons/refresh.svg";


const roles = ['Admin', 'Customer', 'Consultant'];
const statuses = ['Active', 'Inactive', 'Pending'];


const plusIcon = plusWhiteIcon;

const users = [
    {id: 1, name: 'Nguyễn Thị Mai', email: 'mai1@gmail.com', role: 'Customer', status: 'Active'},
    {id: 2, name: 'Trần Văn An', email: 'an@gmail.com', role: 'Consultant', status: 'Inactive'},
    {id: 3, name: 'Lê Hữu Tài', email: 'tai@gmail.com', role: 'Admin', status: 'Active'},
    {id: 4, name: 'Phạm Thị Lan', email: 'lan@gmail.com', role: 'Customer', status: 'Pending'},
];



// handfle button refresh
const handleRefresh = () => {
};


const UserManagement: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const roleRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
                setShowRoleDropdown(false);
            }
            if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
                setShowStatusDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const filteredUsers = users.filter(user =>
        (!selectedRole || user.role === selectedRole) &&
        (!selectedStatus || user.status === selectedStatus) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            {/*header + create button */}
            <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">User management</h1>
                <NewUserButton icon={<img src={plusIcon} alt="Plus" className="w-5 h-5"/>}>
                    Create new user
                </NewUserButton>
            </div>

            {/*search , role, status dropdown*/}
            <div className="mb-4 flex space-x-4 w-full">

                {/*search*/}
                <div className="relative flex-1 min-w-0">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400" />
                    </span>
                </div>

                {/*all roles*/}
                <div className="relative" ref={roleRef}>
                    <button
                        className="border px-4 py-2 rounded flex items-center gap-2 min-w-[150px]"
                        onClick={() => {
                            setShowRoleDropdown(!showRoleDropdown);
                            setShowStatusDropdown(false);
                        }}
                    >
                        {selectedRole || 'All roles'}
                        <img src={dropDownIcon} alt="dropdown" className="w-4 h-4"/>
                    </button>
                    {showRoleDropdown && (
                        <div className="absolute bg-white border mt-2 rounded shadow w-48 z-10">
                            <div
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedRole(null);
                                    setShowRoleDropdown(false);
                                }}
                            >
                                All roles
                            </div>
                            {roles.map((role) => (
                                <div
                                    key={role}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedRole === role ? 'bg-gray-200' : ''}`}
                                    onClick={() => {
                                        setSelectedRole(role);
                                        setShowRoleDropdown(false);
                                    }}
                                >
                                    {role}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/*all status*/}
                <div className="relative" ref={statusRef}>
                    <button
                        className="border px-4 py-2 rounded flex items-center gap-2 min-w-[150px]"
                        onClick={() => {
                            setShowStatusDropdown(!showStatusDropdown);
                            setShowRoleDropdown(false);
                        }}
                    >
                        {selectedStatus || 'All status'}
                        <img src={dropDownIcon} alt="dropdown" className="w-4 h-4"/>
                    </button>
                    {showStatusDropdown && (
                        <div className="absolute bg-white border mt-2 rounded shadow w-48 z-10">
                            <div
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedStatus(null);
                                    setShowStatusDropdown(false);
                                }}
                            >
                                All status
                            </div>
                            {statuses.map((status) => (
                                <div
                                    key={status}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedStatus === status ? 'bg-gray-200' : ''}`}
                                    onClick={() => {
                                        setSelectedStatus(status);
                                        setShowStatusDropdown(false);
                                    }}
                                >
                                    {status}
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div className="relative">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center px-4 py-2 border rounded bg-white hover:bg-gray-100 transition"
                    >
                        <img src={refreshIcon} alt="Refresh" className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>


            {/*table*/}
            <div className="bg-white p-4 rounded shadow w-full">

                {/*data in table*/}
                <table className="w-full table-fixed">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Role</th>
                        <th className="p-2 border">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500">No users found</td>
                        </tr>
                    ) : (
                        filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td className="p-2 border">{user.name}</td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border">{user.role}</td>
                                <td className="p-2 border">{user.status}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};
export default UserManagement;
