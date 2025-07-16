import React, {useState, useEffect, useRef} from 'react';
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
import {
  getAdminDashboard,
  getAdminMonthlyRevenue,
  getAdminServiceDistribution,
  getAdminDailyRevenue,
  getAdminDailyAppointments,
  getAdminDailyUserGrowth
} from '../../../api/services/adminDashboardService';
import { exportNodeToPDF } from '../../../utils/exportPdf';



import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  className?: string;
}
const IconWrapper = ({ icon, className }: IconWrapperProps) => {


  const IconComponent = icon as any;
  return IconComponent ? <IconComponent className={className} /> : null;
};

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
    const reportRef = useRef<HTMLDivElement>(null);


    const getFilteredData = (data: any[]) => {
        if (timeRange === '7days') {

            return data.slice(-7);
        } else if (timeRange === '30days') {

            return data.slice(-30);
        } else if (timeRange === '6months') {
            return data.slice(-6);
        } else if (timeRange === '1year') {
            return data;
        }
        return data;
    };
    const [dashboard, setDashboard] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [serviceDistribution, setServiceDistribution] = useState<any[]>([]);
    const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
    const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getDateRange = (days: number) => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - (days - 1));
      return {
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10)
      };
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          const [dashboardRes, serviceDist] = await Promise.all([
            getAdminDashboard(),
            getAdminServiceDistribution(),
          ]);
          setDashboard(dashboardRes);
          setServiceDistribution(serviceDist);

          if (timeRange === '7days' || timeRange === '30days') {
            const days = timeRange === '7days' ? 7 : 30;
            const { startDate, endDate } = getDateRange(days);

            const [dailyRevenue, dailyAppointments, dailyUserGrowth] = await Promise.all([
              getAdminDailyRevenue(startDate, endDate),
              getAdminDailyAppointments(startDate, endDate),
              getAdminDailyUserGrowth(startDate, endDate),
            ]);

            setRevenueData(dailyRevenue.map((item: any) => ({
              date: item.date,
              revenue: item.revenue
            })));

            setAppointmentsData(dailyAppointments.map((item: any) => ({
              date: item.date,
              appointments: item.count
            })));

            setUserGrowthData(dailyUserGrowth.map((item: any) => ({
              date: item.date,
              users: item.newUsers
            })));
          } else {

            const year = new Date().getFullYear();

            const monthlyRevenue = await getAdminMonthlyRevenue(year);
            setRevenueData(Array.from({ length: 12 }, (_, i) => {
              const found = (monthlyRevenue as any[]).find((item) => item.month === i + 1);
              return {
                month: monthLabels[i],
                revenue: found ? found.revenue : 0
              };
            }));

            setAppointmentsData(Array.from({ length: 12 }, (_, i) => {
              const found = dashboardRes.appointmentsByMonth?.find((item: any) => item.month === i + 1);
              return {
                month: monthLabels[i],
                appointments: found ? found.count : 0
              };
            }));

            setUserGrowthData(Array.from({ length: 12 }, (_, i) => {
              const found = dashboardRes.userGrowthByMonth?.find((item: any) => item.month === i + 1);
              return {
                month: monthLabels[i],
                users: found ? found.newUsers : 0
              };
            }));
          }
        } catch (err) {
          setError('Failed to load dashboard data.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [timeRange]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!dashboard) return <div>No data</div>;

    const getPercentChange = (current: number, prev: number) => {
        if (prev === 0) return current === 0 ? 0 : 100;
        return ((current - prev) / prev * 100);
    };

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentApp = dashboard.appointmentsByMonth?.find((a: any) => a.month === currentMonth)?.count || 0;
    const prevApp = dashboard.appointmentsByMonth?.find((a: any) => a.month === currentMonth - 1)?.count || 0;
    const appPercent = getPercentChange(currentApp, prevApp);

    const currentUser = userGrowthData[currentMonth - 1]?.users || 0;
    const prevUser = userGrowthData[currentMonth - 2]?.users || 0;
    const userPercent = getPercentChange(currentUser, prevUser);

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

    const xAxisKey = timeRange === '7days' || timeRange === '30days' ? 'date' : 'month';

    const formatRevenue = (value: number) => {
        if (typeof value !== 'number' || isNaN(value)) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date);
    };

    const formatXAxis = (value: string) => {
        if (timeRange === '7days' || timeRange === '30days') {
            return formatDate(value);
        }
        return value; // Return month name for monthly views
    };

    const handleExportPDF = async () => {
        if (reportRef.current) {
            let filename = 'Report_';
            switch (timeRange) {
                case '7days': filename += 'Last7Days'; break;
                case '30days': filename += 'Last30Days'; break;
                case '6months': filename += 'Last6Months'; break;
                case '1year': filename += 'Last1Year'; break;
                default: filename += 'Custom';
            }
            filename += `_${new Date().toISOString().slice(0,10)}.pdf`;

            window.scrollTo(0, 0);

            setTimeout(async () => {
                if (reportRef.current) {
                    await exportNodeToPDF(reportRef.current as HTMLElement, filename);
                }
            }, 500);
        }
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
                    <button
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        onClick={handleExportPDF}
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2"/>
                        Export Report
                    </button>
                </div>
            </div>
            {}
            {}
            <div ref={reportRef}>
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
                    {}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                            <IconWrapper icon={FaChartLine} className="mr-2 text-blue-600" /> Revenue Trend
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart 
                                    data={getFilteredData(revenueData)}
                                    margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                                >
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey={xAxisKey} 
                                        stroke="#64748b" 
                                        interval={timeRange === '30days' ? 2 : 0}  
                                        tickFormatter={formatXAxis}
                                        angle={timeRange === '30days' ? -45 : 0}
                                        textAnchor={timeRange === '30days' ? 'end' : 'middle'}
                                        height={timeRange === '30days' ? 60 : 30}
                                        padding={{ left: 10, right: 10 }}
                                    />
                                    <YAxis stroke="#64748b" tickFormatter={(v) => new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Number(v))} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} 
                                        formatter={(value: number) => [formatRevenue(Number(value)), 'Doanh thu']}
                                        labelFormatter={timeRange === '7days' || timeRange === '30days' ? 
                                            (label) => new Date(label).toLocaleDateString('vi-VN') : undefined}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                            <IconWrapper icon={FaStethoscope} className="mr-2 text-blue-600" /> Service Distribution
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={getFilteredData(serviceDistribution)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {getFilteredData(serviceDistribution).map((entry: any, index: number) => (
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
                        <h2 className="text-xl font-semibold mb-6">Appointments</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={getFilteredData(appointmentsData)}
                                    margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis 
                                        dataKey={xAxisKey} 
                                        interval={timeRange === '30days' ? 2 : 0}
                                        tickFormatter={formatXAxis}
                                        angle={timeRange === '30days' ? -45 : 0}
                                        textAnchor={timeRange === '30days' ? 'end' : 'middle'}
                                        height={timeRange === '30days' ? 60 : 30}
                                        padding={{ left: 10, right: 10 }}
                                    />
                                    <YAxis allowDecimals={false}/>
                                    <Tooltip
                                        labelFormatter={timeRange === '7days' || timeRange === '30days' ? 
                                            (label) => new Date(label).toLocaleDateString('vi-VN') : undefined}
                                    />
                                    <Bar dataKey="appointments" fill="#00C49F" name="Số lượt khám"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-6">User Growth</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart 
                                    data={getFilteredData(userGrowthData)}
                                    margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis 
                                        dataKey={xAxisKey} 
                                        interval={timeRange === '30days' ? 2 : 0}
                                        tickFormatter={formatXAxis}
                                        angle={timeRange === '30days' ? -45 : 0}
                                        textAnchor={timeRange === '30days' ? 'end' : 'middle'}
                                        height={timeRange === '30days' ? 60 : 30}
                                        padding={{ left: 10, right: 10 }}
                                    />
                                    <YAxis allowDecimals={false}/>
                                    <Tooltip
                                        labelFormatter={timeRange === '7days' || timeRange === '30days' ? 
                                            (label) => new Date(label).toLocaleDateString('vi-VN') : undefined}
                                    />
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

                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold mb-6 text-gray-800">Detailed Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                                Top Services
                            </h3>
                            <ul className="mt-3 space-y-4">
                                {getFilteredData(serviceDistribution).map((service: any, index: number) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span className="text-gray-600 flex items-center">
                                            <span className={`w-3 h-3 rounded-full mr-2 inline-block`} 
                                                style={{backgroundColor: DASHBOARD_COLORS[index % DASHBOARD_COLORS.length]}} />
                                            {service.name}
                                        </span>
                                        <span className="font-medium text-gray-800 bg-white px-3 py-1 rounded-full shadow-sm">
                                            {service.value}%
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <ArrowTrendingUpIcon className="h-5 w-5 mr-2 text-green-500" />
                                Activity Metrics
                            </h3>
                            <ul className="mt-3 space-y-4">
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Satisfaction Rate</span>
                                    <span className="font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.satisfactionRate}%
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Return Rate</span>
                                    <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.returnRate}%
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Avg. Wait Time</span>
                                    <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.avgWaitTime} mins
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Avg. Rating</span>
                                    <span className="font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full shadow-sm flex items-center">
                                        {dashboard.avgRating}/5
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2 text-indigo-500" />
                                User Analysis
                            </h3>
                            <ul className="mt-3 space-y-4">
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">New Users</span>
                                    <span className="font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shadow-sm flex items-center">
                                        +{getFilteredData(userGrowthData).reduce((sum, u) => sum + u.users, 0)}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Active Users</span>
                                    <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.activeUsers.toLocaleString('vi-VN')}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Avg. Interactions/User</span>
                                    <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.avgInteractionsPerUser}
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Avg. Session Time</span>
                                    <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.avgSessionTime}
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <IconWrapper icon={FaChartLine} className="mr-2 text-purple-500" />
                                System Performance
                            </h3>
                            <ul className="mt-3 space-y-4">
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Uptime</span>
                                    <span className="font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.uptime}%
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Response Time</span>
                                    <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.responseTime}s
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">System Errors</span>
                                    <span className="font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.systemErrors}%
                                    </span>
                                </li>
                                <li className="flex justify-between items-center">
                                    <span className="text-gray-600">Bandwidth</span>
                                    <span className="font-medium bg-white px-3 py-1 rounded-full shadow-sm">
                                        {dashboard.bandwidth}%
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;

