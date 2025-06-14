import React from 'react';
import { FaUser, FaStethoscope, FaCalendarAlt, FaFlask, FaDollarSign, FaChartLine } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const stats = [
  { icon: FaUser, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Người dùng', value: 1200 },
  { icon: FaStethoscope, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Bác sĩ', value: 35 },
  { icon: FaCalendarAlt, color: 'text-yellow-500', bgColor: 'bg-yellow-100', label: 'Lịch hẹn', value: 210 },
  { icon: FaFlask, color: 'text-pink-500', bgColor: 'bg-pink-100', label: 'Dịch vụ xét nghiệm', value: 18 },
  { icon: FaDollarSign, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Doanh thu tháng', value: '120M' },
  { icon: FaChartLine, color: 'text-indigo-500', bgColor: 'bg-indigo-100', label: 'Tăng trưởng', value: '+15%' },
];

const revenueData = [
  { month: 'T1', revenue: 65 },
  { month: 'T2', revenue: 72 },
  { month: 'T3', revenue: 80 },
  { month: 'T4', revenue: 95 },
  { month: 'T5', revenue: 88 },
  { month: 'T6', revenue: 120 },
];

const serviceData = [
  { name: 'Xét nghiệm HPV', value: 35 },
  { name: 'Tư vấn sức khỏe', value: 25 },
  { name: 'Khám phụ khoa', value: 20 },
  { name: 'Siêu âm', value: 15 },
  { name: 'Dịch vụ khác', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const recentActivities = [
  { time: '10:30', action: 'Lịch hẹn mới từ Nguyễn Văn A', type: 'appointment' },
  { time: '09:15', action: 'Bác sĩ Trần B đã hoàn thành ca khám', type: 'exam' },
  { time: '08:45', action: 'Cập nhật thông tin dịch vụ xét nghiệm', type: 'service' },
  { time: '08:00', action: 'Báo cáo doanh thu ngày đã được tạo', type: 'report' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tổng quan hệ thống</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Tạo báo cáo
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-white rounded-xl shadow-sm p-6 flex flex-col items-center ${stat.bgColor} border border-gray-100`}>
            {React.createElement(stat.icon as React.ElementType, { className: `${stat.color} text-3xl mb-2` })}
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
            <div className="text-gray-600 mt-1 text-sm text-center">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Biểu đồ doanh thu</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Phân bố dịch vụ</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex-shrink-0 w-16 text-sm text-gray-500">{activity.time}</div>
                <div className="flex-grow">
                  <p className="text-gray-800">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 text-center">
            Xem tất cả hoạt động
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Thông báo hệ thống</h2>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
              <p className="text-yellow-800">Có 3 tài khoản chờ duyệt</p>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-blue-800">2 dịch vụ sắp hết hạn khuyến mãi</p>
            </div>
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-red-800">Hệ thống sẽ bảo trì vào 23:00 hôm nay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
