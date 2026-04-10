import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import { useToast } from '../../context/ToastContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: 'admin@vindu.com', // Default as requested
    password: 'adminpassword' // Default as requested
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleQuickFill = () => {
    setFormData({
      email: 'admin@vindu.com',
      password: 'adminpassword'
    });
    showToast('Admin credentials pre-filled!', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await AuthService.loginUser(formData);

      if (data && data.token && data.user.role === 'admin') {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', 'admin');
        showToast('Admin Access Granted. Welcome back.', 'success');
        
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      } else {
        showToast('Access Denied. Admin privilege required.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Admin authentication failed';
      showToast(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] font-['Plus_Jakarta_Sans'] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Red Alert Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[100px] animate-pulse animation-delay-500"></div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Console Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Security Console v1.0
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Vindu <span className="text-red-500">Admin.</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2">Restricted personnel only.</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f0f0f]/90 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-3xl p-8 overflow-hidden relative group">
          
          {/* Default Credentials Shortcut */}
          <button 
            onClick={handleQuickFill}
            className="absolute top-4 right-4 text-[10px] font-bold text-gray-700 hover:text-red-400 transition-colors uppercase tracking-widest"
          >
            Quick Login [DEV]
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Secure ID (Email)</label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white font-medium focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all placeholder:text-gray-800"
                placeholder="admin@access.key"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-gray-600 uppercase tracking-widest ml-1">Access Token (Password)</label>
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/50 border border-white/5 rounded-2xl px-5 py-4 text-white font-medium focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all placeholder:text-gray-800"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:bg-gray-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.2)] transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/10 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Initiate Handshake
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
          
          {/* Back to User Login */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <Link to="/user/login" className="text-[10px] font-black text-gray-700 hover:text-white uppercase tracking-widest transition-all">
              Switch to Standard User Entrance
            </Link>
          </div>
        </div>

        {/* Warning Footer */}
        <p className="text-center mt-8 text-[8px] text-gray-800 font-bold uppercase tracking-[0.4em]">
          Unauthorized access is prohibited and monitored.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
