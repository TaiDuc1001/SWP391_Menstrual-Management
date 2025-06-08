import React from 'react';
import StatusBadge from '../Badge/StatusBadge';
import ViewResultButton from '../Button/ViewResultButton';
import eyeIcon from '../../assets/icons/eye.svg';
import trashBinIcon from '../../assets/icons/trash-bin.svg';
import Table from './Table';

interface TestRecord {
  id: number;
  date: string;
  slot: string;
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
}

const TestTable: React.FC<TestTableProps> = ({
  filteredRecords, slotTimeMap, selected, handleCheckboxChange, handleSelectAll, hideRows, onDeleteRows, onViewRows
}) => {
  const visibleRecords = filteredRecords.filter(record => !hideRows.includes(record.id));
  const visibleSelected = selected.filter(id => visibleRecords.some(r => r.id === id));
  const completedSelected = visibleSelected.filter(id => {
    const rec = visibleRecords.find(r => r.id === id);
    return rec && rec.status === 'Completed';
  });

  const columns = [
    {
      key: 'select',
      label: <input type="checkbox" checked={visibleRecords.length > 0 && visibleSelected.length === visibleRecords.length} onChange={handleSelectAll} />,
      render: (row: TestRecord) => (
        <input type="checkbox" checked={visibleSelected.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} />
      ),
      width: 'w-8',
    },
    { key: 'date', label: 'Date', width: 'w-32' },
    { key: 'slot', label: 'Time', render: (row: TestRecord) => slotTimeMap[row.slot], width: 'w-32' },
    { key: 'panels', label: 'Test panels', width: 'w-56' },
    { key: 'status', label: 'Status', render: (row: TestRecord) => <StatusBadge status={row.status} />, width: 'w-32', headerClassName: 'text-center', cellClassName: 'text-center' },
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
      <Table columns={columns} data={visibleRecords} />
    </div>
  );
};

export default TestTable;
