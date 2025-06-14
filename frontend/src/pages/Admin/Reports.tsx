import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  CalendarIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

// Mock data cho biểu đồ
const revenueData = [
  { month: 'T1', revenue: 120000000, appointments: 150, users: 800 },
  { month: 'T2', revenue: 150000000, appointments: 180, users: 950 },
  { month: 'T3', revenue: 180000000, appointments: 220, users: 1100 },
  { month: 'T4', revenue: 160000000, appointments: 190, users: 1300 },
  { month: 'T5', revenue: 200000000, appointments: 250, users: 1500 },
  { month: 'T6', revenue: 250000000, appointments: 300, users: 1800 },
];

const serviceDistribution = [
  { name: 'Khám phụ khoa', value: 35 },
  { name: 'Xét nghiệm', value: 25 },
  { name: 'Tư vấn', value: 20 },
  { name: 'Siêu âm', value: 15 },
  { name: 'Khác', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Metric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
}

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  const metrics: Metric[] = [
    {
      title: 'Tổng doanh thu',
      value: '1.06 Tỷ VNĐ',
      change: '+12.5%',
      isPositive: true,
      icon: ChartBarIcon,
    },
    {
      title: 'Số lượt khám',
      value: '1,290',
      change: '+8.2%',
      isPositive: true,
      icon: CalendarIcon,
    },
    {
      title: 'Người dùng mới',
      value: '1,800',
      change: '+15.3%',
      isPositive: true,
      icon: ArrowTrendingUpIcon,
    },
  ];

  const formatRevenue = (value: number) => {
    return `${(value / 1000000).toFixed(0)}M`;
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Báo cáo thống kê</h1>
        <div className="flex space-x-4">
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="6months">6 tháng qua</option>
            <option value="1year">1 năm qua</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                <p className={`flex items-center mt-1 ${
                  metric.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                  <span className="text-gray-500 text-sm ml-2">vs. kỳ trước</span>
                </p>
              </div>
              <metric.icon className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Doanh thu theo thời gian</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={formatRevenue} />
                <Tooltip formatter={(value: number) => [`${formatRevenue(value)} VNĐ`, 'Doanh thu']} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Phân bố dịch vụ</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {serviceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Số lượt khám theo tháng</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#00C49F" name="Số lượt khám" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Tăng trưởng người dùng</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#0088FE"
                  fill="#0088FE"
                  fillOpacity={0.3}
                  name="Số người dùng"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Thống kê chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Top dịch vụ</h3>
            <ul className="mt-3 space-y-3">
              {serviceDistribution.map((service, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-600">{service.name}</span>
                  <span className="font-medium">{service.value}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Chỉ số hoạt động</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">Tỷ lệ hài lòng</span>
                <span className="font-medium text-green-600">95%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Tỷ lệ quay lại</span>
                <span className="font-medium text-blue-600">78%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Thời gian chờ TB</span>
                <span className="font-medium">15 phút</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Đánh giá TB</span>
                <span className="font-medium text-yellow-600">4.8/5</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Phân tích người dùng</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">Người dùng mới</span>
                <span className="font-medium">+320</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Người dùng hoạt động</span>
                <span className="font-medium">1,245</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Tương tác TB/người</span>
                <span className="font-medium">3.2</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Thời gian TB/phiên</span>
                <span className="font-medium">12:35</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Hiệu suất hệ thống</h3>
            <ul className="mt-3 space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-600">Uptime</span>
                <span className="font-medium text-green-600">99.9%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Thời gian phản hồi</span>
                <span className="font-medium">0.8s</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Lỗi hệ thống</span>
                <span className="font-medium text-red-600">0.1%</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Băng thông</span>
                <span className="font-medium">85%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
