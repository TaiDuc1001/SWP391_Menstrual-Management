import React from 'react';
import TableBase from '../BaseTable';
import Pagination from '../../../common/Pagination/Pagination';
import {TableAction, TableColumn} from '../types';

interface AdminTableProps<T = any> {
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

    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    itemsPerPage?: number;
    totalItems?: number;

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
                                                  }: AdminTableProps<T>) => {
    const showPagination = currentPage && totalPages && onPageChange && totalPages > 1;

    return (
        <div className={`bg-white rounded-2xl shadow w-full ${className}`}>
            {(title || headerActions) && (
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
                        {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
                    </div>
                </div>
            )}

            {selectable && selected.length > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 font-medium">
              {selected.length} item{selected.length > 1 ? 's' : ''} selected
            </span>
                        <div className="flex items-center gap-2">
                        </div>
                    </div>
                </div>
            )}
            <div className="p-6">
                <TableBase
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
                    variant="admin"
                    hoverable
                />
            </div>

            {showPagination && (
                <div className="px-6 py-4 border-t border-gray-100">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        showInfo
                    />
                </div>
            )}
        </div>
    );
};

export default BaseTable;
