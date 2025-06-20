import React from 'react';
import Base from './Base';
import { TableColumn, TableAction } from '../types';
import StatusBadge from '../../../common/Badge/StatusBadge';

interface AppointmentRecord {
  id: number;
  date: string;
  time: string;
  doctor?: string;
  name?: string;
  status: string;
  code?: string;
  slot?: string;
  slotTime?: string;
  appointmentStatus?: string;
}

interface AppointmentTableProps {
  records: AppointmentRecord[];
  selected: number[];
  onSelectChange: (selected: number[]) => void;
  onSelectAll: (checked: boolean) => void;
  hideRows?: number[];
  onViewRows?: (ids: number[]) => void;
  onCancelRows?: (ids: number[]) => void;
  onConfirmRows?: (ids: number[]) => void;
  onJoinMeeting?: (id: number) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  records,
  selected,
  onSelectChange,
  onSelectAll,
  hideRows = [],
  onViewRows,
  onCancelRows,
  onConfirmRows,
  onJoinMeeting,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  sortConfig,
  onSort,
  loading = false,
  emptyMessage = "No appointments found",
  className = ""
}) => {
  const visibleRecords = records.filter(r => !hideRows.includes(r.id));
  
  const columns: TableColumn<AppointmentRecord>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      width: 'w-32'
    },
    {
      key: 'time',
      label: 'Time',
      sortable: true,
      width: 'w-24',
      render: (row) => row.slotTime || row.time
    },
    {
      key: 'doctor',
      label: 'Doctor',
      sortable: true,
      width: 'w-48',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gray-300 block"></span>
          <span>{row.doctor || row.name}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: 'w-32',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} />
    }
  ];

  const actions: TableAction<AppointmentRecord>[] = [
    {
      icon: <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">View Result</span>,
      label: 'View Result',
      onClick: (row) => onViewRows?.([row.id]),
      hidden: (row) => row.status !== 'Completed'
    },
    {
      icon: <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">Checkout</span>,
      label: 'Checkout',
      onClick: (row) => window.location.href = `/checkout/${row.id}`,
      hidden: (row) => row.status !== 'Booked'
    },
    {
      icon: <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">Confirm</span>,
      label: 'Confirm',
      onClick: (row) => onConfirmRows?.([row.id]),
      hidden: (row) => !['Confirmed', 'Waiting for Customer'].includes(row.status)
    },
    {
      icon: <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">Join Meeting</span>,
      label: 'Join Meeting',
      onClick: (row) => onJoinMeeting?.(row.id),
      hidden: (row) => row.status !== 'In progress'
    },
    {
      icon: <span className="text-xs text-red-500 hover:underline">Cancel</span>,
      label: 'Cancel',
      onClick: (row) => onCancelRows?.([row.id]),
      hidden: (row) => !['Upcoming', 'Booked'].includes(row.status)
    }
  ];

  const handleSelectAllChange = (checked: boolean) => {
    if (checked) {
      onSelectChange(visibleRecords.map(r => r.id));
    } else {
      onSelectChange([]);
    }
  };
  const handleSelectChange = (newSelected: number[] | string[]) => {
    onSelectChange(newSelected as number[]);
  };

  return (
    <Base
      data={visibleRecords}
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
      emptyMessage={emptyMessage}
      title="Appointment History"
      className={className}
    />
  );
};

export default AppointmentTable;
