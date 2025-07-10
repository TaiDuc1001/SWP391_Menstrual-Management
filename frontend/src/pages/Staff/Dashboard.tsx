import React, { useEffect, useState } from 'react';
import { staffDashboardService } from '../../api/services/staffDashboardService';
import StatusBadge from '../../components/common/Badge/StatusBadge';
import { useNavigate } from 'react-router-dom';

interface Examination {
  id: number;
  date: string;
  timeRange: string;
  examinationStatus: string;
  panelName: string;
  customerName: string;
}

const statusMap = {
  SAMPLED: 'Sampled',
  IN_PROGRESS: 'In Progress',
  EXAMINED: 'Examined',
  COMPLETED: 'Completed',
};

const Dashboard: React.FC = () => {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await staffDashboardService.getAllExaminations();
        setExaminations(res.data || []);
      } catch (e) {
        setExaminations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Quick statistics
  const total = examinations.length;
  const sampled = examinations.filter(e => e.examinationStatus === 'SAMPLED').length;
  const inProgress = examinations.filter(e => e.examinationStatus === 'IN_PROGRESS').length;
  const examined = examinations.filter(e => e.examinationStatus === 'EXAMINED').length;
  const completed = examinations.filter(e => e.examinationStatus === 'COMPLETED').length;

  // Get 5 latest samples
  const latest = [...examinations].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">Staff Dashboard</h1>
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-600">{total}</span>
            <span className="text-gray-500 mt-2 text-sm">Total Samples</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-green-600">{sampled}</span>
            <span className="text-gray-500 mt-2 text-sm">Sampled</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-yellow-600">{inProgress}</span>
            <span className="text-gray-500 mt-2 text-sm">In Progress</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-purple-600">{examined + completed}</span>
            <span className="text-gray-500 mt-2 text-sm">Examined/Completed</span>
          </div>
        </div>

        {/* Latest samples */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Latest Samples</h2>
            <button
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
              onClick={() => navigate('/staff/examinations')}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="p-3 text-left font-semibold">ID</th>
                  <th className="p-3 text-left font-semibold">Customer</th>
                  <th className="p-3 text-left font-semibold">Panel</th>
                  <th className="p-3 text-left font-semibold">Date</th>
                  <th className="p-3 text-left font-semibold">Time</th>
                  <th className="p-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center p-6 text-gray-400">Loading...</td></tr>
                ) : latest.length === 0 ? (
                  <tr><td colSpan={6} className="text-center p-6 text-gray-400">No data</td></tr>
                ) : latest.map(row => (
                  <tr key={row.id} className="border-b last:border-b-0 hover:bg-blue-50/30 transition">
                    <td className="p-3 font-medium">EXM-{row.id.toString().padStart(4, '0')}</td>
                    <td className="p-3">{row.customerName}</td>
                    <td className="p-3">{row.panelName}</td>
                    <td className="p-3">{row.date}</td>
                    <td className="p-3">{row.timeRange}</td>
                    <td className="p-3"><StatusBadge status={statusMap[row.examinationStatus as keyof typeof statusMap] || row.examinationStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
      </div>
    </div>
  );
};

export default Dashboard;
