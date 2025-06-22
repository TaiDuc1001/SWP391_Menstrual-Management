import React from 'react';
import {TableColumn, TableProps} from './types';
import Checkbox from '../../common/Checkbox/Checkbox';
import sortAscIcon from '../../../assets/icons/sort-asc.svg';
import sortDescIcon from '../../../assets/icons/sort-desc.svg';
import sortIcon from '../../../assets/icons/sort.svg';

const BaseTable = <T extends Record<string, any>>({
                                                      columns,
                                                      data,
                                                      actions = [],
                                                      selectable = false,
                                                      selected = [],
                                                      onSelectChange,
                                                      onSelectAll,
                                                      sortConfig,
                                                      onSort,
                                                      className = '',
                                                      emptyMessage = 'No data available',
                                                      loading = false,
                                                      hoverable = true,
                                                      striped = false,
                                                      compact = false,
                                                      variant = 'default'
                                                  }: TableProps<T>) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'admin':
                return {
                    container: 'bg-white rounded-2xl shadow',
                    table: 'min-w-full text-sm',
                    header: 'bg-gray-50 text-gray-700',
                    headerCell: 'p-3 text-left font-semibold',
                    row: hoverable ? 'border-b last:border-b-0 hover:bg-blue-50/30 transition' : 'border-b last:border-b-0',
                    cell: 'p-3'
                };
            case 'customer':
                return {
                    container: 'bg-white rounded-lg shadow',
                    table: 'min-w-full text-sm',
                    header: 'bg-pink-50 text-pink-700',
                    headerCell: 'p-2 text-left font-medium',
                    row: hoverable ? 'border-b border-gray-100 hover:bg-pink-50/30 transition' : 'border-b border-gray-100',
                    cell: 'p-2'
                };
            default:
                return {
                    container: 'bg-white rounded-lg shadow',
                    table: 'min-w-full text-sm',
                    header: 'bg-gray-50 text-gray-700',
                    headerCell: 'p-2 text-left font-medium',
                    row: hoverable ? 'hover:bg-gray-50 transition' : '',
                    cell: 'p-2'
                };
        }
    };

    const classes = getVariantClasses();

    const handleSelectAllChange = (checked: boolean) => {
        if (onSelectAll) {
            onSelectAll(checked);
        }
    };
    const handleRowSelectChange = (id: string | number) => {
        if (onSelectChange) {
            const currentSelected = selected as (string | number)[];
            const newSelected = currentSelected.includes(id)
                ? currentSelected.filter(item => item !== id)
                : [...currentSelected, id];
            onSelectChange(newSelected as any);
        }
    };

    const getSortIcon = (columnKey: string) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <img src={sortIcon} alt="Sort" className="w-4 h-4 opacity-50"/>;
        }
        return sortConfig.direction === 'asc'
            ? <img src={sortAscIcon} alt="Sort ascending" className="w-4 h-4"/>
            : <img src={sortDescIcon} alt="Sort descending" className="w-4 h-4"/>;
    };

    const renderCell = (column: TableColumn<T>, row: T, index: number) => {
        const value = column.render ? column.render(row, index) : row[column.key];
        const alignClass = column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left';

        return (
            <td
                key={column.key}
                className={`${classes.cell} ${alignClass} ${column.cellClassName || ''}`}
                style={{width: column.width}}
            >
                {value}
            </td>
        );
    };
    const renderActions = (row: T) => {
        const visibleActions = actions.filter(action => !action.hidden?.(row));

        if (visibleActions.length === 0) return [null, null];

        const primaryActions = visibleActions.filter(action =>
            action.variant !== 'danger' && !action.label.toLowerCase().includes('cancel')
        );
        const cancelAction = visibleActions.find(action =>
            action.variant === 'danger' || action.label.toLowerCase().includes('cancel')
        );
        const primaryCell = primaryActions.length > 0 ? (
            <td className={`${classes.cell} text-center`}>
                <div className="flex items-center justify-center gap-1">
                    {primaryActions.map((action, index) => {
                        const baseClasses = "table-action-button-primary";
                        let actionClasses = "";

                        if (action.label.toLowerCase().includes('checkout')) {
                            actionClasses = "table-action-checkout";
                        } else if (action.label.toLowerCase().includes('view')) {
                            actionClasses = "table-action-view";
                        } else if (action.label.toLowerCase().includes('confirm')) {
                            actionClasses = "table-action-confirm";
                        } else if (action.label.toLowerCase().includes('join')) {
                            actionClasses = "table-action-join";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => action.onClick(row)}
                                disabled={action.disabled?.(row)}
                                title={action.label}
                                className={`${baseClasses} ${actionClasses}`}
                            >
                                {action.icon}
                            </button>
                        );
                    })}
                </div>
            </td>
        ) : <td className={`${classes.cell} text-center`}></td>;
        const cancelCell = cancelAction ? (
            <td className={`${classes.cell} text-center`}>
                <button
                    onClick={() => cancelAction.onClick(row)}
                    disabled={cancelAction.disabled?.(row)}
                    title={cancelAction.label}
                    className="table-action-button-secondary table-action-cancel"
                >
                    {cancelAction.icon}
                </button>
            </td>
        ) : <td className={`${classes.cell} text-center`}></td>;

        return [primaryCell, cancelCell];
    };

    if (loading) {
        return (
            <div className={`${classes.container} p-8 ${className}`}>
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${classes.container} overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className={`${classes.table} table-fixed`}>
                    <thead>
                    <tr className={classes.header}>
                        {selectable && (
                            <th className={`${classes.headerCell} w-12`}>
                                <Checkbox
                                    checked={data.length > 0 && selected.length === data.length}
                                    indeterminate={selected.length > 0 && selected.length < data.length}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
                        )}
                        {columns.map(column => (
                            <th
                                key={column.key}
                                className={`${classes.headerCell} ${column.headerClassName || ''}`}
                                style={{width: column.width}}
                            >
                                <div
                                    className={`flex items-center gap-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                                    {column.label}
                                    {column.sortable && onSort && (
                                        <button
                                            onClick={() => onSort(column.key)}
                                            className="hover:opacity-75 transition-opacity"
                                        >
                                            {getSortIcon(column.key)}
                                        </button>
                                    )}
                                </div>
                            </th>))}
                        {actions.length > 0 && (
                            <>
                                <th className={`${classes.headerCell} table-column-action-primary text-center`}>
                                </th>
                                <th className={`${classes.headerCell} table-column-action-secondary text-center`}>
                                </th>
                            </>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 ? (<tr>
                            <td
                                colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 2 : 0)}
                                className={`${classes.cell} text-center text-gray-500 py-8`}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (data.map((row, index) => {
                            const rowId = row.id || index;
                            const currentSelected = selected as (string | number)[];
                            const isSelected = currentSelected.includes(rowId);

                            return (
                                <tr
                                    key={rowId}
                                    className={`${classes.row} ${isSelected ? 'bg-blue-50' : ''} ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}`}
                                >
                                    {selectable && (
                                        <td className={classes.cell}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => handleRowSelectChange(rowId)}
                                            />
                                        </td>)}
                                    {columns.map(column => renderCell(column, row, index))}
                                    {actions.length > 0 && renderActions(row).map((cell, idx) => cell && React.cloneElement(cell as React.ReactElement, {key: idx}))}
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BaseTable;
