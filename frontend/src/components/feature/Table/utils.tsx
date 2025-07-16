import React from 'react';
import {TableAction} from './types';

export const getStatusBadgeClass = (status: string, variant: 'admin' | 'customer' = 'admin') => {
    const baseClass = 'status-badge-base';

    switch (status.toLowerCase()) {
        case 'active':
        case 'completed':
        case 'published':
        case 'in progress':
            return `${baseClass} status-badge-active`;
        case 'pending':
        case 'waiting':
        case 'draft':
            return `${baseClass} status-badge-pending`;
        case 'cancelled':
        case 'stopped':
        case 'locked':
        case 'inactive':
            return `${baseClass} status-badge-cancelled`;
        case 'confirmed':
        case 'booked':
            return `${baseClass} status-badge-confirmed`;
        default:
            return `${baseClass} status-badge-default`;
    }
};


export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (format === 'long') {
        return dateObj.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return dateObj.toLocaleDateString('en-GB');
};


export const createViewAction = <T extends Record<string, any>>(onClick: (row: T) => void): TableAction<T> => ({
    icon: <i className="fas fa-eye table-action-view"></i>,
    label: 'View',
    onClick
});

export const createEditAction = <T extends Record<string, any>>(onClick: (row: T) => void): TableAction<T> => ({
    icon: <i className="fas fa-edit table-action-edit"></i>,
    label: 'Edit',
    onClick
});

export const createDeleteAction = <T extends Record<string, any>>(onClick: (row: T) => void): TableAction<T> => ({
    icon: <i className="fas fa-trash table-action-delete"></i>,
    label: 'Delete',
    onClick,
    variant: 'danger'
});


export const createBulkActions = <T extends Record<string, any>>(actions: {
    onDelete?: (ids: number[]) => void;
    onExport?: (ids: number[]) => void;
    onBulkEdit?: (ids: number[]) => void;
}) => {
    const bulkActions: Array<{
        label: string;
        icon: React.ReactNode;
        variant: 'primary' | 'secondary' | 'danger';
        onClick: (ids: number[]) => void;
    }> = [];

    if (actions.onDelete) {
        bulkActions.push({
            label: 'Delete Selected',
            icon: <i className="fas fa-trash"></i>,
            variant: 'danger' as const,
            onClick: actions.onDelete
        });
    }

    if (actions.onExport) {
        bulkActions.push({
            label: 'Export Selected',
            icon: <i className="fas fa-download"></i>,
            variant: 'secondary' as const,
            onClick: actions.onExport
        });
    }

    if (actions.onBulkEdit) {
        bulkActions.push({
            label: 'Bulk Edit',
            icon: <i className="fas fa-edit"></i>,
            variant: 'primary' as const,
            onClick: actions.onBulkEdit
        });
    }

    return bulkActions;
};


export const searchInObject = <T extends Record<string, any>>(obj: T, searchTerm: string): boolean => {
    const searchLower = searchTerm.toLowerCase();

    return Object.values(obj as any).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
    });
};

export const searchInFields = <T extends Record<string, any>>(obj: T, searchTerm: string, fields: (keyof T)[]): boolean => {
    const searchLower = searchTerm.toLowerCase();

    return fields.some(field => {
        const value = obj[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
    });
};

