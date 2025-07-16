import React, { useEffect, useState, ComponentType, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaBell,
    FaBlog,
    FaCalendarAlt,
    FaChartLine,
    FaClock,
    FaDollarSign,
    FaFlask,
    FaHistory,
    FaStethoscope,
    FaUser
} from 'react-icons/fa';
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
import { getSystemNotifications, markNotificationAsRead } from '../../api/services/systemNotificationService';
import { RecentActivityDTO, SystemNotificationDTO } from '../../types/dashboard';
import { IconType, IconBaseProps } from 'react-icons';

const IconWrapper: FC<{ icon: IconType; className?: string }> = ({ icon, className }) => {
    const IconComponent = icon as React.ComponentType<IconBaseProps>;
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
};

const getActivityTypeColor = (type: string): string => {
    switch (type) {
        case 'appointment': return 'bg-blue-100 text-blue-800';
        case 'sti-test':    return 'bg-green-100 text-green-800';
        case 'blog':        return 'bg-purple-100 text-purple-800';
        default:            return 'bg-gray-100 text-gray-800';
    }
};
const getActivityIcon = (type: string): React.ReactNode => {
    switch (type) {
        case 'appointment': return <IconWrapper icon={FaCalendarAlt} className="text-blue-600" />;
        case 'sti-test':    return <IconWrapper icon={FaFlask} className="text-green-600" />;
        case 'blog':        return <IconWrapper icon={FaBlog} className="text-purple-600" />;
        default:            return <IconWrapper icon={FaHistory} className="text-gray-600" />;
    }
};

interface DashboardData {
    totalAccounts: number;
    totalBlogs: number;
    totalAppointments: number;
    totalTestServices: number;
    totalRevenue: number;
    growthRate: number;
}

const defaultStats = [
    {icon: FaUser, color: 'text-blue-500', bgColor: 'bg-blue-100', label: 'Users', value: '---'},
    {icon: FaBlog, color: 'text-emerald-500', bgColor: 'bg-emerald-100', label: 'Blogs', value: '---'},
    {icon: FaCalendarAlt, color: 'text-amber-500', bgColor: 'bg-amber-100', label: 'Appointments', value: '---'},
    {icon: FaFlask, color: 'text-rose-500', bgColor: 'bg-rose-100', label: 'Total Examinations', value: '---'},
    {icon: FaDollarSign, color: 'text-violet-500', bgColor: 'bg-violet-100', label: 'Revenue', value: '---'},
];

