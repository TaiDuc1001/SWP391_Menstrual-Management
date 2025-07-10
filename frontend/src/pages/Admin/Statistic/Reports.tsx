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
import { FaChartLine, FaStethoscope } from 'react-icons/fa';
import {ArrowDownTrayIcon, ArrowTrendingUpIcon, CalendarIcon, ChartBarIcon,} from '@heroicons/react/24/outline';
import { getAdminDashboard } from '../../../api/services/adminDashboardService';

// Wrapper giống Dashboard
import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  className?: string;
}
const IconWrapper = ({ icon, className }: IconWrapperProps) => {
  // react-icons IconType is a function that returns JSX.Element
  // TypeScript sometimes fails to infer, so cast to any
  const IconComponent = icon as any;
  return IconComponent ? <IconComponent className={className} /> : null;
};

// Màu giống Dashboard
const DASHBOARD_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
    const [revenueData, setRevenueData] = useState<{month: string, revenue: number}[]>([]);
    const [serviceDistribution, setServiceDistribution] = useState<any[]>([]);
    const [appointmentsData, setAppointmentsData] = useState<{month: string, appointments: number}[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<{month: string, users: number}[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [dashboardRes, monthlyRevenue, serviceDist] = await Promise.all([
                    (await import('../../../api/services/dashboardService')).getAdminDashboardData(),
                    (await import('../../../api/services/adminDashboardService')).getAdminMonthlyRevenue(new Date().getFullYear()),
                    (await import('../../../api/services/adminDashboardService')).getAdminServiceDistribution(),
                ]);
                setDashboard(dashboardRes);
                // Chuẩn hóa dữ liệu 12 tháng cho revenue
                const revenueArr = Array.from({ length: 12 }, (_, i) => {
                    const found = (monthlyRevenue as any[]).find((item) => item.month === i + 1);
                    return {
                        month: monthLabels[i],
                        revenue: found ? found.revenue : 0
                    };
                });
                setRevenueData(revenueArr);
                setServiceDistribution(serviceDist as any[]);
                // Chuẩn hóa dữ liệu 12 tháng cho Appointments
                const appointmentsArr = Array.from({ length: 12 }, (_, i) => {
                    const found = dashboardRes.appointmentsByMonth?.find((item: any) => item.month === i + 1);
                    return {
                        month: monthLabels[i],
                        appointments: found ? found.count : 0
                    };
                });
                setAppointmentsData(appointmentsArr);
                // Chuẩn hóa dữ liệu 12 tháng cho User Growth
                const userGrowthArr = Array.from({ length: 12 }, (_, i) => {
                    const found = dashboardRes.userGrowthByMonth?.find((item: any) => item.month === i + 1);
                    return {
                        month: monthLabels[i],
                        users: found ? found.newUsers : 0
                    };
                });
                setUserGrowthData(userGrowthArr);
            } catch (err) {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!dashboard) return <div>No data</div>;

    // Tính phần trăm thay đổi động cho Appointments và New Users
    const getPercentChange = (current: number, prev: number) => {
        if (prev === 0) return current === 0 ? 0 : 100;
        return ((current - prev) / prev * 100);
    };

    // Lấy tháng hiện tại (theo dữ liệu)
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentApp = dashboard.appointmentsByMonth?.find((a: any) => a.month === currentMonth)?.count || 0;
    const prevApp = dashboard.appointmentsByMonth?.find((a: any) => a.month === currentMonth - 1)?.count || 0;
    const appPercent = getPercentChange(currentApp, prevApp);

    // Lấy từ userGrowthData đã chuẩn hóa để không bị mất tháng
    const currentUser = userGrowthData[currentMonth - 1]?.users || 0;
    const prevUser = userGrowthData[currentMonth - 2]?.users || 0;
    const userPercent = getPercentChange(currentUser, prevUser);

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
            change: (appPercent > 0 ? '+' : '') + appPercent.toFixed(1) + '%',
            isPositive: appPercent >= 0,
            icon: CalendarIcon,
        },
        {
            title: 'New Users',
            value: userGrowthData.reduce((sum, u) => sum + u.users, 0).toLocaleString('vi-VN'),
            change: (userPercent > 0 ? '+' : '') + userPercent.toFixed(1) + '%',
            isPositive: userPercent >= 0,
            icon: ArrowTrendingUpIcon,
        },
    ];


    // Revenue chart data for extra charts (appointments, users)
    const revenueExtraData = dashboard.appointmentsByMonth.map((item: any, idx: number) => ({
        month: monthLabels[item.month - 1],
        revenue: dashboard.monthlyRevenue ? dashboard.monthlyRevenue[idx]?.revenue || 0 : 0,
        appointments: item.count,
        users: dashboard.userGrowthByMonth[idx]?.newUsers || 0,
    }));

    // Format tiền giống Dashboard (VND, có dấu phẩy)
    const formatRevenue = (value: number) => {
        if (typeof value !== 'number' || isNaN(value)) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Revenue Trend Chart (Dashboard style) */}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                        <IconWrapper icon={FaChartLine} className="mr-2 text-blue-600" /> Revenue Trend
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#64748b" interval={0} />
                                <YAxis stroke="#64748b" tickFormatter={(v) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(v))} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
                                    formatter={(value: number) => [formatRevenue(Number(value)), 'Doanh thu']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Distribution Chart (Dashboard style) */}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                        <IconWrapper icon={FaStethoscope} className="mr-2 text-blue-600" /> Service Distribution
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {serviceDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={DASHBOARD_COLORS[index % DASHBOARD_COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Appointments by Month</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={appointmentsData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month" interval={0}/>
                                <YAxis allowDecimals={false}/>
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
                            <AreaChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month" interval={0}/>
                                <YAxis allowDecimals={false}/>
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
                                <span className="font-medium text-green-600">{dashboard.satisfactionRate}%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Return Rate</span>
                                <span className="font-medium text-blue-600">{dashboard.returnRate}%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Wait Time</span>
                                <span className="font-medium">{dashboard.avgWaitTime} mins</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Rating</span>
                                <span className="font-medium text-yellow-600">{dashboard.avgRating}/5</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">User Analysis</h3>
                        <ul className="mt-3 space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-600">New Users</span>
                                <span className="font-medium">+{userGrowthData.reduce((sum, u) => sum + u.users, 0)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Active Users</span>
                                <span className="font-medium">{dashboard.activeUsers.toLocaleString('vi-VN')}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Interactions/User</span>
                                <span className="font-medium">{dashboard.avgInteractionsPerUser}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Avg. Session Time</span>
                                <span className="font-medium">{dashboard.avgSessionTime}</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">System Performance</h3>
                        <ul className="mt-3 space-y-3">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Uptime</span>
                                <span className="font-medium text-green-600">{dashboard.uptime}%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Response Time</span>
                                <span className="font-medium">{dashboard.responseTime}s</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">System Errors</span>
                                <span className="font-medium text-red-600">{dashboard.systemErrors}%</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Bandwidth</span>
                                <span className="font-medium">{dashboard.bandwidth}%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
