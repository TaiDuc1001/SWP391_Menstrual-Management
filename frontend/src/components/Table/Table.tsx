import React from 'react';

interface TableColumn {
  key: string;
  label: React.ReactNode;
  render?: (row: any) => React.ReactNode;
  width?: string; 
  headerClassName?: string; 
  cellClassName?: string; 
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  children?: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ columns, data, children }) => (
  <div className="bg-white p-4 rounded shadow w-full">
    <table className="w-full table-fixed">
      <colgroup>
        {columns.map((col, idx) => <col key={col.key} className={col.width} />)}
      </colgroup>
      <thead>
        <tr className="text-left text-pink-500">
          {columns.map(col => (
            <th key={col.key} className={`p-2 ${col.headerClassName || ''}`}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="p-4 text-center text-gray-400">No records found</td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="bg-white"
              style={{ zIndex: 0 }}
            >
              {columns.map((col, colIdx) => (
                <td
                  key={col.key}
                  className={`p-2 align-middle ${col.cellClassName || ''} border-r last:border-r-0 border-gray-100`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
        {children}
      </tbody>
    </table>
  </div>
);

export default Table;
