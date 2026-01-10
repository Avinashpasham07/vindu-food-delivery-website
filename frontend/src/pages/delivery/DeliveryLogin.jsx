import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const DeliveryLogin = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/delivery/login', formData, { withCredentials: true });
            localStorage.setItem('deliveryPartner', JSON.stringify(res.data.partner));
            navigate('/delivery/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans'] selection:bg-[#FF5E00]/30 selection:text-[#FF5E00]">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-[#FF5E00]/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] opacity-30"></div>
                <div className="absolute inset-0 bg-white/5 opacity-5 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <div className="w-full max-w-md bg-[#111]/80 backdrop-blur-xl p-8 md:p-10 rounded-[32px] border border-white/10 shadow-2xl relative z-10 animate-fade-in-up">

                {/* Logo */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                        Vindu<span className="text-[#FF5E00]">.</span>
                    </h1>
                    <p className="text-gray-400 font-medium">Delivery Partner Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-gray-500 group-focus-within:text-[#FF5E00] transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </div>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] text-white pl-12 pr-4 py-4 rounded-2xl border border-white/5 focus:border-[#FF5E00] focus:shadow-[0_0_20px_rgba(255,94,0,0.1)] outline-none transition-all font-medium placeholder:text-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-gray-500 group-focus-within:text-[#FF5E00] transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                            </div>
                            <input
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] text-white pl-12 pr-4 py-4 rounded-2xl border border-white/5 focus:border-[#FF5E00] focus:shadow-[0_0_20px_rgba(255,94,0,0.1)] outline-none transition-all font-medium placeholder:text-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#FF5E00] text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(255,94,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Login to Dashboard
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center bg-[#1a1a1a] p-4 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-sm">
                        New to Vindu?{' '}
                        <Link to="/delivery/register" className="text-[#FF5E00] font-bold hover:underline">
                            Join the Fleet
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default DeliveryLogin;
