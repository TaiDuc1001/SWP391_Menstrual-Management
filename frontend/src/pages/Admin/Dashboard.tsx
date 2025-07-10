import React, { useEffect, useState } from 'react';
import {FaBlog, FaCalendarAlt, FaChartLine, FaDollarSign, FaFlask, FaStethoscope, FaUser} from 'react-icons/fa';
import {
    Area,
    AreaChart,
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
import { getAdminDashboardData } from '../../api/services';

// Interface for dashboard data from API
interface DashboardData {
    totalAccounts: number;
    totalBlogs: number;
    totalAppointments: number;
    totalTestServices: number;
    totalRevenue: number;
    growthRate: number;
}

// Default stats for when data is loading
const defaultStats = [
    {icon: FaUser, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Users', value: '---'},
    {icon: FaBlog, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Blogs', value: '---'},
    {icon: FaCalendarAlt, color: 'text-yellow-500', bgColor: 'bg-yellow-100', label: 'Appointments', value: '---'},
    {icon: FaFlask, color: 'text-pink-500', bgColor: 'bg-pink-100', label: 'Test Services', value: '18'},
    {icon: FaDollarSign, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Revenue', value: '---'},
    {icon: FaChartLine, color: 'text-indigo-500', bgColor: 'bg-indigo-100', label: 'Growth', value: '+15%'},
];

const revenueData = [
    {month: 'Jan', revenue: 65},
    {month: 'Feb', revenue: 72},
    {month: 'Mar', revenue: 80},
    {month: 'Apr', revenue: 95},
    {month: 'May', revenue: 88},
    {month: 'Jun', revenue: 120},
];

const serviceData = [
    {name: 'HPV Test', value: 35},
    {name: 'Health Consultation', value: 25},
    {name: 'Gynecological Exam', value: 20},
    {name: 'Ultrasound', value: 15},
    {name: 'Other Services', value: 5},
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const recentActivities = [
    {time: '10:30', action: 'New appointment from Nguyen Van A', type: 'appointment'},
    {time: '09:15', action: 'Dr. Tran B completed an examination', type: 'exam'},
    {time: '08:45', action: 'Updated test service information', type: 'service'},
    {time: '08:00', action: 'Daily revenue report created', type: 'report'},
];

const Dashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data when component mounts
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await getAdminDashboardData();
                setDashboardData(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Prepare stats based on the fetched data
    const stats = dashboardData ? [
        {icon: FaUser, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Users', value: dashboardData.totalAccounts.toLocaleString()},
        {icon: FaBlog, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Blogs', value: dashboardData.totalBlogs.toLocaleString()},
        {icon: FaCalendarAlt, color: 'text-yellow-500', bgColor: 'bg-yellow-100', label: 'Appointments', value: dashboardData.totalAppointments.toLocaleString()},
        {icon: FaFlask, color: 'text-pink-500', bgColor: 'bg-pink-100', label: 'Test Services', value: dashboardData.totalTestServices.toLocaleString()},
        {icon: FaDollarSign, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Revenue', value: new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(dashboardData.totalRevenue)},
        {icon: FaChartLine, color: 'text-indigo-500', bgColor: 'bg-indigo-100', label: 'Growth', value: `+${dashboardData.growthRate}%`}
    ] : defaultStats;

    return (
        <div className="p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">System Overview</h1>
                <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create Report
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Export Data
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                {stats.map((stat) => (
                    <div key={stat.label}
                         className={`bg-white rounded-xl shadow-sm p-6 flex flex-col items-center ${stat.bgColor} border border-gray-100 ${loading ? 'animate-pulse' : ''}`}>
                        {React.createElement(stat.icon as React.ElementType, {className: `${stat.color} text-3xl mb-2`})}
                        <div className="text-2xl font-bold mt-2">{stat.value}</div>
                        <div className="text-gray-600 mt-1 text-sm text-center">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Revenue Chart</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8"
                                      fillOpacity={0.3}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Service Distribution</h2>
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
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx}
                                 className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex-shrink-0 w-16 text-sm text-gray-500">{activity.time}</div>
                                <div className="flex-grow">
                                    <p className="text-gray-800">{activity.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 text-center">
                        View all activities
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">System Notifications</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                            <p className="text-yellow-800">There are 3 accounts pending approval</p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-blue-800">2 services are about to expire promotions</p>
                        </div>
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-red-800">The system will be maintained at 23:00 today</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
