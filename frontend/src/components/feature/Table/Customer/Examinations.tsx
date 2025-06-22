import React from 'react';
import CustomerTable from './BaseTable';
import {TableAction, TableColumn} from '../types';
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
    onViewExaminationDetail?: (id: number) => void;
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

const Examinations: React.FC<TestTableProps> = ({
                                                    filteredRecords,
                                                    slotTimeMap,
                                                    selected,
                                                    onSelectChange,
                                                    onSelectAll,
                                                    hideRows,
                                                    onDeleteRows,
                                                    onViewRows,
                                                    onViewExaminationDetail,
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

    const columns: TableColumn<TestRecord>[] = [{
        key: 'date',
        label: 'Date',
        sortable: true,
        width: 'table-column-date'
    }, {
        key: 'slot',
        label: 'Time',
        sortable: true,
        width: 'table-column-date',
        render: (row) => slotTimeMap[row.slot] || row.time || ''
    },
        {
            key: 'panels',
            label: 'Test panels',
            sortable: true,
            width: 'w-56'
        }, {
            key: 'status',
            label: 'Status',
            sortable: true,
            width: 'table-column-status',
            align: 'center',
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (row) => <StatusBadge status={row.status}/>
        }
    ];
    const actions: TableAction<TestRecord>[] = [
        {
            icon: 'View Details',
            label: 'View Details',
            onClick: (row) => onViewExaminationDetail?.(row.id)
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
        <CustomerTable
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

export default Examinations;
