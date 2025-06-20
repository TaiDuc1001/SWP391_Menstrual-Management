import React from 'react';
import TableBase from '../BaseTable';
import {TableAction, TableColumn} from '../types';

interface CustomerTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  selectable?: boolean;
  selected?: number[] | string[];
  onSelectChange?: (selected: number[] | string[]) => void;
  onSelectAll?: (checked: boolean) => void;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  variant?: 'admin' | 'customer' | 'default';
  hoverable?: boolean;
  
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  
  // Header
  title?: string;
  headerActions?: React.ReactNode;
  
  className?: string;
}

const BaseTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  selectable = false,
  selected = [],
  onSelectChange,
  onSelectAll,
  sortConfig,
  onSort,
  loading = false,
  emptyMessage,
  
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  
  title,
  headerActions,
  
  className = ''
}: CustomerTableProps<T>) => {
  const showPagination = currentPage && totalPages && onPageChange && totalPages > 1;
  
  return (
    <div className={`bg-white rounded-lg shadow w-full ${className}`}>
      {/* Header */}
      {(title || headerActions) && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
            {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
          </div>
        </div>
      )}
      
      {/* Selection Bar */}
      {selectable && selected.length > 0 && (
        <div className="px-4 py-3 bg-pink-50 border-b border-pink-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-pink-700 font-medium">
              {selected.length} item{selected.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              {/* Add bulk action buttons here if needed */}
            </div>
          </div>
        </div>
      )}
      
      {/* BaseTable */}
      <div className="p-4">        <TableBase
          columns={columns}
          data={data}
          actions={actions}
          selectable={selectable}
          selected={selected}
          onSelectChange={onSelectChange}
          onSelectAll={onSelectAll}
          sortConfig={sortConfig}
          onSort={onSort}
          loading={loading}
          emptyMessage={emptyMessage}
          variant="customer"
          hoverable
        />
      </div>
      
      {/* Pagination */}
      {showPagination && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-400' 
                  : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              }`}
            >
              Prev
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 rounded font-semibold ${
                  currentPage === i + 1 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-200 text-gray-400' 
                  : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseTable;
