import React from 'react';

const DoctorAppointments: React.FC = () => (
  <div>
    Doctor Appointments Page
    <ul>
      <li><a href="/doctor/appointment/123">Appointment Detail (example)</a></li>
      <li><a href="/doctor/appointment/123/customer">Customer Profile (example)</a></li>
    </ul>
  </div>
);

export default DoctorAppointments;
