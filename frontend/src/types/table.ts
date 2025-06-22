import React from 'react';

export interface TableColumn<T = any> {
    key: string;
    label: React.ReactNode;
    render?: (row: T, index: number) => React.ReactNode;
    width?: string;
    headerClassName?: string;
    cellClassName?: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
}

export interface TableAction<T = any> {
    icon: React.ReactNode;
    label: string;
    onClick: (row: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: (row: T) => boolean;
    hidden?: (row: T) => boolean;
}

export interface TableProps<T = any> {
    columns: TableColumn<T>[];
    data: T[];
    actions?: TableAction<T>[];
    selectable?: boolean;
    selected?: number[] | string[];
    onSelectChange?: (selected: number[] | string[]) => void;
    onSelectAll?: (checked: boolean) => void;
    sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
    onSort?: (key: string) => void;
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
    hoverable?: boolean;
    striped?: boolean;
    compact?: boolean;
    variant?: 'default' | 'admin' | 'customer';
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage?: number;
    totalItems?: number;
    showInfo?: boolean;
}

export interface FilterBarProps {
    children: React.ReactNode;
    className?: string;
}

export interface ActionBarProps {
    selected: number[] | string[];
    actions: {
        label: string;
        icon?: React.ReactNode;
        onClick: (selected: number[] | string[]) => void;
        variant?: 'primary' | 'secondary' | 'danger';
        disabled?: boolean;
    }[];
    className?: string;
}