interface MonthlyRevenue { month: number; revenue: number; }
interface ServiceDistribution { name: string; value: number; }

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleViewAllTips = () => {
        navigate('/admin/blogs');
    };

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [revenueData, setRevenueData] = useState<{month: string, revenue: number}[]>([]);
    const [serviceData, setServiceData] = useState<ServiceDistribution[]>([]);
    const [recentActivities, setRecentActivities] = useState<RecentActivityDTO[]>([]);
    const [systemNotifications, setSystemNotifications] = useState<SystemNotificationDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

                const revenueArr = Array.from({ length: 12 }, (_, i) => {
                    const found = (monthlyRevenue as MonthlyRevenue[]).find(item => item.month === i + 1);
                    return {
                        month: monthLabels[i],
                        revenue: found ? found.revenue : 0
                    };
                });
                setRevenueData(revenueArr);
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

    const formatGrowthRate = (rate: number) => {
        if (rate > 0) return `+${rate}%`;
        if (rate < 0) return `${rate}%`;
        return '0%';
    };

    const stats = dashboardData ? [
        {icon: FaUser, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Users', value: dashboardData.totalAccounts.toLocaleString()},
        {icon: FaBlog, color: 'text-emerald-600', bgColor: 'bg-emerald-100', label: 'Blogs', value: dashboardData.totalBlogs.toLocaleString()},
        {icon: FaCalendarAlt, color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Appointments', value: dashboardData.totalAppointments.toLocaleString()},
        {icon: FaFlask, color: 'text-rose-600', bgColor: 'bg-rose-100', label: 'Total Examinations', value: dashboardData.totalTestServices.toLocaleString()},
        {icon: FaDollarSign, color: 'text-violet-600', bgColor: 'bg-violet-100', label: 'Revenue', value: new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(dashboardData.totalRevenue)}
    ] : defaultStats;

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);

            setSystemNotifications(prev => 
                prev.map(notif => 
                    notif.id === id ? { ...notif, isRead: true } : notif
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const getGreeting = () => {
        const hour = currentDate.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };
    return (
        <div className="p-6 lg:p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
            {}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-2xl shadow-lg border border-blue-50">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        {getGreeting()}, <span className="text-blue-600">Admin</span>
                    </h1>
                    <p className="text-gray-600">
                        Welcome to your dashboard. Here's what's happening today.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center bg-blue-50 px-4 py-2 rounded-full shadow-sm">
                    <IconWrapper icon={FaClock} className="mr-2 text-blue-600" />
                    <span className="text-gray-700 font-medium">{formattedDate}</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow mb-8">
                    <div className="flex items-center">
                        <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                {stats.map((stat) => (
                    <div key={stat.label}
                         className={`bg-white rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col items-center transform transition-all duration-300 hover:-translate-y-1 border border-gray-100 ${loading ? 'animate-pulse' : ''}`}>
                        <div className={`rounded-full ${stat.bgColor} p-4 mb-4`}>
                            <IconWrapper icon={stat.icon} className={`${stat.color} text-2xl`} />
                        </div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-gray-600 mt-2 font-medium text-center">{stat.label}</div>
                    </div>
                ))}
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
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
                                <XAxis 
                                    dataKey="month" 
                                    stroke="#64748b" 
                                    ticks={monthLabels}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    padding={{ left: 10, right: 10 }}
                                />
                                <YAxis stroke="#64748b" />
                                <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                        <IconWrapper icon={FaStethoscope} className="mr-2 text-blue-600" /> Service Distribution
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {serviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e0e0e0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <IconWrapper icon={FaHistory} className="mr-2 text-blue-600" /> Recent Activities
                        </h2>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Refresh
                        </button>
                    </div>
                    
                    {}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="text-blue-600 text-sm font-medium">Total Activities</div>
                            <div className="text-2xl font-bold text-blue-700">{recentActivities.length}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-green-600 text-sm font-medium">STI Tests</div>
                            <div className="text-2xl font-bold text-green-700">
                                {recentActivities.filter(a => a.type === 'sti-test').length}
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-purple-600 text-sm font-medium">Appointments</div>
                            <div className="text-2xl font-bold text-purple-700">
                                {recentActivities.filter(a => a.type === 'appointment').length}
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="text-orange-600 text-sm font-medium">Blog Posts</div>
                            <div className="text-2xl font-bold text-orange-700">
                                {recentActivities.filter(a => a.type === 'blog').length}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentActivities.map((activity, idx) => (
                            <div
                                key={idx}
                                className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-transparent hover:border-blue-200"
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {activity.action}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityTypeColor(activity.type)}`}>
                                            {activity.type === 'sti-test' ? 'STI Test' : activity.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-1">
                                        <span className="text-sm text-gray-500">
                                            {activity.time}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {recentActivities.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-4">📋</div>
                                <p className="text-gray-500">No activities found in the system</p>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => {
                            navigate('/admin/activities');
                        }}
                        className="mt-6 w-full py-3 text-white bg-blue-600 hover:bg-blue-700 text-center rounded-lg transition-colors font-medium flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View All Activities
                    </button>
                </div>

                {}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                        <IconWrapper icon={FaBell} className="mr-2 text-blue-600" /> System Notifications
                    </h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {systemNotifications.map((notification, idx) => (
                            <div 
                                key={idx} 
                                className={`p-4 rounded-lg border relative ${
                                    notification.isRead ? 'opacity-80' : ''
                                } ${
                                    notification.type === 'error' ? 'bg-red-50 border-red-200' :
                                    notification.type === 'warning' ? 'bg-amber-50 border-amber-200' :
                                    notification.type === 'info' ? 'bg-blue-50 border-blue-200' :
                                    'bg-gray-50 border-gray-200'
                                } shadow-sm hover:shadow transition-all`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={`${
                                            notification.type === 'error' ? 'text-red-700' :
                                            notification.type === 'warning' ? 'text-amber-700' :
                                            notification.type === 'info' ? 'text-blue-700' :
                                            'text-gray-700'
                                        } ${notification.priority === 'high' ? 'font-bold' : 'font-medium'} 
                                        ${notification.isRead ? 'text-opacity-80' : ''}`}>
                                            {notification.message}
                                        </p>
                                        {notification.priority === 'high' && (
                                            <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full mt-2 font-medium">
                                                High Priority
                                            </span>
                                        )}
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="text-gray-500 hover:text-blue-600 ml-2 bg-white rounded-full p-1 shadow-sm hover:shadow-md transition-all"
                                            title="Mark as read"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {notification.isRead && (
                                    <div className="absolute top-2 right-2 bg-gray-100 px-2 py-1 rounded-full">
                                        <span className="text-xs text-gray-500 font-medium">Read</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {systemNotifications.length === 0 && (
                            <div className="p-6 text-center">
                                <p className="text-gray-500">No notifications at the moment</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Health Tips Management</h2>
                        <p className="text-gray-600 mt-1">Manage and view all health tips and blog content</p>
                    </div>
                    <button 
                        onClick={handleViewAllTips}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View all Tips
                    </button>
                </div>
            </div>
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f5f9;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #94a3b8;
                    }
                `}
            </style>
        </div>
    );
};

export default Dashboard;

