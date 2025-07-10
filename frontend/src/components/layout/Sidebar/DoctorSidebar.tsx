import React from 'react';
import BaseSidebar from '../../common/Sidebar/BaseSidebar';
import homeIcon from '../../../assets/icons/home.svg';
import onlineConsultation from '../../../assets/icons/video_call.svg';
import inbox from '../../../assets/icons/inbox.svg';
import personalProfile from '../../../assets/icons/profile.svg';
import starBlackIcon from '../../../assets/icons/Star_balck.svg';

interface SidebarProps {
}

const DoctorSidebar: React.FC<SidebarProps> = () => {
    const options = [
        {icon: starBlackIcon, label: 'Rating History', path: '/doctor/rating-history'},
        {icon: homeIcon, label: 'Dashboard', path: '/doctor/dashboard'},
        {icon: onlineConsultation, label: 'Online Consultation', path: '/doctor/online-consultation'},
        {icon: inbox, label: 'Question Inbox', path: '/doctor/question-inbox'},
        {icon: personalProfile, label: 'Personal MyProfile', path: '/doctor/personal-profile'},
    ];

    return <BaseSidebar options={options} theme="blue" leftPosition="3"/>;
};

export default DoctorSidebar;
