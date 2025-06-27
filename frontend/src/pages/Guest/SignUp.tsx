import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../../api/axios';
import shieldIcon from '../../assets/icons/shield.svg';
import userIcon from '../../assets/icons/multi-user.svg';
import keyIcon from '../../assets/icons/key.svg';
import eyeIcon from '../../assets/icons/eye.svg';
import google from '../../assets/icons/google.svg';
import facebook from '../../assets/icons/facebook.svg';

interface SignUpProps {
    onSignUp: () => void;
}

const SignUp: React.FC<SignUpProps> = ({onSignUp}) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!agree) return;
        if (password !== rePassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await api.post('/accounts/register', {email, password, role}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Ensure the response has the correct structure for user profile
            const userData = {
                id: response.data.id,
                email: response.data.email || email,
                role: response.data.role || role,
                profile: response.data.profile || null // This might be null for new registrations
            };
            
            // Store user data in localStorage
            localStorage.setItem('userProfile', JSON.stringify(userData));
            localStorage.setItem('role', role);
            
            onSignUp();
            
            // Redirect to complete profile page for customers to fill in required information
            if (role.toLowerCase() === 'customer') {
                navigate('/customer/complete-profile');
            } else {
                navigate('/customer/dashboard');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            
            // Handle specific error cases
            if (err.response?.status === 409 || err.response?.data?.message?.includes('email')) {
                setError('Email already exists. Please use a different email or try logging in.');
            } else if (err.response?.status === 400) {
                setError(err.response?.data?.message || 'Invalid registration data. Please check your information.');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-50 to-pink-50">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
                <div className="bg-pink-400 rounded-full p-3 mb-2 flex items-center justify-center">
                    <img src={shieldIcon} alt="Shield" className="w-8 h-8"/>
                </div>
                <h2 className="text-2xl font-bold mb-1 text-gray-800 text-center">Register</h2>
                <p className="text-gray-500 text-sm mb-6 text-center">Please fill out all fields to continue</p>
                <form onSubmit={handleSubmit} className="w-full">
                    {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-1">Email / Username</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><img src={userIcon}
                                                                                                          alt="User"
                                                                                                          className="w-5 h-5"/></span>
                            <input type="email" required
                                   className="w-full p-2 pl-10 rounded border border-gray-300 focus:outline-pink-400"
                                   placeholder="" value={email} onChange={e => setEmail(e.target.value)}/>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-1">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><img src={keyIcon}
                                                                                                          alt="Key"
                                                                                                          className="w-5 h-5"/></span>
                            <input type={showPassword ? 'text' : 'password'} required
                                   className="w-full p-2 pl-10 pr-10 rounded border border-gray-300 focus:outline-pink-400"
                                   value={password} onChange={e => setPassword(e.target.value)}/>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                  onClick={() => setShowPassword(v => !v)}><img src={eyeIcon} alt="Show"
                                                                                className="w-5 h-5"/></span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-1">Re-enter password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><img src={keyIcon}
                                                                                                          alt="Key"
                                                                                                          className="w-5 h-5"/></span>
                            <input type={showRePassword ? 'text' : 'password'} required
                                   className="w-full p-2 pl-10 pr-10 rounded border border-gray-300 focus:outline-pink-400"
                                   value={rePassword} onChange={e => setRePassword(e.target.value)}/>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                  onClick={() => setShowRePassword(v => !v)}><img src={eyeIcon} alt="Show"
                                                                                  className="w-5 h-5"/></span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-1">Role</label>
                        <div className="relative">
                            <select
                                className="w-full p-2 pl-4 pr-8 rounded border border-gray-300 focus:outline-pink-400 bg-blue-50 appearance-none text-gray-700 font-medium"
                                style={{
                                    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill='gray' height='20' viewBox='0 0 20 20' width='20'><path d='M7.293 7.293a1 1 0 011.414 0L10 8.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z'/></svg>')`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.5em 1.5em'
                                }}
                                required
                                value={role}
                                onChange={e => setRole(e.target.value)}
                            >
                                <option value="" disabled>Select role</option>
                                <option value="customer">Customer</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-6 flex items-center">
                        <input id="agree" type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                               className="mr-2 w-5 h-5 border border-gray-400 rounded"/>
                        <label htmlFor="agree" className="text-xs text-gray-700">I agree with GenHealth's <a href="#"
                                                                                                             className="text-blue-500 underline">Terms
                            and Conditions</a></label>
                    </div>
                    <button type="submit" disabled={!agree}
                            className="bg-pink-400 text-white px-6 py-3 rounded font-semibold text-lg w-full hover:bg-pink-500 transition disabled:opacity-50 mb-6 shadow">Register
                    </button>
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-gray-200"/>
                        <span className="mx-2 text-xs text-gray-400">or register with</span>
                        <div className="flex-grow h-px bg-gray-200"/>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="button"
                                className="flex-1 flex items-center justify-center border border-gray-300 rounded px-2 py-2 bg-white hover:bg-gray-50 transition">
                            <img src={google} alt="Google" className="w-5 h-5 mr-2"/>Google
                        </button>
                        <button type="button"
                                className="flex-1 flex items-center justify-center border border-gray-300 rounded px-2 py-2 bg-white hover:bg-gray-50 transition">
                            <img src={facebook} alt="Facebook" className="w-5 h-5 mr-2"/>Facebook
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
