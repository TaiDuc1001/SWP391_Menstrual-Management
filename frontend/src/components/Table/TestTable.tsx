import React, { useState } from 'react';
import StatusBadge from '../Badge/StatusBadge';
import ViewResultButton from '../Button/ViewResultButton';
import eyeIcon from '../../assets/icons/eye.svg';
import trashBinIcon from '../../assets/icons/trash-bin.svg';
import Table from './Table';

interface TestRecord {
  id: number;
  date: string;
  slot: string;
  time?: string;
  panels: string;
  status: string;
}

interface TestTableProps {
  filteredRecords: TestRecord[];
  slotTimeMap: { [key: string]: string };
  selected: number[];
  handleCheckboxChange: (id: number) => void;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hideRows: number[];
  onDeleteRows?: (ids: number[]) => void;
  onViewRows?: (ids: number[]) => void;
  currentPage?: number;
  testsPerPage?: number;
}

const TestTable: React.FC<TestTableProps> = ({
  filteredRecords, slotTimeMap, selected, handleCheckboxChange, handleSelectAll, hideRows, onDeleteRows, onViewRows, currentPage = 1, testsPerPage = 5
}) => {
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const visibleRecords = filteredRecords.filter(record => !hideRows.includes(record.id));
  const visibleSelected = selected.filter(id => visibleRecords.some(r => r.id === id));
  const completedSelected = visibleSelected.filter(id => {
    const rec = visibleRecords.find(r => r.id === id);
    return rec && rec.status === 'Completed';
  });

  // Sorting logic
  const sortedRecords = React.useMemo(() => {
    if (!sortConfig) return visibleRecords;
    const sorted = [...visibleRecords];
    sorted.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';
      switch (sortConfig.key) {
        case 'date':
          aValue = a.date;
          bValue = b.date;
          break;
        case 'slot':
          aValue = slotTimeMap[a.slot] || '';
          bValue = slotTimeMap[b.slot] || '';
          break;
        case 'panels':
          aValue = a.panels;
          bValue = b.panels;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = '';
          bValue = '';
      }
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
    return sorted;
  }, [visibleRecords, sortConfig, slotTimeMap]);

  // Paging logic (after sorting)
  const startIdx = (currentPage - 1) * testsPerPage;
  const endIdx = startIdx + testsPerPage;
  const pagedRecords = sortedRecords.slice(startIdx, endIdx);

  // Sort handler
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const columns = [
    {
      key: 'select',
      label: <input type="checkbox" checked={visibleRecords.length > 0 && visibleSelected.length === visibleRecords.length} onChange={handleSelectAll} />,
      render: (row: TestRecord) => (
        <input type="checkbox" checked={visibleSelected.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} />
      ),
      width: 'w-8',
    },
    { key: 'date', label: <button type="button" className="flex items-center gap-1" onClick={() => handleSort('date')}>Date {getSortIndicator('date')}</button>, width: 'w-32' },
    { key: 'slot', label: <button type="button" className="flex items-center gap-1" onClick={() => handleSort('slot')}>Time {getSortIndicator('slot')}</button>, render: (row: TestRecord) => slotTimeMap[row.slot] || row.time || '', width: 'w-32' },
    { key: 'panels', label: <button type="button" className="flex items-center gap-1" onClick={() => handleSort('panels')}>Test panels {getSortIndicator('panels')}</button>, width: 'w-56' },
    { key: 'status', label: <button type="button" className="flex items-center gap-1 justify-center w-full text-center" onClick={() => handleSort('status')}>Status {getSortIndicator('status')}</button>, render: (row: TestRecord) => <StatusBadge status={row.status} />, width: 'w-32', headerClassName: 'text-center', cellClassName: 'text-center' },
    { key: 'actions', label: '', render: (row: TestRecord) => row.status === 'Completed' ? <ViewResultButton onClick={() => onViewRows && onViewRows([row.id])} /> : null, width: 'w-16' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Testing history</h2>
        <div className="flex items-center gap-2">
          <div className={visibleSelected.length > 0 ? 'flex items-center gap-2' : 'invisible flex items-center gap-2'}>
            <input type="checkbox" checked={visibleSelected.length > 0} readOnly />
            <span className="font-medium">{visibleSelected.length} selected</span>
          </div>
          <button
            className={`p-2 rounded hover:bg-gray-100 ${completedSelected.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={() => {
              if (onViewRows && completedSelected.length > 0) {
                onViewRows(completedSelected);
              }
            }}
            disabled={completedSelected.length === 0}
            style={{ opacity: visibleSelected.length > 0 ? 1 : 0.5 }}
            tabIndex={0}
          >
            <img src={eyeIcon} alt="View" className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded hover:bg-red-100"
            onClick={() => {
              if (onDeleteRows && visibleSelected.length > 0) {
                onDeleteRows(visibleSelected);
              }
            }}
            disabled={visibleSelected.length === 0}
            style={{ opacity: visibleSelected.length > 0 ? 1 : 0.5 }}
          >
            <img src={trashBinIcon} alt="Delete" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <Table columns={columns} data={pagedRecords} />
    </div>
  );
};

export default TestTable;
