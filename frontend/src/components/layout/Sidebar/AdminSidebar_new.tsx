import React from 'react';
import BaseSidebar from '../../common/Sidebar/BaseSidebar';
import homeIcon from '../../../assets/icons/home.svg';
import tubeIcon from '../../../assets/icons/tube.svg';
import userIcon from '../../../assets/icons/multi-user.svg';
import contentIcon from '../../../assets/icons/content.svg';
import reportIcon from '../../../assets/icons/bar-chart.svg';

interface SidebarProps {
}

const AdminSidebar: React.FC<SidebarProps> = () => {
    const options = [
        {icon: homeIcon, label: 'Dashboard', path: '/admin/dashboard'},
        {icon: userIcon, label: 'User Managerment', path: '/admin/users-management'},
        {icon: reportIcon, label: 'Approve Results', path: '/admin/approve-results'},
        {icon: tubeIcon, label: 'Service Managerment', path: '/admin/services-management'},
        {icon: contentIcon, label: 'Content Managerment', path: '/admin/content-management'},
        {icon: reportIcon, label: 'Reports and Statistics', path: '/admin/reports'},
    ];

    return <BaseSidebar options={options} theme="blue" leftPosition="5"/>;
};

export default AdminSidebar;

