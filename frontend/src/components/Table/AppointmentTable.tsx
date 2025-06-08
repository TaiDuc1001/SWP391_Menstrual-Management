import React from 'react';
import StatusBadge from '../Badge/StatusBadge';
import Table from './Table';
import ViewResultButton from '../Button/ViewResultButton';
import eyeIcon from '../../assets/icons/eye.svg';
import trashBinIcon from '../../assets/icons/trash-bin.svg';

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
  const visibleSelected = selected.filter(id => visibleRecords.some(r => r.id === id));
  const completedSelected = visibleSelected.filter(id => {
    const rec = visibleRecords.find(r => r.id === id);
    return rec && rec.status === 'Completed';
  });

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
    { key: 'time', label: 'Time', width: 'w-24', render: (row: any) => row.slotTime || row.time },
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
          <div className={visibleSelected.length > 0 ? 'flex items-center gap-2' : 'invisible flex items-center gap-2'}>
            <input type="checkbox" checked={visibleSelected.length > 0} readOnly />
            <span className="font-medium">{visibleSelected.length} selected</span>
          </div>
          <button
            className={`p-2 rounded hover:bg-gray-100 ${completedSelected.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            onClick={() => {
              if (onCancelRows && completedSelected.length > 0) {
                onCancelRows(completedSelected);
              }
            }}
            disabled={completedSelected.length === 0}
            style={{ opacity: visibleSelected.length > 0 ? 1 : 0.5 }}
            tabIndex={0}
          >
            <img src={eyeIcon} alt="Hide" className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded hover:bg-red-100"
            onClick={() => {
              if (onCancelRows && visibleSelected.length > 0) {
                onCancelRows(visibleSelected);
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

export default AppointmentTable;
