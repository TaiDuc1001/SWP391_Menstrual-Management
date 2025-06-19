import React from 'react';

const AdminDashboard: React.FC = () => (
  <div>
    Admin Dashboard Page
    <ul>
      <li><a href="/admin/account">Accounts</a></li>
      <li><a href="/admin/appointment">Appointments</a></li>
      <li><a href="/admin/examination">Examinations</a></li>
      <li><a href="/admin/blog">Blogs</a></li>
      <li><a href="/admin/panel">Test Panels</a></li>
    </ul>
  </div>
);

export default AdminDashboard;
