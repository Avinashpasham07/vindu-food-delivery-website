import React from 'react';
import '../App.css';
import axios from 'axios';
import AuthService from '../services/auth.service';
import { useNavigate, Link } from 'react-router-dom';
import RoleToggle from '../components/RoleToggle';
import { useToast } from '../context/ToastContext';

const RegisterUser = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fullname = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const data = await AuthService.registerUser({
        fullname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (data && data.token) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', 'user');
        showToast('Registration Successful! Welcome to Vindu.', 'success');
        navigate('/home');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      showToast(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative font-['Plus_Jakarta_Sans'] overflow-hidden flex items-center justify-center lg:justify-end lg:pr-32 py-10">

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/60 lg:bg-gradient-to-l from-black via-black/80 to-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Brand Text - Desktop Left */}
      <div className="absolute top-12 left-12 lg:top-24 lg:left-24 z-10 hidden lg:block max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in">
          <img src="/logo.png" alt="Vindu" className="w-6 h-6 object-contain border border-orange-400 rounded-full" />
          <span className="text-white text-sm font-bold tracking-wide">Join The Club</span>
        </div>
        <h1 className="text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
          Start Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-[#FF9057]">Delicious Journey</span>
        </h1>
        <p className="text-xl text-gray-300 font-medium max-w-lg leading-relaxed animate-slide-up animation-delay-200">
          Unlock exclusive perks, track your favorite meals, and eat like a king.
        </p>
      </div>

      {/* Main Glass Card Form */}
      <div className="relative z-20 w-full max-w-md mx-4 lg:mx-0 lg:w-[520px] animate-fade-in-up">
        <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-[32px] p-6 lg:p-8 overflow-hidden relative group">

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5E00]/20 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join us and experience food like never before.</p>
            </div>

            <RoleToggle activeRole="user" mode="register" />

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white py-3 rounded-xl font-bold text-sm transition-all group">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white py-3 rounded-xl font-bold text-sm transition-all group">
                <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 invert group-hover:scale-110 transition-transform" />
                Apple
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Password</label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="Min. 8 characters"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-[#FF5E00] hover:bg-[#ff4500] text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?
                <Link to="/user/login" className="ml-1 text-white font-bold hover:text-[#FF5E00] transition-colors">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;