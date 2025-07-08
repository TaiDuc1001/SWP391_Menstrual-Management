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

  useEffect(() => {
    // Lấy tổng số bệnh nhân (giả định từ profile hoặc endpoint riêng)
    doctorDashboardService.getTotalPatients().then(res => {
      setStats(prev => ({ ...prev, totalPatients: res.data?.appointments || 0 }));
    });
    // Lấy lịch hẹn hôm nay và các thống kê
    doctorDashboardService.getTodayAppointments().then(res => {
      const today = new Date().toISOString().slice(0, 10);
      const todayApts = res.data.filter((a: any) => a.date === today);
      setStats(prev => ({
        ...prev,
        todayAppointments: todayApts.length,
        completedAppointments: res.data.filter((a: any) => a.appointmentStatus === 'FINISHED').length,
        pendingAppointments: res.data.filter((a: any) => a.appointmentStatus === 'CONFIRMED' || a.appointmentStatus === 'BOOKED').length,
      }));
    });
    // Lấy lịch hẹn sắp tới
    doctorDashboardService.getUpcomingAppointments().then(res => {
      const now = new Date();
      const upcoming = res.data
        .filter((a: any) => new Date(a.date) >= now)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)
        .map((a: any) => ({
          id: a.id,
          patientName: a.customerName,
          time: a.timeRange || '',
          date: a.date,
          status: a.appointmentStatus === 'CONFIRMED' ? 'Confirmed' : 'Pending',
        }));
      setUpcomingAppointments(upcoming);
    });
    // Lấy bệnh nhân gần đây (từ lịch hẹn đã hoàn thành)
    doctorDashboardService.getRecentPatients().then(res => {
      const finished = res.data.filter((a: any) => a.appointmentStatus === 'FINISHED')
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map((a: any) => ({
          id: a.customerId,
          name: a.customerName,
          lastVisit: a.date,
          condition: a.doctorNote || 'N/A',
        }));
      setRecentPatients(finished);
    });
    // Lấy dữ liệu biểu đồ tuần
    doctorDashboardService.getWeeklyAppointments().then(res => {
      // Tính số lịch hẹn theo từng ngày trong tuần
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekStats = weekDays.map((day, idx) => {
        const count = res.data.filter((a: any) => {
          const d = new Date(a.date);
          return d.getDay() === ((idx + 1) % 7); // getDay: 0=Sun, 1=Mon...
        }).length;
        return { name: day, appointments: count };
      });
      setChartData(weekStats);
    });
  }, []);

  return (
    <div className="p-6 bg-gray-50">
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
