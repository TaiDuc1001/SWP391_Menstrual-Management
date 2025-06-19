import React from 'react';

const AdminAccounts: React.FC = () => (
  <div>
    Admin Accounts Page
    <ul>
      <li><a href="/admin/account/customer/1">Customer Detail (example)</a></li>
      <li><a href="/admin/account/doctor/2">Doctor Detail (example)</a></li>
      <li><a href="/admin/account/staff/3">Staff Detail (example)</a></li>
    </ul>
  </div>
);

export default AdminAccounts;