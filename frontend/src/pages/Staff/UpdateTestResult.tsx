import React, { useState } from 'react';
import StatusBadge from '../../components/Badge/StatusBadge';
import refreshIcon from '../../assets/icons/refresh.svg';
import searchIcon from '../../assets/icons/search.svg';
import FormUpdateTestResult from './FormUpdateTestResult';

const mockData = [
  {
    id: 'STXN-001',
    customer: 'Nguyễn Văn A',
    service: 'Xét nghiệm HIV',
    dueDate: '25/05/2025',
    status: 'pending',
  },
  {
    id: 'STXN-002',
    customer: 'Trần Thị B',
    service: 'HPV DNA',
    dueDate: '27/05/2025',
    status: 'processing',
  },
  {
    id: 'STXN-003',
    customer: 'Lê Minh C',
    service: 'Xét nghiệm máu tổng quát',
    dueDate: '28/05/2025',
    status: 'done',
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ cập nhật', color: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
  done: { label: 'Đã hoàn tất', color: 'bg-green-100 text-green-700' },
};

const UpdateTestResult: React.FC = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleOpenModal = (row: any) => {
    setSelectedRequest(row);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-lg font-bold mb-6">List of requests pending result updates</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-[400px]">
                <input
                  type="text"
                  placeholder="Search by request ID, customer name,..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400" />
                </span>
              </div>
              <select
                className="border border-gray-200 rounded-lg px-4 py-2 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="done">Done</option>
              </select>
              <button className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-5 h-10 rounded-lg transition shadow min-w-[120px]">
                <img src={refreshIcon} alt="refresh" className="w-5 h-5" />
                <span className="text-base">Refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-3 text-left font-semibold">Request ID</th>
                    <th className="p-3 text-left font-semibold">Customer Name</th>
                    <th className="p-3 text-left font-semibold">Test Service</th>
                    <th className="p-3 text-left font-semibold">Due Date</th>
                    <th className="p-3 text-left font-semibold">Status</th>
                    <th className="p-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row, idx) => (
                    <tr key={row.id} className="border-b last:border-b-0 hover:bg-blue-50/30 transition">
                      <td className="p-3 font-medium">{row.id}</td>
                      <td className="p-3">{row.customer}</td>
                      <td className="p-3">{row.service}</td>
                      <td className="p-3">{row.dueDate}</td>
                      <td className="p-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusMap[row.status].color}`}>{statusMap[row.status].label}</span>
                      </td>
                      <td className="p-3">
                        <button
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition
                            ${row.status === 'done' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                          disabled={row.status === 'done'}
                          onClick={() => handleOpenModal(row)}
                        >
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>Hiển thị 1-10 trên 1,245 yêu cầu</span>
              <div className="flex gap-1">
                <button className="px-2 py-1 rounded bg-gray-100 text-blue-700 font-bold">1</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
                <button className="px-2 py-1 rounded hover:bg-gray-100">3</button>
                <span className="px-2">...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {modalOpen && (
        <FormUpdateTestResult
          open={modalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
        />
      )}
    </div>
  );
};

export default UpdateTestResult;
