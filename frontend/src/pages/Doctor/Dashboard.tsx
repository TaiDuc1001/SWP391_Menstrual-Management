import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

const DoctorDashboard: React.FC = () => {
    // Dummy data for demonstration
    const stats = {
        totalPatients: 256,
        todayAppointments: 8,
        completedAppointments: 45,
        pendingAppointments: 12,
    };

    const upcomingAppointments = [
        {id: 1, patientName: 'Anna Nguyen', time: '10:00 AM', date: '2025-06-15', status: 'Confirmed'},
        {id: 2, patientName: 'Linh Tran', time: '11:30 AM', date: '2025-06-15', status: 'Pending'},
        {id: 3, patientName: 'Mai Le', time: '02:00 PM', date: '2025-06-15', status: 'Confirmed'},
    ];

    const recentPatients = [
        {id: 1, name: 'Thao Pham', lastVisit: '2025-06-14', condition: 'Regular checkup'},
        {id: 2, name: 'Hong Dao', lastVisit: '2025-06-13', condition: 'Consultation'},
        {id: 3, name: 'Lan Hoang', lastVisit: '2025-06-12', condition: 'Follow-up'},
    ];

    const chartData = [
        {name: 'Mon', appointments: 12},
        {name: 'Tue', appointments: 8},
        {name: 'Wed', appointments: 15},
        {name: 'Thu', appointments: 10},
        {name: 'Fri', appointments: 9},
        {name: 'Sat', appointments: 4},
        {name: 'Sun', appointments: 6},
    ];

    return (
        <div className="p-6 bg-gray-50">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats.totalPatients}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Today's Appointments</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats.todayAppointments}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats.completedAppointments}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
                    <p className="text-2xl font-semibold text-gray-800">{stats.pendingAppointments}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
                    <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                            <div key={appointment.id} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <h4 className="font-medium text-gray-800">{appointment.patientName}</h4>
                                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    appointment.status === 'Confirmed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                  {appointment.status}
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Patients */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Patients</h2>
                    <div className="space-y-4">
                        {recentPatients.map((patient) => (
                            <div key={patient.id} className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <h4 className="font-medium text-gray-800">{patient.name}</h4>
                                    <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                                </div>
                                <span className="text-sm text-gray-600">{patient.condition}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Appointments Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Appointments</h2>
                    <div style={{width: '100%', height: 400}}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="name"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="appointments" fill="#4B5563"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
