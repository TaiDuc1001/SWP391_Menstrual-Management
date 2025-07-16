import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecentActivityDTO } from '../../types/dashboard';
import { getAllActivities } from '../../api/services/adminDashboardService';

const Activities: React.FC = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<RecentActivityDTO[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<RecentActivityDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const allActivities = await getAllActivities();
                setActivities(allActivities);
                setFilteredActivities(allActivities);
            } catch (err) {
                setError('Failed to fetch activities');
                console.error('Error fetching activities:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    useEffect(() => {
        let filtered = activities;

        if (filter !== 'all') {
            filtered = filtered.filter(activity => activity.type === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(activity => 
                activity.action.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredActivities(filtered);
    }, [activities, filter, searchTerm]);

    const getActivityTypeColor = (type: string) => {
        switch (type) {
            case 'appointment':
                return 'bg-blue-100 text-blue-800';
            case 'sti-test':
                return 'bg-green-100 text-green-800';
            case 'blog':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'appointment':
                return '📅';
            case 'sti-test':
                return '🔬';
            case 'blog':
                return '📝';
            default:
                return '📋';
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">All System Activities</h1>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <span>←</span>
                            <span>Back to Dashboard</span>
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="animate-pulse">
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">All System Activities</h1>
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <span>←</span>
                            <span>Back to Dashboard</span>
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="text-center py-8">
                            <div className="text-red-500 text-4xl mb-4">⚠️</div>
                            <p className="text-red-600 font-semibold">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">All System Activities</h1>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <span>←</span>
                        <span>Back to Dashboard</span>
                    </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Complete Activity History</h2>
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
                            <div className="text-2xl font-bold text-blue-700">{activities.length}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="text-green-600 text-sm font-medium">STI Tests</div>
                            <div className="text-2xl font-bold text-green-700">
                                {activities.filter(a => a.type === 'sti-test').length}
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="text-purple-600 text-sm font-medium">Appointments</div>
                            <div className="text-2xl font-bold text-purple-700">
                                {activities.filter(a => a.type === 'appointment').length}
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="text-orange-600 text-sm font-medium">Blog Posts</div>
                            <div className="text-2xl font-bold text-orange-700">
                                {activities.filter(a => a.type === 'blog').length}
                            </div>
                        </div>
                    </div>
                    
                    {filteredActivities.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-gray-400 text-4xl mb-4">📋</div>
                            <p className="text-gray-500">
                                {searchTerm || filter !== 'all' ? 'No activities match your filters' : 'No activities found in the system'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredActivities.map((activity, index) => (
                                <div
                                    key={index}
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activities;
