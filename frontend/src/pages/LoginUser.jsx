import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import AuthService from '../services/auth.service';
import RoleToggle from '../components/RoleToggle';
import { useToast } from '../context/ToastContext';

const LoginUser = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
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
      const data = await AuthService.loginUser(formData);

      if (data && data.token) {
        // Token is handled via HttpOnly cookie
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', 'user');
        showToast('Login Successful! Welcome back.', 'success');

        // Small delay for animation
        setTimeout(() => {
          navigate('/home');
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      showToast(errorMessage, 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative font-['Plus_Jakarta_Sans'] overflow-hidden flex items-center justify-center lg:justify-end lg:pr-32">

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2581&auto=format&fit=crop')] bg-cover bg-center"></div>
        {/* Gradient Overlay: Darker on mobile, gradient on desktop */}
        <div className="absolute inset-0 bg-black/60 lg:bg-gradient-to-l from-black via-black/80 to-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* Brand Text - Hidden on Mobile, Visible Desktop Left */}
      <div className="absolute top-12 left-12 lg:top-24 lg:left-24 z-10 hidden lg:block max-w-2xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in">
          <img src="/logo.png" alt="Vindu" className="w-6 h-6 object-contain border border-orange-400 rounded-full" />
          <span className="text-white text-sm font-bold tracking-wide">Vindu Experience</span>
        </div>
        <h1 className="text-7xl font-black text-white leading-tight mb-6 animate-slide-up">
          Relish Every <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-[#FF9057]">Moment.</span>
        </h1>
        <p className="text-xl text-gray-300 font-medium max-w-lg leading-relaxed animate-slide-up animation-delay-200">
          Your favorite restaurants, delivered with lightning speed. The city's best flavors are just a login away.
        </p>
      </div>

      {/* Main Glass Card Form */}
      <div className="relative z-20 w-full max-w-md mx-4 lg:mx-0 lg:w-[480px] animate-fade-in-up">
        <div className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-[32px] p-8 lg:p-10 overflow-hidden relative group">

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5E00]/20 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF5E00]/10 rounded-full blur-[80px] pointer-events-none -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Login to continue your craving.</p>
            </div>

            <RoleToggle activeRole="user" mode="login" />

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white py-3 rounded-xl font-bold text-sm transition-all group">
                <img loading="lazy" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white py-3 rounded-xl font-bold text-sm transition-all group">
                <img loading="lazy" src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className="w-5 h-5 invert group-hover:scale-110 transition-transform" />
                Apple
              </button>
            </div>

            <div className="flex items-center mb-8">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3.5 text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                  <a href="#" className="text-xs font-bold text-[#FF5E00] hover:text-[#ff7b29]">Forgot?</a>
                </div>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#050505]/60 border border-white/10 rounded-xl px-4 py-3.5 text-white font-medium focus:border-[#FF5E00] focus:ring-1 focus:ring-[#FF5E00] outline-none transition-all placeholder:text-gray-600 focus:bg-black/80"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-[#FF5E00] hover:bg-[#ff4500] text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?
                <Link to="/user/register" className="ml-1 text-[#FF5E00] font-bold hover:text-white transition-colors">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUser;