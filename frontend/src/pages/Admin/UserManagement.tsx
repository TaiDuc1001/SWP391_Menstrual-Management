import React, {useState, useEffect, useRef} from 'react';
import dropDownIcon from '../../assets/icons/drop-down.svg';
import NewUserButton from "../../components/Button/NewUserButton";
import plusWhiteIcon from "../../assets/icons/plus-white.svg";
import searchIcon from "../../assets/icons/search.svg";
import refreshIcon from "../../assets/icons/refresh.svg";
import editIcon from '../../assets/icons/edit.svg';
import lockIcon from '../../assets/icons/shield.svg';
import unlockIcon from '../../assets/icons/green-check.svg';
import deleteIcon from '../../assets/icons/trash-bin.svg';
import userAvt from '../../assets/icons/avatar.svg';



const roles = ['Customer', 'Consultant', 'Staff', 'Manager'];
const statuses = ['Active', 'Inactive', 'Pending', 'Locked'];


const plusIcon = plusWhiteIcon;

const users = [
    {
        id: 1,
        name: 'Nguyễn Thị Mai',
        email: 'mainguyen@gmail.com',
        password: '********',
        role: 'Customer',
        phone: '0988 123 456',
        status: 'Active',
        avatar: userAvt,
    },
    {
        id: 2,
        name: 'Trần Văn An',
        email: 'antran@gmail.com',
        password: '********',
        role: 'Consultant',
        phone: '0912 987 654',
        status: 'Active',
        avatar: userAvt,
    },
    {
        id: 3,
        name: 'Lê Thị Hằng',
        email: 'hangle@gmail.com',
        password: '********',
        role: 'Staff',
        phone: '0902 456 123',
        status: 'Locked',
        avatar: userAvt,
    },
    {
        id: 4,
        name: 'Đỗ Minh Quang',
        email: 'quangdo@gmail.com',
        password: '********',
        role: 'Manager',
        phone: '0978 654 321',
        status: 'Active',
        avatar: userAvt,
    },
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
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
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

    const totalUsers = 1245;
    const pageSize = 10;
    const totalPages = Math.ceil(totalUsers / pageSize);

    const handleSelectRow = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };
    const handleSelectAll = () => {
        if (selectedRows.length === filteredUsers.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredUsers.map((u) => u.id));
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Customer': return 'bg-green-100 text-green-600';
            case 'Consultant': return 'bg-yellow-100 text-yellow-600';
            case 'Staff': return 'bg-blue-100 text-blue-600';
            case 'Manager': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">Đang hoạt động</span>;
            case 'Locked': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Đã khóa</span>;
            case 'Inactive': return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">Không hoạt động</span>;
            case 'Pending': return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs">Chờ duyệt</span>;
            default: return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">{status}</span>;
        }
    };

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
                <div className="flex items-center mb-2">
                    <h2 className="text-lg font-semibold mr-2">Danh sách người dùng</h2>
                    <span className="text-blue-600 font-bold">{totalUsers.toLocaleString()}</span>
                </div>
                <table className="w-full table-fixed text-sm">
                    <thead>
                    <tr className="bg-gray-50 text-gray-700">
                        <th className="p-2 border w-3">STT</th>
                        <th className="p-2 border w-20">Name</th>   
                        <th className="p-2 border w-20">Email</th>
                        <th className="p-2 border w-10">Password</th>
                        <th className="p-2 border w-12">Role</th>
                        <th className="p-2 border w-12">Phone</th>
                        <th className="p-2 border w-20">Status</th>
                        <th className="p-2 border w-12">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="p-4 text-center text-gray-500">No users found</td>
                        </tr>
                    ) : (
                        filteredUsers.map((user, idx) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-2 border text-center">{idx + 1}</td>
                                <td className="p-2 border flex items-center gap-2">
                                    <img src={user.avatar} alt="avatar" className="w-7 h-7 rounded-full border" />
                                    <span>{user.name}</span>
                                </td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border text-center">********</td>
                                <td className="p-2 border text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                                </td>
                                <td className="p-2 border text-center">{user.phone}</td>
                                <td className="p-2 border text-center">{getStatusBadge(user.status)}</td>
                                <td className="p-2 border flex gap-2 justify-center">
                                    <button title="Edit"><img src={editIcon} alt="edit" className="w-4 h-4" /></button>
                                    <button title={user.status === 'Locked' ? 'Unlock' : 'Lock'}><img src={user.status === 'Locked' ? unlockIcon : lockIcon} alt="lock" className="w-4 h-4" /></button>
                                    <button title="Delete"><img src={deleteIcon} alt="delete" className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Hiển thị 1-10 trên {totalUsers.toLocaleString()} người dùng</span>
                    <div className="flex items-center gap-1">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-white border'}`}>{'<'}</button>
                        {[...Array(3)].map((_, i) => (
                            <button key={i} className={`px-2 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{i + 1}</button>
                        ))}
                        <span>...</span>
                        <button className="px-2 py-1 rounded bg-white border">{totalPages}</button>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200' : 'bg-white border'}`}>{'>'}</button>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default UserManagement;
