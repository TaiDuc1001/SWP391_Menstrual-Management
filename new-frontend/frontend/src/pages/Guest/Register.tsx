import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaKey, FaEye, FaEyeSlash, FaUserShield, FaUsers } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useRegister } from '../../api/hooks/useRegister';
import Input from '../../components/common/Input/Input';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agree) return;
    if (password !== rePassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await registerMutation.mutateAsync({ email, password, role });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container register-container-wide">
      <div className="register-avatar">
        <FaUserShield size={40} />
      </div>
      <h2 className="register-title">Register your account</h2>
      <p className="register-desc">Please fill out all fields to continue</p>
      <form onSubmit={handleSubmit} className="register-form">
        {error && <div className="register-error">{error}</div>}
        <div>
          <label className="register-label">Email / Username</label>
          <Input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            icon={<FaUsers className="opacity-60" size={20} />}
            placeholder="Enter your email or username"
          />
        </div>
        <div>
          <label className="register-label">Password</label>
          <Input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            icon={<FaKey className="opacity-60" size={20} />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                {showPassword ? <FaEyeSlash className="opacity-60" size={20} /> : <FaEye className="opacity-60" size={20} />}
              </button>
            }
            placeholder="Enter your password"
          />
        </div>
        <div>
          <label className="register-label">Re-enter password</label>
          <Input
            type={showRePassword ? 'text' : 'password'}
            required
            value={rePassword}
            onChange={e => setRePassword(e.target.value)}
            icon={<FaKey className="opacity-60" size={20} />}
            rightIcon={
              <button type="button" onClick={() => setShowRePassword(v => !v)} tabIndex={-1}>
                {showRePassword ? <FaEyeSlash className="opacity-60" size={20} /> : <FaEye className="opacity-60" size={20} />}
              </button>
            }
            placeholder="Re-enter your password"
          />
        </div>
        <div className="register-select-wrapper">
          <label className="register-label">Role</label>
          <div className="relative">
            <select
              className="register-select"
              required
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="" disabled>Select role</option>
              <option value="customer">Customer</option>
              <option value="doctor">Doctor</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg fill="gray" height="20" viewBox="0 0 20 20" width="20"><path d="M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z"/></svg>
            </span>
          </div>
        </div>
        <div className="register-remember-row">
          <label className="register-remember-label">
            <input type="checkbox" className="mr-2" checked={agree} onChange={e => setAgree(e.target.checked)} /> I agree with GenHealth's <a href="#" className="text-blue-500 underline">Terms and Conditions</a>
          </label>
        </div>
        <button type="submit" className="register-submit-btn" disabled={!agree}>Register</button>
        <div className="register-divider-row">
          <div className="register-divider" />
          <span className="register-divider-text">or register with</span>
          <div className="register-divider" />
        </div>
        <div className="register-social-row">
          <button type="button" className="register-social-btn">
            <FcGoogle className="register-social-icon" />
            <span className="font-medium">Google</span>
          </button>
          <button type="button" className="register-social-btn">
            <FaFacebook className="register-social-icon text-blue-600" />
            <span className="font-medium">Facebook</span>
          </button>
        </div>
        <div className="register-signup-row">
          Already have an account? <button type="button" className="register-signup-btn" onClick={() => navigate('/login')}>Login now</button>
        </div>
      </form>
    </div>
  );
};

export default Register;