import React from 'react';
import BaseSidebar from '../../common/Sidebar/BaseSidebar';
import homeIcon from '../../../assets/icons/home.svg';
import updateIcon from '../../../assets/icons/edit.svg';

interface SidebarProps {
}

const StaffSidebar: React.FC<SidebarProps> = () => {
    const options = [
        {icon: homeIcon, label: 'Dashboard', path: '/staff/dashboard'},
        {icon: updateIcon, label: 'Update Test Result', path: '/staff/update-test-results'},
    ];

    return <BaseSidebar options={options} theme="blue" leftPosition="3"/>;
};

export default StaffSidebar;
