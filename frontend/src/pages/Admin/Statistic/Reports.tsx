import React, {useState, useEffect} from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {ArrowDownTrayIcon, ArrowTrendingUpIcon, CalendarIcon, ChartBarIcon,} from '@heroicons/react/24/outline';
import { getAdminDashboard } from '../../../api/services/adminDashboardService';

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
    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminDashboard().then(data => {
            setDashboard(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!dashboard) return <div>No data</div>;

    // Metrics
    const metrics: Metric[] = [
        {
            title: 'Total Revenue',
            value: dashboard.totalRevenue.toLocaleString('vi-VN') + ' VND',
            change: (dashboard.growthRate > 0 ? '+' : '') + dashboard.growthRate + '%',
            isPositive: dashboard.growthRate >= 0,
            icon: ChartBarIcon,
        },
        {
            title: 'Appointments',
            value: dashboard.totalAppointments.toLocaleString('vi-VN'),
            change: '+8.2%', // Có thể tính toán thêm nếu muốn
            isPositive: true,
            icon: CalendarIcon,
        },
        {
            title: 'New Users',
            value: dashboard.userGrowthByMonth.reduce((sum: number, u: any) => sum + u.newUsers, 0).toLocaleString('vi-VN'),
            change: '+15.3%', // Có thể tính toán thêm nếu muốn
            isPositive: true,
            icon: ArrowTrendingUpIcon,
        },
    ];

    // Revenue chart data
    const revenueData = dashboard.appointmentsByMonth.map((item: any, idx: number) => ({
        month: `Th${item.month}`,
        revenue: dashboard.monthlyRevenue ? dashboard.monthlyRevenue[idx]?.revenue || 0 : 0,
        appointments: item.count,
        users: dashboard.userGrowthByMonth[idx]?.newUsers || 0,
    }));

    // Service distribution (nên lấy từ API riêng nếu có)
    const serviceDistribution = dashboard.serviceDistribution || [];

    const formatRevenue = (value: number) => {
        return `${(value / 1000000).toFixed(0)}M`;
    };

    return (
        <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Statistical Report</h1>
                <div className="flex space-x-4">
                    <select
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="7days">Last 7 days</option>
                        <option value="30days">Last 30 days</option>
                        <option value="6months">Last 6 months</option>
                        <option value="1year">Last 1 year</option>
                    </select>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2"/>
                        Export Report
                    </button>
                </div>
            </div>

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
                                    <span className="text-gray-500 text-sm ml-2">vs. previous period</span>
                                </p>
                            </div>
                            <metric.icon className="h-8 w-8 text-gray-400"/>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Revenue Over Time</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis tickFormatter={formatRevenue}/>
                                <Tooltip formatter={(value: number) => [`${formatRevenue(value)} VNĐ`, 'Doanh thu']}/>
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

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Service Distribution</h2>
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
                                    {serviceDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Appointments by Month</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Bar dataKey="appointments" fill="#00C49F" name="Số lượt khám"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">User Growth</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
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

            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">Detailed Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Top Services</h3>
                        <ul className="mt-3 space-y-3">
                            {serviceDistribution.map((service: any, index: number) => (
                                <li key={index} className="flex justify-between">
                                    <span className="text-gray-600">{service.name}</span>
                                    <span className="font-medium">{service.value}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Activity Metrics</h3>
                        <ul className="mt-3 space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Satisfaction Rate</span>
                                <span className="font-medium text-green-600">95%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Return Rate</span>
                                <span className="font-medium text-blue-600">78%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Wait Time</span>
                                <span className="font-medium">15 mins</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Rating</span>
                                <span className="font-medium text-yellow-600">4.8/5</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">User Analysis</h3>
                        <ul className="mt-3 space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-600">New Users</span>
                                <span className="font-medium">+320</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Active Users</span>
                                <span className="font-medium">1,245</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Interactions/User</span>
                                <span className="font-medium">3.2</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Session Time</span>
                                <span className="font-medium">12:35</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">System Performance</h3>
                        <ul className="mt-3 space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Uptime</span>
                                <span className="font-medium text-green-600">99.9%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Response Time</span>
                                <span className="font-medium">0.8s</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">System Errors</span>
                                <span className="font-medium text-red-600">0.1%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Bandwidth</span>
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
