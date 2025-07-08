import React, { useEffect, useState } from 'react';
import NewUserButton from "../../../components/common/Button/AdminCreateButton";
import plusWhiteIcon from "../../../assets/icons/plus-white.svg";
import searchIcon from "../../../assets/icons/search.svg";
import refreshIcon from "../../../assets/icons/refresh.svg";
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/trash-bin.svg';
import { AccountForUI, CreateAccountRequest, UpdateAccountRequest } from '../../../api';
import { useAccounts } from '../../../api/hooks';
import CreateUserModal from '../../../components/feature/Modal/CreateUserModal';
import UpdateUserModal from '../../../components/feature/Modal/UpdateUserModal';
import ConfirmDialog from '../../../components/common/Dialog/ConfirmDialog';
import SuccessNotification from '../../../components/feature/Notification/SuccessNotification';
import ErrorNotification from '../../../components/feature/Notification/ErrorNotification';
import { DropdownSelect } from '../../../components';
import { applyPagination } from '../../../utils';
import { generateAvatarUrl } from '../../../utils/avatar';


const roles = [
    { value: '', label: 'All roles' },
    { value: 'CUSTOMER', label: 'Customer' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'STAFF', label: 'Staff' },
    { value: 'ADMIN', label: 'Admin' }
];

const statuses = [
    { value: '', label: 'All status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
];

const Accounts: React.FC = () => {
    const { 
        accounts: users, 
        loading, 
        error, 
        fetchAccounts, 
        createAccount, 
        updateAccount, 
        deleteAccount
    } = useAccounts();
    
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AccountForUI | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<AccountForUI | null>(null);
    

    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');

    const pageSize = 5;


    const showSuccess = (title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowSuccessNotification(true);
    };

    const showError = (title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowErrorNotification(true);
    };


    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRole, selectedStatus, searchTerm]);

    const handleRefresh = async () => {
        try {
            await fetchAccounts();
            setSelectedRole('');
            setSelectedStatus('');
            setSearchTerm('');
            setCurrentPage(1);
            showSuccess('Data Refreshed', 'User data has been refreshed successfully.');
        } catch (error) {
            showError('Refresh Failed', 'Failed to refresh user data. Please try again.');
        }
    };

    const handleCreateUser = async (userData: CreateAccountRequest) => {
        setIsCreating(true);
        try {
            const result = await createAccount(userData);
            
            if (result.success) {
                setShowCreateModal(false);
                showSuccess('User Created', `Account for ${userData.name} has been created successfully.`);
            } else {
                let errorMessage = result.error || 'Failed to create user. Please try again.';
                
                if (result.error?.includes('Duplicate entry') && result.error?.includes('phone')) {
                    errorMessage = 'This phone number is already registered. Please use a different phone number.';
                } else if (result.error?.includes('Duplicate entry') && result.error?.includes('email')) {
                    errorMessage = 'This email address is already registered. Please use a different email address.';
                } else if (result.error?.includes('could not execute statement')) {
                    errorMessage = 'Database error occurred. Please check if the information is already registered.';
                }
                
                showError('Creation Failed', errorMessage);
            }
        } catch (error) {
            showError('Creation Failed', 'An unexpected error occurred while creating the user.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdateUser = async (userData: UpdateAccountRequest) => {
        if (!selectedUser) return;
        
        setIsUpdating(true);
        try {
            const result = await updateAccount(selectedUser.id, userData);
            
            if (result.success) {
                setShowUpdateModal(false);
                setSelectedUser(null);
                showSuccess('User Updated', `Account for ${userData.name} has been updated successfully.`);
            } else {
                let errorMessage = result.error || 'Failed to update user. Please try again.';
                
                if (result.error?.includes('Duplicate entry') && result.error?.includes('phone')) {
                    errorMessage = 'This phone number is already used by another account. Please use a different phone number.';
                } else if (result.error?.includes('Duplicate entry') && result.error?.includes('email')) {
                    errorMessage = 'This email address is already used by another account. Please use a different email address.';
                } else if (result.error?.includes('could not execute statement')) {
                    errorMessage = 'Database error occurred. Please check if the information is already registered.';
                }
                
                showError('Update Failed', errorMessage);
            }
        } catch (error) {
            showError('Update Failed', 'An unexpected error occurred while updating the user.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteUser = (user: AccountForUI) => {
        setUserToDelete(user);
        setShowConfirmDialog(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            const result = await deleteAccount(userToDelete.id);
            
            if (result.success) {
                showSuccess('User Deleted', `Account ${userToDelete.name} has been deleted successfully.`);
            } else {
                showError('Delete Failed', result.error || 'Failed to delete account. Please try again.');
            }
        } catch (error) {
            showError('Delete Failed', 'An unexpected error occurred while deleting the user.');
        } finally {
            setIsDeleting(false);
            setShowConfirmDialog(false);
            setUserToDelete(null);
        }
    };

    const handleEditUser = (user: AccountForUI) => {
        setSelectedUser(user);
        setShowUpdateModal(true);
    };

    const filteredUsers = users.filter((user: AccountForUI) =>
        (!selectedRole || user.role === selectedRole) &&
        (!selectedStatus || user.status === selectedStatus) &&
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const paginationResult = applyPagination(filteredUsers, {
        currentPage,
        itemsPerPage: pageSize
    });
    const { items: paginatedUsers, totalPages, totalItems: totalUsers, startIdx, endIdx } = paginationResult;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
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
            default:
                return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">{status}</span>;
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">User management</h1>
                <NewUserButton 
                    icon={<img src={plusWhiteIcon} alt="Plus" className="w-5 h-5"/>}
                    onClick={() => setShowCreateModal(true)}
                >
                    Create new user
                </NewUserButton>
            </div>

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

                <DropdownSelect
                    options={roles}
                    value={selectedRole}
                    onChange={setSelectedRole}
                    placeholder="All roles"
                    className="min-w-[120px]"
                />

                <DropdownSelect
                    options={statuses}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="All status"
                    className="min-w-[120px]"
                />

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
                                    <td className="p-2 border text-center">{startIdx + idx + 1}</td>
                                    <td className="p-2 border flex items-center gap-2">
                                        <img 
                                            src={user.avatar} 
                                            alt="avatar" 
                                            className="w-7 h-7 rounded-full border"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = generateAvatarUrl(user.name);
                                            }}
                                        />
                                        <span>{user.name}</span>
                                    </td>
                                    <td className="p-2 border">{user.email}</td>
                                    <td className="p-2 border text-center">********</td>
                                    <td className="p-2 border text-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                            {user.role}
                                        </span>
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
                    <span>Displaying {Math.min(startIdx + 1, totalUsers)}-{Math.min(endIdx, totalUsers)} of {totalUsers.toLocaleString()} users</span>
                </div>
            </div>

            {totalUsers > 0 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                        Prev
                    </button>
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                        Next
                    </button>
                </div>
            )}

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

            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Confirm Deletion"
                message={`Are you sure you want to permanently delete account ${userToDelete?.name}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteUser}
                onCancel={() => {
                    setShowConfirmDialog(false);
                    setUserToDelete(null);
                }}
                type="danger"
            />

            <SuccessNotification
                isOpen={showSuccessNotification}
                onClose={() => setShowSuccessNotification(false)}
                title={notificationTitle}
                message={notificationMessage}
                duration={5000}
            />

            <ErrorNotification
                isOpen={showErrorNotification}
                onClose={() => setShowErrorNotification(false)}
                title={notificationTitle}
                message={notificationMessage}
                duration={5000}
            />
        </div>
    );
};

export default Accounts;
