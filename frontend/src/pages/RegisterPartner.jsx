import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/client';
import RoleToggle from '../components/RoleToggle';

const RegisterPartner = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    contactName: '',
    phone: '',
    address: '',
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
      const response = await apiClient.post('/auth/foodpartner/register', formData);

      if (response.status === 201 || response.status === 200) {
        if (response.data.foodpartner) {
          localStorage.setItem('partner', JSON.stringify(response.data.foodpartner));
        }
        localStorage.setItem('userType', 'partner');
        alert('Registration Successful! Please login.');
        navigate('/partner/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      alert(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative font-['Plus_Jakarta_Sans'] overflow-x-hidden flex items-center justify-center lg:justify-end lg:pr-32 py-12">

      {/* Cinematic Background - Fixed */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/60 lg:bg-gradient-to-l from-black via-black/80 to-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Brand Text - Desktop Left (Fixed Position) */}
      <div className="fixed top-12 left-12 lg:top-24 lg:left-24 z-10 hidden lg:block max-w-2xl pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in pointer-events-auto">
          <img src="/logo.png" alt="Vindu" className="w-6 h-6 object-contain border border-orange-400 rounded-full" />
          <span className="text-white text-sm font-bold tracking-wide">For Business</span>
        </div>
        <h1 className="text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
          Grow your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">Restaurant.</span>
        </h1>
        <p className="text-xl text-gray-300 font-medium max-w-lg leading-relaxed animate-slide-up animation-delay-200">
          Partner with us to reach more customers, increase sales, and track your performance with our professional dashboard.
        </p>
      </div>

      {/* Main Glass Card Form */}
      <div className="relative z-20 w-full max-w-md mx-4 lg:mx-0 lg:w-[520px] animate-fade-in-up my-auto">
        <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-[32px] p-6 lg:p-8 relative group">

          {/* Ambient Glow (Green) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/20 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <RoleToggle activeRole="partner" mode="register" />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white mb-2">Become a Partner</h2>
              <p className="text-gray-400">Register your restaurant in minutes.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Restaurant Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                    placeholder="Tasty Bites"
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #090909 inset', WebkitTextFillColor: 'white' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Business Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                    placeholder="contact@restaurant.com"
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #090909 inset', WebkitTextFillColor: 'white' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Contact Name</label>
                  <input
                    type="text"
                    id="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                    placeholder="Manager Name"
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #090909 inset', WebkitTextFillColor: 'white' }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                    placeholder="+1 234..."
                    style={{ WebkitBoxShadow: '0 0 0px 1000px #090909 inset', WebkitTextFillColor: 'white' }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Address</label>
                <input
                  type="text"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="123 Food Street, City"
                  style={{ WebkitBoxShadow: '0 0 0px 1000px #090909 inset', WebkitTextFillColor: 'white' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Create Password</label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="Strong password"
                  style={{ WebkitBoxShadow: '0 0 0px 1000px #090909 inset', WebkitTextFillColor: 'white' }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Register Business'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <p className="text-gray-400">
                Already registered?
                <Link to="/food-partner/login" className="ml-1 text-[#10B981] font-bold hover:text-white transition-colors">
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

export default RegisterPartner;