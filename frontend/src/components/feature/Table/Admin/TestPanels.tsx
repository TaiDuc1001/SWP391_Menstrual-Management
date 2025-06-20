import React from 'react';
import BaseTable from './BaseTable';
import {TableAction, TableColumn} from '../types';

interface Service {
    id: number;
    name: string;
    desc: string;
    time: string;
    price: string;
    status: string;
}

interface ServiceManagementTableProps {
    services: Service[];
    onEditService?: (service: Service) => void;
    onDeleteService?: (id: number) => void;
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

const TestPanels: React.FC<ServiceManagementTableProps> = ({
                                                               services,
                                                               onEditService,
                                                               onDeleteService,
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
    const getStatusBadge = (status: string) => {
        if (status === 'In Progress') {
            return <span
                className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
        }
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">{status}</span>;
    };

    const columns: TableColumn<Service>[] = [
        {
            key: 'name',
            label: 'Service Name',
            sortable: true,
            width: 'w-48'
        },
        {
            key: 'desc',
            label: 'Description',
            width: 'w-96',
            render: (service) => (
                <div className="max-w-xs truncate" title={service.desc}>
                    {service.desc}
                </div>
            )
        },
        {
            key: 'time',
            label: 'Duration',
            sortable: true,
            width: 'w-32'
        },
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            width: 'w-32',
            align: 'right'
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            width: 'w-32',
            align: 'center',
            render: (service) => getStatusBadge(service.status)
        }
    ];

    const actions: TableAction<Service>[] = [
        {
            icon: <i className="fas fa-edit text-blue-600"></i>,
            label: 'Edit Service',
            onClick: (service) => onEditService?.(service),
        },
        {
            icon: <i className="fas fa-power-off text-yellow-600"></i>,
            label: 'Toggle Status',
            onClick: (service) => onToggleStatus?.(service.id),
        },
        {
            icon: <i className="fas fa-trash text-red-600"></i>,
            label: 'Delete Service',
            onClick: (service) => onDeleteService?.(service.id),
            variant: 'danger'
        }
    ];

    return (
        <BaseTable
            data={services}
            columns={columns}
            actions={actions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            sortConfig={sortConfig}
            onSort={onSort}
            loading={loading}
            title="Service Management"
            emptyMessage="No services found"
            className={className}
        />
    );
};

export default TestPanels;
