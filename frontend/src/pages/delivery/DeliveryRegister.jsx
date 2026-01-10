import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const DeliveryRegister = () => {
    const [formData, setFormData] = useState({ fullname: '', email: '', password: '', phone: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post('http://localhost:3000/api/delivery/register', formData, { withCredentials: true });
            alert('Registration Successful! Please login.');
            navigate('/delivery/login');
        } catch (err) {
            console.error("Registration Error:", err);
            const msg = err.response?.data?.message || 'Registration Failed';
            alert(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans'] selection:bg-[#FF5E00]/30 selection:text-[#FF5E00]">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-[#FF5E00]/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute inset-0 bg-white/5 opacity-5 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <div className="w-full max-w-md bg-[#111]/80 backdrop-blur-xl p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl relative z-10 animate-fade-in-up">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
                        Savor<span className="text-[#FF5E00]">To.</span>
                    </h1>
                    <p className="text-gray-400 font-medium">Join our Delivery Fleet 🛵</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <input name="fullname" placeholder="John Doe" onChange={handleChange} className="w-full bg-[#1a1a1a] text-white p-4 rounded-2xl border border-white/5 focus:border-[#FF5E00] focus:shadow-[0_0_20px_rgba(255,94,0,0.1)] outline-none transition-all font-medium placeholder:text-gray-600" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                        <input name="email" type="email" placeholder="name@example.com" onChange={handleChange} className="w-full bg-[#1a1a1a] text-white p-4 rounded-2xl border border-white/5 focus:border-[#FF5E00] focus:shadow-[0_0_20px_rgba(255,94,0,0.1)] outline-none transition-all font-medium placeholder:text-gray-600" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <input name="phone" placeholder="+91 98765 43210" onChange={handleChange} className="w-full bg-[#1a1a1a] text-white p-4 rounded-2xl border border-white/5 focus:border-[#FF5E00] focus:shadow-[0_0_20px_rgba(255,94,0,0.1)] outline-none transition-all font-medium placeholder:text-gray-600" required />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <input name="password" type="password" placeholder="Create a strong password" onChange={handleChange} className="w-full bg-[#1a1a1a] text-white p-4 rounded-2xl border border-white/5 focus:border-[#FF5E00] focus:shadow-[0_0_20px_rgba(255,94,0,0.1)] outline-none transition-all font-medium placeholder:text-gray-600" required />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF5E00] text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,94,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                    >
                        {isLoading ? 'Creating Account...' : 'Start Earning Now'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/delivery/login" className="text-[#FF5E00] font-bold hover:underline">
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default DeliveryRegister;
