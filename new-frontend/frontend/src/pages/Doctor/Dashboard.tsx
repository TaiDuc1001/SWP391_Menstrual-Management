import React from 'react';

const DoctorDashboard: React.FC = () => (
  <div>
    Doctor Dashboard Page
    <ul>
      <li><a href="/doctor/appointment">Appointments</a></li>
      <li><a href="/doctor/my-profile">My Profile</a></li>
    </ul>
  </div>
);

export default DoctorDashboard;
