import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import axios from 'axios';
import apiClient from '../api/client';
import RoleToggle from '../components/RoleToggle';

const LoginPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/foodpartner/login', formData);

      if (response.status === 200) {
        if (response.data.foodpartner) {
          localStorage.setItem('partner', JSON.stringify(response.data.foodpartner));
        }
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', 'partner');

        setTimeout(() => {
          navigate('/partner/dashboard');
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative font-['Plus_Jakarta_Sans'] overflow-hidden flex items-center justify-center lg:justify-end lg:pr-32">

      {/* Cinematic Background - Kitchen Theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/60 lg:bg-gradient-to-l from-black via-black/80 to-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Brand Text - Desktop Left */}
      <div className="absolute top-12 left-12 lg:top-24 lg:left-24 z-10 hidden lg:block max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="text-white text-sm font-bold tracking-wide">Partner Portal</span>
        </div>
        <h1 className="text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
          Manage Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">Kitchen.</span>
        </h1>
        <p className="text-xl text-gray-300 font-medium max-w-lg leading-relaxed animate-slide-up animation-delay-200">
          Streamline orders, track revenue, and grow your business with our professional dashboard.
        </p>
      </div>

      {/* Main Glass Card Form */}
      <div className="relative z-20 w-full max-w-md mx-4 lg:mx-0 lg:w-[480px] animate-fade-in-up">
        <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-[32px] p-8 lg:p-10 overflow-hidden relative group">

          {/* Ambient Glow (Green) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/20 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-[80px] pointer-events-none -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white mb-2">Dashboard Login</h2>
              <p className="text-gray-400">Welcome back, Chef. Let's get cooking.</p>
            </div>

            <RoleToggle activeRole="partner" mode="login" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Business Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3.5 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="contact@restaurant.com"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                  <a href="#" className="text-xs font-bold text-[#10B981] hover:text-[#34D399]">Forgot?</a>
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3.5 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-[#10B981]/40 transform hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Login to Dashboard'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                New to the platform?
                <Link to="/food-partner/register" className="ml-1 text-white font-bold hover:text-[#10B981] transition-colors">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPartner;