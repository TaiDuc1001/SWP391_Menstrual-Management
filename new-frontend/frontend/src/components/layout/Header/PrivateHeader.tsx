import React, { useState, useRef } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { adminPaths, customerPaths, doctorPaths, staffPaths } from '../../../routes/rolePaths';
import ProfileMenu from '../../common/Dropdown/ProfileMenu';
import { FaChevronDown } from 'react-icons/fa';
import { useAvatarUrl } from '../../../api/hooks/useAvatarUrl';
import '../../../styles/components/layout/profileMenu.css';

const rolePathMap = {
  admin: adminPaths,
  customer: customerPaths,
  doctor: doctorPaths,
  staff: staffPaths,
};

const PrivateHeader: React.FC = () => {
  const { user, setUser } = useUser() || {};
  const avatarUrl = useAvatarUrl(user?.id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase();
  const paths = role && rolePathMap[role as keyof typeof rolePathMap];
  let profilePath: string | null = null;
  if (paths) {
    const found = paths.find((p) => p.path === '/my-profile');
    if (found) profilePath = `${found.path}`;
  }

  const handleManageProfile = () => {
    if (profilePath && role) navigate(`/${role}${profilePath}`);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="private-header">
      <div className="private-header-logo">
        <img src="/logo.svg" alt="Logo" className="private-logo-img" />
      </div>
      <div className="private-header-user" ref={dropdownRef}>
        <img
          src={avatarUrl}
          alt="avatar"
          className="private-user-avatar"
        />
        <button
          className="private-user-name profile-menu-trigger"
          onClick={() => setDropdownOpen((open) => !open)}
          type="button"
        >
          {user?.profile.name || 'User'}
          <FaChevronDown className={dropdownOpen ? 'profile-menu-chevron open' : 'profile-menu-chevron'} />
        </button>
        <ProfileMenu open={dropdownOpen} onClose={() => setDropdownOpen(false)} anchorRef={dropdownRef}>
          {profilePath && (
            <button
              className="profile-menu-dropdown-item"
              onClick={handleManageProfile}
            >
              Manage Profile
            </button>
          )}
          <button
            className="profile-menu-dropdown-item"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </ProfileMenu>
      </div>
    </header>
  );
};

export default PrivateHeader;