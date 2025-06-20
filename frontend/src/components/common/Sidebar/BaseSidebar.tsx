import React from 'react';
import { NavLink } from 'react-router-dom';

export interface SidebarOption {
  icon: string;
  label: string;
  path: string;
}

interface BaseSidebarProps {
  options: SidebarOption[];
  theme?: 'pink' | 'blue';
  leftPosition?: '3' | '5' | '8';
}

const BaseSidebar: React.FC<BaseSidebarProps> = ({ 
  options, 
  theme = 'blue', 
  leftPosition = '3' 
}) => {
  const leftClass = `left-${leftPosition}`;
  const sidebarThemeClass = theme === 'pink' ? 'sidebar-pink' : 'sidebar-blue';
  const activeClass = theme === 'pink' ? 'sidebar-nav-link-pink-active' : 'sidebar-nav-link-blue-active';
  const inactiveClass = theme === 'pink' ? 'sidebar-nav-link-pink-inactive' : 'sidebar-nav-link-blue-inactive';

  return (
    <aside className={`sidebar-base ${leftClass} ${sidebarThemeClass}`}>
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {options.map((option) => (
          <li key={option.label} className="">
            <NavLink
              to={option.path}
              className={({ isActive }) => `sidebar-nav-link-base group ${isActive ? activeClass : inactiveClass}`}
            >
              {({ isActive }) => (
                <>
                  <img 
                    src={option.icon} 
                    alt={option.label} 
                    className="w-4 h-4 flex-shrink-0" 
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                  <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default BaseSidebar;
