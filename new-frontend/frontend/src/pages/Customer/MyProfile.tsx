import React, { useState } from 'react';
import { FaUserCircle, FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash, FaBirthdayCake, FaIdCard, FaMapMarkerAlt, FaPhone, FaTransgender, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import MyProfile from '../../components/layout/MyProfile';
import SolarDatePicker from '../../components/common/Input/SolarDatePicker';
import '../../styles/components/feature/profile.css';
import '../../styles/components/feature/profile-datepicker.css';

const CustomerMyProfile: React.FC = () => {
  const [error, setError] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthday, setBirthday] = useState('');
  if (!user) return null;

  const fields = [
    { name: 'id', label: 'ID', type: 'text', required: true, icon: <FaIdCard />, placeholder: 'Enter your ID' },
    { name: 'name', label: 'Name', type: 'text', required: true, icon: <FaUser />, placeholder: 'Enter your name' },
    {
      name: 'date_of_birth',
      label: 'Date of Birth',
      type: 'custom',
      required: true,
      icon: <FaBirthdayCake />,
      render: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
        <div className="profile-datepicker-row">
          <button
            type="button"
            className="profile-datepicker-btn"
            onClick={() => setShowDatePicker(true)}
          >
            <FaCalendarAlt className="profile-datepicker-icon" />
            {value ? value : 'Pick your birthday'}
          </button>
          {showDatePicker && (
            <div className="solar-datepicker-modal">
              <SolarDatePicker
                value={value}
                onChange={v => {
                  onChange(v);
                  setBirthday(v);
                }}
                onClose={() => setShowDatePicker(false)}
              />
            </div>
          )}
        </div>
      ),
    },
    { name: 'gender', label: 'Gender', type: 'text', required: true, icon: <FaTransgender />, placeholder: 'Enter your gender' },
    { name: 'address', label: 'Address', type: 'text', required: true, icon: <FaMapMarkerAlt />, placeholder: 'Enter your address' },
    { name: 'cccd', label: 'CCCD', type: 'text', required: true, icon: <FaIdCard />, placeholder: 'Enter your CCCD' },
    { name: 'phone_number', label: 'Phone Number', type: 'text', required: true, icon: <FaPhone />, placeholder: 'Enter your phone number' },
    { name: 'email', label: 'Email', type: 'email', required: true, icon: <FaEnvelope />, placeholder: 'Enter your email' },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      icon: <FaKey />,
      rightIcon: (show: boolean, toggle: () => void) =>
        show ? <FaEyeSlash onClick={toggle} size={18} /> : <FaEye onClick={toggle} size={18} />,
      placeholder: 'Enter new password',
    },
    {
      name: 'rePassword',
      label: 'Confirm Password',
      type: 'password',
      icon: <FaKey />,
      rightIcon: (show: boolean, toggle: () => void) =>
        show ? <FaEyeSlash onClick={toggle} size={18} /> : <FaEye onClick={toggle} size={18} />,
      placeholder: 'Confirm new password',
    },
  ];

  const handleSubmit = (values: Record<string, string>) => {
    setError('');
    for (const field of fields) {
      if (field.required && !values[field.name]) {
        setError('All fields required');
        return;
      }
    }
    if (values.password !== values.rePassword) {
      setError('Passwords do not match');
      return;
    }
    navigate(`/${user.role}`);
  };

  return (
    <div className="profile-container-wide">
      <div className="profile-avatar">
        <FaUserCircle size={40} />
      </div>
      <MyProfile
        fields={fields}
        onSubmit={handleSubmit}
        error={error}
        initialValues={{ id: '', name: '', date_of_birth: birthday, gender: '', address: '', cccd: '', phone_number: '', email: '', password: '', rePassword: '' }}
      />
    </div>
  );
};

export default CustomerMyProfile;