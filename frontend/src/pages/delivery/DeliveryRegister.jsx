import React, { useState } from 'react';
import apiClient from '../../api/client';
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
            await apiClient.post('/delivery/register', formData);
            alert('Registration Successful! Welcome to the fleet.');
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
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-['Plus_Jakarta_Sans'] selection:bg-[#FF5E00]/30 selection:text-[#FF5E00]">
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-30%] left-[-20%] w-[1000px] h-[1000px] bg-[#FF5E00]/5 rounded-full blur-[180px] opacity-40"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[700px] h-[700px] bg-green-500/5 rounded-full blur-[150px] opacity-30"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Logo & Branding */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-white/5 rounded-[30px] flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-2xl relative group hover:scale-110 transition-transform">
                        <span className="text-4xl animate-bounce">🎖️</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white mb-2 italic">
                        Fleet Enlist<span className="text-[#FF5E00]">.</span>
                    </h1>
                    <p className="text-gray-600 font-bold uppercase tracking-[0.2em] text-[10px] opacity-60">Join the Vindu Delivery Network</p>
                </div>

                <div className="w-full bg-[#111]/60 backdrop-blur-3xl p-10 rounded-[50px] border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.9)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Commander Name</label>
                            <input name="fullname" placeholder="FULL NAME" onChange={handleChange} className="w-full bg-white/5 text-white px-7 py-5 rounded-3xl border border-white/5 focus:border-[#FF5E00] outline-none transition-all font-bold placeholder:text-gray-800 text-base" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Comms Terminal Email</label>
                            <input name="email" type="email" placeholder="ACTIVE EMAIL" onChange={handleChange} className="w-full bg-white/5 text-white px-7 py-5 rounded-3xl border border-white/5 focus:border-[#FF5E00] outline-none transition-all font-bold placeholder:text-gray-800 text-base" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Encrypted Phone</label>
                            <input name="phone" placeholder="+91 XXXX XXXX" onChange={handleChange} className="w-full bg-white/5 text-white px-7 py-5 rounded-3xl border border-white/5 focus:border-[#FF5E00] outline-none transition-all font-bold placeholder:text-gray-800 text-base" required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Protocol Key</label>
                            <input name="password" type="password" placeholder="MIN 8 CHARS" onChange={handleChange} className="w-full bg-white/5 text-white px-7 py-5 rounded-3xl border border-white/5 focus:border-[#FF5E00] outline-none transition-all font-bold placeholder:text-gray-800 text-base" required />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#FF5E00] text-white py-6 rounded-3xl font-black text-xl hover:bg-white hover:text-[#FF5E00] active:scale-95 transition-all shadow-2xl shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase tracking-widest"
                        >
                            {isLoading ? 'ENLISTING...' : 'CONFIRM ENLISTMENT'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                            ALREADY IN THE FLEET?{' '}
                            <Link to="/delivery/login" className="text-white hover:text-[#FF5E00] transition-colors underline decoration-2 underline-offset-8">
                                SECURE LOGIN
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryRegister;
