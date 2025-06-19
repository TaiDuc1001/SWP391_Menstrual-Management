import React from 'react';

const CustomerAppointments: React.FC = () => (
  <div>
    Customer Appointments Page
    <ul>
      <li><a href="/customer/appointment/new">Book Appointment</a></li>
      <li><a href="/customer/appointment/new/checkout">Checkout</a></li>
      <li><a href="/customer/appointment/123">Appointment Detail (example)</a></li>
      <li><a href="/customer/doctor">Doctors</a></li>
      <li><a href="/customer/doctor/456">Doctor Detail (example)</a></li>
    </ul>
  </div>
);

export default CustomerAppointments;