import React, {useEffect, useRef, useState} from 'react';
import dropDownIcon from '../../../assets/icons/drop-down.svg';
import NewUserButton from "../../../components/common/Button/AdminCreateButton";
import plusWhiteIcon from "../../../assets/icons/plus-white.svg";
import searchIcon from "../../../assets/icons/search.svg";
import refreshIcon from "../../../assets/icons/refresh.svg";
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/trash-bin.svg';
import userAvt from '../../../assets/icons/avatar.svg';
import { accountService, AccountForUI, CreateAccountRequest, UpdateAccountRequest } from '../../../api';
import CreateUserModal from '../../../components/feature/Modal/CreateUserModal';
import UpdateUserModal from '../../../components/feature/Modal/UpdateUserModal';


const roles = ['CUSTOMER', 'DOCTOR', 'STAFF', 'ADMIN'];
const statuses = ['Active', 'Locked'];

const plusIcon = plusWhiteIcon;

const Accounts: React.FC = () => {
    const [users, setUsers] = useState<AccountForUI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AccountForUI | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const roleRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setError(null);
            const accounts = await accountService.getAllAccounts();
            setUsers(accounts);
        } catch (err) {
            setError('Failed to fetch accounts');
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        await fetchAccounts();
        // Reset filters and pagination
        setSelectedRole(null);
        setSelectedStatus(null);
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleCreateUser = async (userData: CreateAccountRequest) => {
        try {
            setIsCreating(true);
            await accountService.createAccount(userData);
            await fetchAccounts(); // Refresh the list
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Re-throw to let modal handle the error
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdateUser = async (userData: UpdateAccountRequest) => {
        if (!selectedUser) return;
        
        try {
            setIsUpdating(true);
            await accountService.updateAccount(selectedUser.id, userData);
            await fetchAccounts(); // Refresh the list
            setShowUpdateModal(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error; // Re-throw to let modal handle the error
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteUser = async (user: AccountForUI) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản ${user.name}? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            setIsDeleting(true);
            await accountService.deleteAccount(user.id);
            await fetchAccounts(); // Refresh the list
            alert(`Tài khoản ${user.name} đã được xóa thành công.`);
        } catch (error: any) {
            console.error('Error deleting user:', error);
            const errorMessage = error.message || 'Xóa tài khoản thất bại. Vui lòng thử lại.';
            alert(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditUser = (user: AccountForUI) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

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

    const pageSize = 10;

    const handleSelectRow = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };
    
    const filteredUsers = users.filter((user: AccountForUI) =>
        (!selectedRole || user.role === selectedRole) &&
        (!selectedStatus || user.status === selectedStatus) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    
    // Calculate paginated users
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    const handleSelectAll = () => {
        if (selectedRows.length === paginatedUsers.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(paginatedUsers.map((u: AccountForUI) => u.id));
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRole, selectedStatus, searchTerm]);

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'CUSTOMER': return 'Customer';
            case 'DOCTOR': return 'Doctor';
            case 'STAFF': return 'Staff';
            case 'ADMIN': return 'Admin';
            default: return role;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'CUSTOMER':
                return 'bg-green-100 text-green-600';
            case 'DOCTOR':
                return 'bg-yellow-100 text-yellow-600';
            case 'STAFF':
                return 'bg-blue-100 text-blue-600';
            case 'ADMIN':
                return 'bg-purple-100 text-purple-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active':
                return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">Active</span>;
            case 'Locked':
                return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Locked</span>;
            case 'Inactive':
                return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">Inactive</span>;
            case 'Pending':
                return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs">Pending</span>;
            default:
                return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">{status}</span>;
        }
    };


    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">User management</h1>
                <NewUserButton 
                    icon={<img src={plusIcon} alt="Plus" className="w-5 h-5"/>}
                    onClick={() => setShowCreateModal(true)}
                >
                    Create new user
                </NewUserButton>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4 flex space-x-4 w-full">

                <div className="relative flex-1 min-w-0">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded"
                    />
                    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                        <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400"/>
                    </span>
                </div>

                <div className="relative" ref={roleRef}>
                    <button
                        className="border px-4 py-2 rounded flex items-center justify-between gap-2 min-w-[100px]"
                        onClick={() => {
                            setShowRoleDropdown(!showRoleDropdown);
                            setShowStatusDropdown(false);
                        }}
                    >
                        {selectedRole ? getRoleDisplayName(selectedRole) : 'All roles'}
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
                                    {getRoleDisplayName(role)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative" ref={statusRef}>
                    <button
                        className="border px-2 py-2 rounded flex justify-between items-center gap-2 min-w-[100px]"
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
                        disabled={loading}
                        className={`flex items-center px-4 py-2 border rounded bg-white transition ${
                            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                        }`}
                    >
                        <img 
                            src={refreshIcon} 
                            alt="Refresh" 
                            className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                        />
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>


            <div className="bg-white p-4 rounded shadow w-full">
                <div className="flex items-center mb-2">
                    <h2 className="text-lg font-semibold mr-2">User List</h2>
                    <span className="text-blue-600 font-bold">{totalUsers.toLocaleString()}</span>
                </div>
                <table className="w-full table-fixed text-sm">
                    <thead>
                    <tr className="bg-gray-50 text-gray-700">
                        <th className="p-2 border w-3">No</th>
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
                    {loading ? (
                        <tr>
                            <td colSpan={8} className="p-4 text-center text-gray-500">Loading...</td>
                        </tr>
                    ) : paginatedUsers.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="p-4 text-center text-gray-500">No users found</td>
                        </tr>
                    ) : (
                        paginatedUsers.map((user: AccountForUI, idx: number) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="p-2 border text-center">{startIndex + idx + 1}</td>
                                <td className="p-2 border flex items-center gap-2">
                                    <img src={user.avatar || userAvt} alt="avatar" className="w-7 h-7 rounded-full border"/>
                                    <span>{user.name}</span>
                                </td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border text-center">********</td>
                                <td className="p-2 border text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                                </td>
                                <td className="p-2 border text-center">{user.phone}</td>
                                <td className="p-2 border text-center">{getStatusBadge(user.status)}</td>
                                <td className="p-2 border text-center">
                                    <div className="flex justify-center items-center gap-1">
                                        <button 
                                            title="Edit User"
                                            onClick={() => handleEditUser(user)}
                                            className="hover:opacity-70 transition p-1"
                                            disabled={isUpdating || isDeleting}
                                        >
                                            <img src={editIcon} alt="edit" className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            title="Delete User"
                                            onClick={() => handleDeleteUser(user)}
                                            className="hover:opacity-70 transition p-1 text-red-600"
                                            disabled={isUpdating || isDeleting}
                                        >
                                            <img src={deleteIcon} alt="delete user" className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Displaying {Math.min(startIndex + 1, totalUsers)}-{Math.min(endIndex, totalUsers)} of {totalUsers.toLocaleString()} users</span>
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border hover:bg-gray-50'}`}
                        >
                            {'<'}
                        </button>
                        
                        {/* Page numbers */}
                        {(() => {
                            const pages = [];
                            const maxVisiblePages = 5;
                            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                            
                            // Adjust startPage if we're near the end
                            if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(1, endPage - maxVisiblePages + 1);
                            }
                            
                            // Show first page if not in range
                            if (startPage > 1) {
                                pages.push(
                                    <button 
                                        key={1}
                                        onClick={() => setCurrentPage(1)}
                                        className="px-2 py-1 rounded bg-white border hover:bg-gray-50"
                                    >
                                        1
                                    </button>
                                );
                                if (startPage > 2) {
                                    pages.push(<span key="ellipsis1" className="px-1">...</span>);
                                }
                            }
                            
                            // Show page numbers in range
                            for (let i = startPage; i <= endPage; i++) {
                                pages.push(
                                    <button 
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`px-2 py-1 rounded ${currentPage === i ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
                                    >
                                        {i}
                                    </button>
                                );
                            }
                            
                            // Show last page if not in range
                            if (endPage < totalPages) {
                                if (endPage < totalPages - 1) {
                                    pages.push(<span key="ellipsis2" className="px-1">...</span>);
                                }
                                pages.push(
                                    <button 
                                        key={totalPages}
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="px-2 py-1 rounded bg-white border hover:bg-gray-50"
                                    >
                                        {totalPages}
                                    </button>
                                );
                            }
                            
                            return pages;
                        })()}
                        
                        <button 
                            disabled={currentPage === totalPages || totalPages === 0} 
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className={`px-2 py-1 rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white border hover:bg-gray-50'}`}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>

            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateUser}
                loading={isCreating}
            />

            <UpdateUserModal
                isOpen={showUpdateModal}
                onClose={() => {
                    setShowUpdateModal(false);
                    setSelectedUser(null);
                }}
                onSubmit={handleUpdateUser}
                loading={isUpdating}
                user={selectedUser}
            />
        </div>
    );
};
export default Accounts;
