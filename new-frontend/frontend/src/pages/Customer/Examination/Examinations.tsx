import React from 'react';

const Examinations: React.FC = () => (
  <div>
    Examinations Page
    <ul>
      <li><a href="/customer/examination/new">Book Examination</a></li>
      <li><a href="/customer/examination/new/checkout">Checkout</a></li>
      <li><a href="/customer/examination/789">Examination Detail (example)</a></li>
      <li><a href="/customer/examination/789/result">Result Detail (example)</a></li>
      <li><a href="/customer/examination/789/staff">Staff Detail (example)</a></li>
      <li><a href="/customer/panel">Test Panels</a></li>
      <li><a href="/customer/panel/101">Test Panel Detail (example)</a></li>
    </ul>
  </div>
);

export default Examinations;
