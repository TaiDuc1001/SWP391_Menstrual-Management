import React from 'react';
import AdminTable from './AdminTable';
import { TableColumn, TableAction } from '../types';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  status: string;
  avatar: string;
}

interface UserManagementTableProps {
  users: User[];
  selected: number[];
  onSelectChange: (selected: number[]) => void;
  onSelectAll: (checked: boolean) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
  loading?: boolean;
  className?: string;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  selected,
  onSelectChange,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  sortConfig,
  onSort,
  loading = false,
  className = ""
}) => {
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
      case 'Active': 
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Active</span>;
      case 'Locked': 
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">Locked</span>;
      case 'Inactive': 
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">Inactive</span>;
      case 'Pending': 
        return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">Pending</span>;
      default: 
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'avatar',
      label: '',
      width: 'w-12',
      render: (user) => (
        <div className="flex items-center justify-center">
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt={user.name}
            className="w-8 h-8 rounded-full bg-gray-200"
          />
        </div>
      )
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      width: 'w-48'
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      width: 'w-64'
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      width: 'w-32',
      render: (user) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
          {user.role}
        </span>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      width: 'w-40'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: 'w-32',
      align: 'center',
      render: (user) => getStatusBadge(user.status)
    }
  ];

  const actions: TableAction<User>[] = [
    {
      icon: <i className="fas fa-edit text-blue-600"></i>,
      label: 'Edit User',
      onClick: (user) => onEditUser?.(user),
    },    {
      icon: <i className="fas fa-lock text-yellow-600"></i>,
      label: 'Toggle Status',
      onClick: (user) => onToggleStatus?.(user.id),
    },
    {
      icon: <i className="fas fa-trash text-red-600"></i>,
      label: 'Delete User',
      onClick: (user) => onDeleteUser?.(user.id),
      variant: 'danger'
    }
  ];

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      onSelectChange(users.map(u => u.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectChange = (newSelected: number[] | string[]) => {
    onSelectChange(newSelected as number[]);
  };

  return (
    <AdminTable
      data={users}
      columns={columns}
      actions={actions}
      selectable
      selected={selected}
      onSelectChange={handleSelectChange}
      onSelectAll={handleSelectAllChange}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      itemsPerPage={itemsPerPage}
      totalItems={totalItems}
      sortConfig={sortConfig}
      onSort={onSort}
      loading={loading}
      title="User Management"
      className={className}
    />
  );
};

export default UserManagementTable;
