import React, { useState } from 'react';
import apiClient from '../../api/client';
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
            const res = await apiClient.post('/delivery/login', formData);
            localStorage.setItem('deliveryPartner', JSON.stringify(res.data.partner));
            localStorage.setItem('token', res.data.token);
            navigate('/delivery/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-['Plus_Jakarta_Sans'] selection:bg-[#FF5E00]/30 selection:text-[#FF5E00]">
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-[#FF5E00]/5 rounded-full blur-[150px] opacity-40"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] opacity-30"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Logo & Branding */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl relative group hover:scale-110 transition-transform">
                        <span className="text-5xl animate-bounce">🛵</span>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF5E00] rounded-full animate-ping"></div>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-white mb-2 italic">
                        Vindu<span className="text-[#FF5E00]">.</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Fleet Authentication Terminal</p>
                </div>

                <div className="w-full bg-[#111]/60 backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.9)]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity Access</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="fleet@access.terminal"
                                onChange={handleChange}
                                className="w-full bg-white/5 text-white px-8 py-6 rounded-3xl border border-white/5 focus:border-[#FF5E00] outline-none transition-all font-bold placeholder:text-gray-800 text-lg"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Secure Protocol</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                onChange={handleChange}
                                className="w-full bg-white/5 text-white px-8 py-6 rounded-3xl border border-white/5 focus:border-[#FF5E00] outline-none transition-all font-bold placeholder:text-gray-800 text-lg"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black py-6 rounded-3xl font-black text-2xl hover:bg-[#FF5E00] hover:text-white active:scale-95 transition-all shadow-2xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                        >
                            {isLoading ? (
                                <div className="w-7 h-7 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    INITIATE LOGIN
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="4" stroke="currentColor" className="w-7 h-7 group-hover:translate-x-2 transition-transform">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-white/5 text-center">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                            NO FLEET ACCESS?{' '}
                            <Link to="/delivery/register" className="text-[#FF5E00] hover:text-white transition-colors underline decoration-2 underline-offset-8">
                                ENLIST HERE
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryLogin;
