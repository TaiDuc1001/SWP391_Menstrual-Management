import homeIcon from '../assets/icons/home.svg';
import starIcon from '../assets/icons/Star_balck.svg';
import calendarIcon from '../assets/icons/calendar.svg';
import cameraIcon from '../assets/icons/camera.svg';
import tubeIcon from '../assets/icons/tube.svg';
import avatarIcon from '../assets/icons/avatar.svg';
import multiUserIcon from '../assets/icons/multi-user.svg';
import settingIcon from '../assets/icons/setting.svg';
import contentIcon from '../assets/icons/content.svg';
import phoneIcon from '../assets/icons/phone.svg';
import keyIcon from '../assets/icons/key.svg';
import clipboard from '../assets/icons/clipboard.svg';
import chartBar from '../assets/icons/chart-bar.svg';

export const getIcon = (iconName: string): string | null => {
    switch (iconName) {
        case 'FaHome':
            return homeIcon;
        case 'FaStar':
            return starIcon;
        case 'FaInfoCircle':
            return contentIcon;
        case 'FaCogs':
            return settingIcon;
        case 'FaBlog':
            return contentIcon;
        case 'FaEnvelope':
            return phoneIcon;
        case 'FaCalendarAlt':
            return calendarIcon;
        case 'FaUserMd':
            return cameraIcon;
        case 'FaFlask':
            return tubeIcon;
        case 'FaUser':
            return avatarIcon;
        case 'FaUsers':
            return multiUserIcon;
        case 'FaKey':
            return keyIcon;
        case 'FaClipboard':
            return clipboard; 
        case 'FaChartBar':
            return chartBar;
        default:
            return null;
    }
};
