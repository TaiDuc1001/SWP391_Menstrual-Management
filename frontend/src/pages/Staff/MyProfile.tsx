import React, { useState } from 'react';
import { Button, Card } from '../../components';
import { formatDate } from '../../utils';
import { StaffProfile } from '../../types';

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<StaffProfile>({
    id: 1,
    name: 'Staff Member',
    email: 'staff@example.com',
    phone: '+1234567890',
    position: 'Staff',
    department: 'Administration',
    joinDate: '2024-01-01'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StaffProfile>(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleInputChange = (field: keyof StaffProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };  return (
    <div className="staff-profile">
      <div className="staff-profile__header">
        <h1>My Profile</h1>
        {!isEditing && (
          <Button onClick={handleEdit} variant="primary">
            Edit Profile
          </Button>
        )}
      </div>

      <div className="staff-profile__content">
        <div className="staff-profile__section">
          <h2>Personal Information</h2>
          
          <div className="staff-profile__field">
            <label>Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="staff-profile__input"
              />
            ) : (
              <span>{profile.name}</span>
            )}
          </div>

          <div className="staff-profile__field">
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="staff-profile__input"
              />
            ) : (
              <span>{profile.email}</span>
            )}
          </div>

          <div className="staff-profile__field">
            <label>Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="staff-profile__input"
              />
            ) : (
              <span>{profile.phone}</span>
            )}
          </div>

          <div className="staff-profile__field">
            <label>Position</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="staff-profile__input"
              />
            ) : (
              <span>{profile.position}</span>
            )}
          </div>

          <div className="staff-profile__field">
            <label>Department</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="staff-profile__input"
              />
            ) : (
              <span>{profile.department}</span>
            )}
          </div>

          <div className="staff-profile__field">
            <label>Join Date</label>
            <span>{profile.joinDate}</span>
          </div>
        </div>

        {isEditing && (
          <div className="staff-profile__actions">
            <Button onClick={handleSave} variant="primary">
              Save Changes
            </Button>
            <Button onClick={handleCancel} variant="secondary">
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
