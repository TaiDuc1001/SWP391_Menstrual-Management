import React, { useState } from 'react';
import { Button } from '../common/Button/Button';
import Input from '../common/Input/Input';

interface ProfileField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  icon?: React.ReactNode;
  rightIcon?: (show: boolean, toggle: () => void) => React.ReactNode;
  placeholder?: string;
  render?: (props: { value: string; onChange: (value: string) => void }) => React.ReactNode;
}

interface MyProfileProps {
  fields: ProfileField[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  error?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const MyProfile: React.FC<MyProfileProps> = ({
  fields,
  initialValues = {},
  onSubmit,
  error,
  title = 'Manage Your Profile',
  description = 'Update your information below',
  submitLabel = 'Save Changes',
}) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const obj: Record<string, string> = {};
    fields.forEach(f => {
      obj[f.name] = initialValues[f.name] || '';
    });
    return obj;
  });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const handleChange = (name: string, value: string) => {
    setValues(v => ({ ...v, [name]: value }));
  };

  const handleToggleShow = (name: string) => {
    setShowPassword(s => ({ ...s, [name]: !s[name] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="profile-container profile-container-wide">
      <div className="profile-avatar">
      </div>
      <h2 className="profile-title">{title}</h2>
      <p className="profile-desc">{description}</p>
      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="profile-error">{error}</div>}
        {fields.map(field => (
          <div className="profile-input-wrapper" key={field.name}>
            <label className="profile-label">{field.label}</label>
            {field.render ? (
              field.render({
                value: values[field.name],
                onChange: (v: string) => handleChange(field.name, v)
              })
            ) : (
              <Input
                type={
                  field.type === 'password' && showPassword[field.name]
                    ? 'text'
                    : field.type
                }
                required={field.required}
                value={values[field.name]}
                onChange={e => handleChange(field.name, e.target.value)}
                icon={field.icon}
                rightIcon={
                  field.type === 'password' && field.rightIcon
                    ? field.rightIcon(!!showPassword[field.name], () => handleToggleShow(field.name))
                    : undefined
                }
                placeholder={field.placeholder}
                inputClassName="profile-input"
              />
            )}
          </div>
        ))}
        <Button type="submit" variant="primary" className="w-full mt-2">{submitLabel}</Button>
      </form>
    </div>
  );
};

export default MyProfile;
