import React from 'react';
import Base from './Base';
import { TableColumn, TableAction } from '../types';
import StatusBadge from '../../../common/Badge/StatusBadge';

interface TestRecord {
  id: number;
  date: string;
  slot: string;
  time?: string;
  panels: string;
  status: string;
  statusRaw?: string;
}

interface TestTableProps {
  filteredRecords: TestRecord[];
  slotTimeMap: { [key: string]: string };
  selected: number[];
  onSelectChange: (selected: number[]) => void;
  onSelectAll: (checked: boolean) => void;
  hideRows: number[];
  onDeleteRows?: (ids: number[]) => void;
  onViewRows?: (ids: number[]) => void;
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

const TestTable: React.FC<TestTableProps> = ({
  filteredRecords,
  slotTimeMap,
  selected,
  onSelectChange,
  onSelectAll,
  hideRows,
  onDeleteRows,
  onViewRows,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  sortConfig,
  onSort,
  loading = false,
  emptyMessage = "No test records found",
  className = ""
}) => {
  const visibleRecords = filteredRecords.filter(record => !hideRows.includes(record.id));

  const columns: TableColumn<TestRecord>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      width: 'w-32'
    },
    {
      key: 'slot',
      label: 'Time',
      sortable: true,
      width: 'w-32',
      render: (row) => slotTimeMap[row.slot] || row.time || ''
    },
    {
      key: 'panels',
      label: 'Test panels',
      sortable: true,
      width: 'w-56'
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

  const actions: TableAction<TestRecord>[] = [
    {
      icon: <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded">View Result</span>,
      label: 'View Result',
      onClick: (row) => onViewRows?.([row.id]),
      hidden: (row) => row.status !== 'Completed'
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
      title="Testing History"
      className={className}
    />
  );
};

export default TestTable;
