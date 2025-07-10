import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { getAdminDashboardData, getAdminMonthlyRevenue, getAdminServiceDistribution, getRecentActivities } from '../../api/services';
import { getSystemNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../api/services/systemNotificationService';
import { RecentActivityDTO, SystemNotificationDTO } from '../../types/dashboard';

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
    {icon: FaFlask, color: 'text-pink-500', bgColor: 'bg-pink-100', label: 'Total Examinations', value: '---'},
    {icon: FaDollarSign, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Revenue', value: '---'},
];


// Types for chart data
interface MonthlyRevenue { month: number; revenue: number; }
interface ServiceDistribution { name: string; value: number; }

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [revenueData, setRevenueData] = useState<{month: string, revenue: number}[]>([]);
    const [serviceData, setServiceData] = useState<ServiceDistribution[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivityDTO[]>([]);
    const [systemNotifications, setSystemNotifications] = useState<SystemNotificationDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch dashboard data when component mounts
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [dashboard, monthlyRevenue, serviceDist, activities, notifications] = await Promise.all([
                    getAdminDashboardData(),
                    getAdminMonthlyRevenue(new Date().getFullYear()),
                    getAdminServiceDistribution(),
                    getRecentActivities(),
                    getSystemNotifications()
                ]);
                setDashboardData(dashboard);
                // Map backend months (1-12) to labels
                setRevenueData(
                    (monthlyRevenue as MonthlyRevenue[]).map(item => ({
                        month: monthLabels[item.month - 1],
                        revenue: item.revenue
                    }))
                );
                setServiceData(serviceDist as ServiceDistribution[]);
                setRecentActivities(activities);
                setSystemNotifications(notifications);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDashboardData();
        
        // Set up periodic refresh for notifications - every 60 seconds
        const notificationRefreshInterval = setInterval(async () => {
            try {
                const notifications = await getSystemNotifications();
                setSystemNotifications(notifications);
            } catch (err) {
                console.error('Error refreshing notifications:', err);
            }
        }, 60000);
        
        return () => {
            clearInterval(notificationRefreshInterval);
        };
    }, []);

    // Helper to format growth rate with correct sign
    const formatGrowthRate = (rate: number) => {
        if (rate > 0) return `+${rate}%`;
        if (rate < 0) return `${rate}%`;
        return '0%';
    };

    // Prepare stats based on the fetched data
    const stats = dashboardData ? [
        {icon: FaUser, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Users', value: dashboardData.totalAccounts.toLocaleString()},
        {icon: FaBlog, color: 'text-green-500', bgColor: 'bg-green-100', label: 'Blogs', value: dashboardData.totalBlogs.toLocaleString()},
        {icon: FaCalendarAlt, color: 'text-yellow-500', bgColor: 'bg-yellow-100', label: 'Appointments', value: dashboardData.totalAppointments.toLocaleString()},
        {icon: FaFlask, color: 'text-pink-500', bgColor: 'bg-pink-100', label: 'Total Examinations', value: dashboardData.totalTestServices.toLocaleString()},
        {icon: FaDollarSign, color: 'text-purple-500', bgColor: 'bg-purple-100', label: 'Revenue', value: new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(dashboardData.totalRevenue)}
    ] : defaultStats;

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            // Update local state to reflect change immediately
            setSystemNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, isRead: true } : notif
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

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
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3}/>
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
                    <button 
                        onClick={() => {
                            navigate('/admin/activities');
                        }}
                        className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 text-center border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        View all activities
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">System Notifications</h2>
                        {systemNotifications.length > 0 && (
                            <button 
                                onClick={async () => {
                                    try {
                                        await markAllNotificationsAsRead();
                                        // Update local state to reflect all notifications as read
                                        setSystemNotifications(prev => 
                                            prev.map(notif => ({ ...notif, isRead: true }))
                                        );
                                    } catch (err) {
                                        console.error('Error marking all notifications as read:', err);
                                    }
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {systemNotifications.map((notification, idx) => (
                            <div 
                                key={idx} 
                                className={`p-4 rounded-lg border relative ${
                                    notification.isRead ? 'opacity-70' : ''
                                } ${
                                    notification.type === 'error' ? 'bg-red-50 border-red-100' :
                                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
                                    notification.type === 'info' ? 'bg-blue-50 border-blue-100' :
                                    'bg-gray-50 border-gray-100'
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`${
                                            notification.type === 'error' ? 'text-red-800' :
                                            notification.type === 'warning' ? 'text-yellow-800' :
                                            notification.type === 'info' ? 'text-blue-800' :
                                            'text-gray-800'
                                        } ${notification.priority === 'high' ? 'font-semibold' : ''} 
                                        ${notification.isRead ? 'text-opacity-70' : ''}`}>
                                            {notification.message}
                                        </p>
                                        {notification.priority === 'high' && (
                                            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-1">
                                                High Priority
                                            </span>
                                        )}
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-gray-400 hover:text-gray-600 ml-2"
                                            title="Mark as read"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {notification.isRead && (
                                    <div className="absolute top-2 right-2">
                                        <span className="text-xs text-gray-400">Read</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {systemNotifications.length === 0 && (
                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                                <p className="text-gray-600">No notifications at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
