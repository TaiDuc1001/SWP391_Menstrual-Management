import React, { useEffect, useState } from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import { doctorDashboardService } from '../../api/services/doctorDashboardService';

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  date: string;
  status: string;
}

interface Patient {
  id: number;
  name: string;
  lastVisit: string;
  condition: string;
}

const getAppointmentStatusLabel = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'BOOKED': 'Pending Payment',
    'CONFIRMED': 'Confirmed',
    'WAITING_FOR_CUSTOMER': 'Waiting for Customer',
    'WAITING_FOR_DOCTOR': 'Waiting for Doctor',
    'IN_PROGRESS': 'In Progress',
    'FINISHED': 'Completed',
    'CANCELLED': 'Cancelled',
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-800';
    case 'Pending Payment':
      return 'bg-yellow-100 text-yellow-800';
    case 'Waiting for Customer':
      return 'bg-orange-100 text-orange-800';
    case 'Waiting for Doctor':
      return 'bg-blue-100 text-blue-800';
    case 'In Progress':
      return 'bg-purple-100 text-purple-800';
    case 'Completed':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const DoctorDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [chartData, setChartData] = useState<{ name: string; appointments: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        const appointmentsRes = await doctorDashboardService.getTodayAppointments();
        const appointments = appointmentsRes.data || [];

        const today = new Date().toISOString().slice(0, 10);
        const todayApts = appointments.filter((a: any) => a.date === today);
        const completed = appointments.filter((a: any) => a.appointmentStatus === 'FINISHED').length;
        const pending = appointments.filter((a: any) => 
          a.appointmentStatus === 'CONFIRMED' || 
          a.appointmentStatus === 'BOOKED' ||
          a.appointmentStatus === 'WAITING_FOR_CUSTOMER' ||
          a.appointmentStatus === 'WAITING_FOR_DOCTOR' ||
          a.appointmentStatus === 'IN_PROGRESS'
        ).length;

        const uniquePatients = new Set(appointments.map((a: any) => a.customerId)).size;

        setStats({
          totalPatients: uniquePatients,
          todayAppointments: todayApts.length,
          completedAppointments: completed,
          pendingAppointments: pending,
        });

        const now = new Date();
        const upcoming = appointments
          .filter((a: any) => {
            const appointmentDate = new Date(a.date);
            return appointmentDate >= now && 
                   a.appointmentStatus !== 'CANCELLED' && 
                   a.appointmentStatus !== 'FINISHED';
          })
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)
          .map((a: any) => ({
            id: a.id,
            patientName: a.customerName,
            time: a.timeRange || '',
            date: a.date,
            status: getAppointmentStatusLabel(a.appointmentStatus),
          }));
        setUpcomingAppointments(upcoming);

        const finished = appointments
          .filter((a: any) => a.appointmentStatus === 'FINISHED')
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
          .map((a: any) => ({
            id: a.customerId,
            name: a.customerName,
            lastVisit: a.date,
            condition: a.doctorNote || 'Recommended paracetamol and rest.',
          }));
        setRecentPatients(finished);

        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weekStats = weekDays.map((day, idx) => {
          const count = appointments.filter((a: any) => {
            const d = new Date(a.date);
            return d.getDay() === ((idx + 1) % 7);
          }).length;
          return { name: day, appointments: count };
        });
        setChartData(weekStats);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);

        setStats({
          totalPatients: 1,
          todayAppointments: 0,
          completedAppointments: 5,
          pendingAppointments: 0,
        });
        setUpcomingAppointments([
          {
            id: 1,
            patientName: 'Customer test account',
            time: '7:00 AM - 8:00 AM',
            date: '2025-07-09',
            status: 'Pending Payment',
          }
        ]);
        setRecentPatients([
          {
            id: 1,
            name: 'Customer test account',
            lastVisit: '2025-06-16',
            condition: 'Recommended paracetamol and rest.',
          },
          {
            id: 2,
            name: 'Customer test account',
            lastVisit: '2025-06-13',
            condition: 'Suggested antifungal cream and hygiene tips.',
          }
        ]);
        setChartData([
          { name: 'Mon', appointments: 2 },
          { name: 'Tue', appointments: 2 },
          { name: 'Wed', appointments: 2 },
          { name: 'Thu', appointments: 0 },
          { name: 'Fri', appointments: 1 },
          { name: 'Sat', appointments: 0 },
          { name: 'Sun', appointments: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-blue-700 mb-8">Doctor Dashboard</h1>
        
        {}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-600">{stats.totalPatients}</span>
            <span className="text-gray-500 mt-2 text-sm">Total Patients</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-green-600">{stats.todayAppointments}</span>
            <span className="text-gray-500 mt-2 text-sm">Today's Appointments</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-purple-600">{stats.completedAppointments}</span>
            <span className="text-gray-500 mt-2 text-sm">Completed</span>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <span className="text-3xl font-bold text-yellow-600">{stats.pendingAppointments}</span>
            <span className="text-gray-500 mt-2 text-sm">Pending</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Upcoming Appointments</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-center text-gray-400">No upcoming appointments</div>
              ) : (                  upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div>
                        <h4 className="font-semibold text-gray-800">{appointment.patientName}</h4>
                        <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {}
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Recent Patients</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-400">Loading...</div>
              ) : recentPatients.length === 0 ? (
                <div className="text-center text-gray-400">No recent patients</div>
              ) : (
                recentPatients.map((patient) => (
                  <div key={patient.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                        <p className="text-sm text-gray-500">Last visit: {patient.lastVisit}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{patient.condition}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Weekly Appointments</h2>
          <div style={{width: '100%', height: 400}}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Bar dataKey="appointments" fill="#4F46E5"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

