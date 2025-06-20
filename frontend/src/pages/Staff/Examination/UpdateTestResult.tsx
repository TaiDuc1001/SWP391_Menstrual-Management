import React, {useEffect, useState} from 'react';
import StatusBadge from '../../components/common/Badge/StatusBadge';
import refreshIcon from '../../assets/icons/refresh.svg';
import searchIcon from '../../assets/icons/search.svg';
import FormUpdateTestResult from './Examination/FormUpdateTestResult';
import axios from 'axios';

interface Examination {
  id: number;
  date: string;
  timeRange: string;
  examinationStatus: string;
  panelName: string;
  customerName: string;
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'SAMPLED':
      return 'Sampled';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'EXAMINED':
      return 'Examined';
    case 'CANCELLED':
      return 'Cancelled';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status;
  }
};

const UpdateTestResult: React.FC = () => {
  const [data, setData] = useState<Examination[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Examination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const res = await axios.get<Examination[]>('http://localhost:8080/api/examinations');
      setData(res.data);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (row: Examination) => {
    setSelectedRequest(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const handleSampled = async (id: number) => {
    try {
      await axios.put(`http://localhost:8080/api/examinations/sampled/${id}`);
      fetchData();
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const filteredData = data.filter(item =>
    item.examinationStatus !== 'CANCELLED' &&
    item.examinationStatus !== 'COMPLETED' &&
    (!status || item.examinationStatus.toLowerCase() === status.toLowerCase()) &&
    (item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.panelName.toLowerCase().includes(search.toLowerCase()) ||
      String(item.id).toLowerCase().includes(search.toLowerCase()))
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-6xl">
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-lg font-bold mb-6">Danh sách yêu cầu cần cập nhật kết quả</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-[400px]">
                <input
                  type="text"
                  placeholder="Tìm theo mã, tên khách hàng, dịch vụ..."
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
                <option value="">All status</option>
                <option value="SAMPLED">Sampled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="EXAMINED">Examined</option>
              </select>              
              <button
                onClick={fetchData}
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-5 h-10 rounded-lg transition shadow min-w-[120px]"
              >
                <img src={refreshIcon} alt="refresh" className="w-5 h-5" />
                <span className="text-base">Refresh</span>
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="p-3 text-left font-semibold">Request ID</th>
                    <th className="p-3 text-left font-semibold">Customer</th>
                    <th className="p-3 text-left font-semibold">Test Package</th>
                    <th className="p-3 text-left font-semibold">Appointment Date</th>
                    <th className="p-3 text-left font-semibold">Time</th>
                    <th className="p-3 text-left font-semibold">Status</th>
                    <th className="p-3 text-left font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(row => (
                    <tr key={row.id} className="border-b last:border-b-0 hover:bg-blue-50/30 transition">
                      <td className="p-3 font-medium">EXM-{row.id.toString().padStart(4, '0')}</td>
                      <td className="p-3">{row.customerName}</td>
                      <td className="p-3">{row.panelName}</td>
                      <td className="p-3">{row.date}</td>
                      <td className="p-3">{row.timeRange}</td>
                      <td className="p-3">
                        <StatusBadge status={getStatusLabel(row.examinationStatus)} />
                      </td>
                      <td className="p-3">
                        {row.examinationStatus === 'IN_PROGRESS' ? (
                          <button
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition"
                            onClick={() => handleSampled(row.id)}
                          >
                            Sampled
                          </button>
                        ) : row.examinationStatus === 'SAMPLED' ? (
                          <button
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow bg-green-500 text-white hover:bg-green-600 transition"
                            onClick={() => handleOpenModal(row)}
                          >
                            Update
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center p-6 text-gray-400">
                        Không có dữ liệu phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 border-t">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && selectedRequest && (
        <FormUpdateTestResult
          open={modalOpen}
          onClose={handleCloseModal}
          request={selectedRequest}
          onUpdateSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default UpdateTestResult;
