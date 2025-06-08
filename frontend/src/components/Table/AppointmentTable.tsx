import React from 'react';
import StatusBadge from '../Badge/StatusBadge';
import Table from './Table';
import ViewResultButton from '../Button/ViewResultButton';

interface AppointmentRecord {
  id: number;
  date: string;
  time: string;
  doctor?: string;
  name?: string;
  status: string;
  code?: string;
}

interface AppointmentTableProps {
  records: AppointmentRecord[];
  selected: number[];
  handleCheckboxChange: (id: number) => void;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hideRows?: number[];
  onViewRows?: (ids: number[]) => void;
  onCancelRows?: (ids: number[]) => void;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({
  records, selected, handleCheckboxChange, handleSelectAll, hideRows = [], onViewRows, onCancelRows
}) => {
  const visibleRecords = records.filter(r => !hideRows.includes(r.id));
  const columns = [
    {
      key: 'select',
      label: <input type="checkbox" checked={visibleRecords.length > 0 && selected.length === visibleRecords.length} onChange={handleSelectAll} />,
      render: (row: AppointmentRecord) => (
        <input type="checkbox" checked={selected.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} />
      ),
      width: 'w-8',
    },
    { key: 'date', label: 'Date', width: 'w-32' },
    { key: 'time', label: 'Time', width: 'w-24' },
    { key: 'doctor', label: 'Doctor', width: 'w-48', render: (row: AppointmentRecord) => (
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-gray-300 block"></span>
        <span>{row.doctor || row.name}</span>
      </div>
    ) },
    { key: 'status', label: 'Status', render: (row: AppointmentRecord) => <StatusBadge status={row.status} />, width: 'w-32', headerClassName: 'text-center', cellClassName: 'text-center' },
    { key: 'actions', label: '', render: (row: AppointmentRecord) => (
      <div className="flex gap-2">
        {row.status === 'Completed' && (
          <ViewResultButton onClick={() => onViewRows && onViewRows([row.id])} />
        )}
        {row.status === 'Upcoming' && (
          <button className="text-red-500 hover:underline" onClick={() => onCancelRows && onCancelRows([row.id])}>Cancel</button>
        )}
      </div>
    ), width: 'w-32' },
  ];

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Appointment History</h2>
        <div className="flex items-center gap-2">
          <div className={selected.length > 0 ? 'flex items-center gap-2' : 'invisible flex items-center gap-2'}>
            <input type="checkbox" checked={selected.length > 0} readOnly />
            <span className="font-medium">{selected.length} selected</span>
          </div>
        </div>
      </div>
      <Table columns={columns} data={visibleRecords} />
    </div>
  );
};

export default AppointmentTable;
