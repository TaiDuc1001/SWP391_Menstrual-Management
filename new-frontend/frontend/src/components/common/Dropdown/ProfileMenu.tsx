import React from 'react';

interface ProfileMenuProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ open, onClose, children, anchorRef }) => {
  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) return null;
  return (
    <div className="profile-menu-dropdown">
      {children}
    </div>
  );
};

export default ProfileMenu;
