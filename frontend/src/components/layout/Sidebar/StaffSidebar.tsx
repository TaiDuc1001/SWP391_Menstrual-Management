import React from 'react';
import BaseSidebar from '../../common/Sidebar/BaseSidebar';
import homeIcon from '../../../assets/icons/home.svg';
import sheduleIcon from '../../../assets/icons/scheduleIcon.svg';
import updateIcon from '../../../assets/icons/edit.svg';

interface SidebarProps {
}

const StaffSidebar: React.FC<SidebarProps> = () => {
    const options = [
        {icon: homeIcon, label: 'Dashboard', path: '/staff/dashboard'},
        {icon: updateIcon, label: 'Update Test Result', path: '/staff/update-test-results'},
        {icon: sheduleIcon, label: 'Schedule Consultation', path: '/staff/schedule-consultations'},
    ];

    return <BaseSidebar options={options} theme="blue" leftPosition="3"/>;
};

export default StaffSidebar;
