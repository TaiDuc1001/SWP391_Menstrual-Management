import React from 'react';
import Base from './Base';
import { TableColumn, TableAction } from '../types';

interface ExaminationRecord {
  id: number;
  date: string;
  timeRange: string;
  examinationStatus: string;
  panelName: string;
  customerName: string;
}

interface ApproveResultTableProps {
  examinations: ExaminationRecord[];
  onApprove?: (id: number) => void;
  onViewDetails?: (id: number) => void;
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

const ApproveResultTable: React.FC<ApproveResultTableProps> = ({
  examinations,
  onApprove,
  onViewDetails,
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
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'SAMPLED':
        return 'Sampled';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'EXAMINED':
        return 'Examined';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    const label = getStatusLabel(status);
    
    switch (status) {
      case 'EXAMINED':
        return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">{label}</span>;
      case 'COMPLETED':
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">{label}</span>;
      case 'IN_PROGRESS':
        return <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">{label}</span>;
      case 'CANCELLED':
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">{label}</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{label}</span>;
    }
  };

  const columns: TableColumn<ExaminationRecord>[] = [
    {
      key: 'id',
      label: 'Request ID',
      sortable: true,
      width: 'w-32',
      render: (examination) => `EXM-${examination.id.toString().padStart(4, '0')}`
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      width: 'w-48'
    },
    {
      key: 'panelName',
      label: 'Test Package',
      sortable: true,
      width: 'w-56'
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      width: 'w-32',
      render: (examination) => new Date(examination.date).toLocaleDateString('en-GB')
    },
    {
      key: 'timeRange',
      label: 'Time',
      width: 'w-32'
    },
    {
      key: 'examinationStatus',
      label: 'Status',
      sortable: true,
      width: 'w-32',
      align: 'center',
      render: (examination) => getStatusBadge(examination.examinationStatus)
    }
  ];

  const actions: TableAction<ExaminationRecord>[] = [
    {
      icon: <i className="fas fa-eye text-blue-600"></i>,
      label: 'View Details',
      onClick: (examination) => onViewDetails?.(examination.id),
    },
    {
      icon: <i className="fas fa-check text-green-600"></i>,
      label: 'Approve',
      onClick: (examination) => onApprove?.(examination.id),
      hidden: (examination) => examination.examinationStatus !== 'EXAMINED'
    }
  ];

  // Filter to only show EXAMINED status examinations
  const filteredExaminations = examinations.filter(exam => exam.examinationStatus === 'EXAMINED');

  return (
    <Base
      data={filteredExaminations}
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
      title="Approve Test Results"
      emptyMessage="No examinations ready for approval"
      className={className}
    />
  );
};

export default ApproveResultTable;
