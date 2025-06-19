import React from 'react';
import { Link } from 'react-router-dom';
import { adminPaths } from '../../routes/rolePaths';
import { customerPaths } from '../../routes/rolePaths';
import { doctorPaths } from '../../routes/rolePaths';
import { staffPaths } from '../../routes/rolePaths';
import { useUser } from '../../contexts/UserContext';

const roleClassMap = {
  admin: 'admin',
  customer: 'customer',
  doctor: 'doctor',
  staff: 'staff',
};

const rolePathMap = {
  admin: adminPaths,
  customer: customerPaths,
  doctor: doctorPaths,
  staff: staffPaths,
};

const rolePrefixMap = {
  admin: '/admin',
  customer: '/customer',
  doctor: '/doctor',
  staff: '/staff',
};

const Sidebar: React.FC = () => {
  const { user } = useUser();
  if (!user) return null;
  if (!['admin', 'customer', 'doctor', 'staff'].includes(user.role)) return null;
  const roleClass = roleClassMap[user.role as keyof typeof roleClassMap];
  const paths = rolePathMap[user.role as keyof typeof rolePathMap];
  const prefix = rolePrefixMap[user.role as keyof typeof rolePrefixMap];

  return (
    <aside className="sidebar-base">
      <nav>
        <ul className="sidebar-nav-list">
          {paths.filter(opt => opt.showInSidebar).map(opt => (
            <li key={opt.path}>
              <Link
                to={opt.path === '/' ? prefix : `${prefix}${opt.path}`}
                className={`sidebar-link sidebar-link-${roleClass} group`}
              >
                <span className={`sidebar-icon sidebar-icon-${roleClass}`}>{opt.icon}</span>
                <span className={`sidebar-label sidebar-label-${roleClass}`}>{opt.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
