import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey, FaEye, FaEyeSlash, FaUserCircle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { useLogin } from '../../api/hooks/useLogin';
import { useUser } from '../../contexts/UserContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const loginMutation = useLogin();
  const handleShowPassword = () => setShowPassword((prev) => !prev);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('All fields required');
      return;
    }
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data: any) => {
          setUser({ ...data, role: data.role?.toLowerCase() });
          const role = data?.role?.toLowerCase();
          if (role === 'admin') {
            navigate(`/${role}`);
          } else {
            navigate(`/${role}/my-profile`);
          }
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || err.message || 'Login failed');
        },
      }
    );
  };
  return (
    <div className="login-container login-container-wide">
      <div className="login-avatar">
        <FaUserCircle size={40} />
      </div>
      <h2 className="login-title">Log in to your account</h2>
      <p className="login-desc">Please fill out all fields to continue</p>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="login-error">{error}</div>}
        <div className="login-input-wrapper">
          <label className="login-label">Email / Username</label>
          <span className="absolute left-3 top-9 flex items-center h-10">
            <FaUser className="opacity-60" size={20} />
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="login-input"
            placeholder="Enter your email or username"
          />
        </div>
        <div className="login-password-wrapper">
          <label className="login-label">Password</label>
          <span className="absolute left-3 top-9 flex items-center h-10">
            <FaKey className="opacity-60" size={20} />
          </span>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-password-input"
            placeholder="Enter your password"
          />
          <button type="button" onClick={handleShowPassword} className="login-password-toggle">
            {showPassword ? <FaEyeSlash className="opacity-60" size={20} /> : <FaEye className="opacity-60" size={20} />}
          </button>
        </div>
        <div className="login-remember-row">
          <label className="login-remember-label">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <button
            type="button"
            className="login-forgot-btn"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot password?
          </button>
        </div>
        <button type="submit" className="login-submit-btn">Login</button>
        <div className="login-divider-row">
          <div className="login-divider" />
          <span className="login-divider-text">Or log in using</span>
          <div className="login-divider" />
        </div>
        <div className="login-social-row">
          <button type="button" className="login-social-btn">
            <FcGoogle className="login-social-icon" />
            <span className="font-medium">Google</span>
          </button>
          <button type="button" className="login-social-btn">
            <FaFacebook className="login-social-icon text-blue-600" />
            <span className="font-medium">Facebook</span>
          </button>
        </div>
        <div className="login-signup-row">
          No account? <button type="button" className="login-signup-btn" onClick={() => navigate('/register')}>Signup now</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
