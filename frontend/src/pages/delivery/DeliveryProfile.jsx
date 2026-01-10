import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeliveryProfile = () => {
    const [stats, setStats] = useState({ totalEarnings: 0, totalDeliveries: 0, todayEarnings: 0, todayDeliveries: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [partnerStatus, setPartnerStatus] = useState('offline'); // Default
    const navigate = useNavigate();
    const partner = JSON.parse(localStorage.getItem('deliveryPartner'));

    useEffect(() => {
        if (!partner) {
            navigate('/delivery/login');
            return;
        }
        // Set initial status from local storage if available, though API will overwrite
        setPartnerStatus(partner.status || 'offline');
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/delivery/history', { withCredentials: true });
            setStats(res.data.stats);
            setHistory(res.data.history);
            setPartnerStatus(res.data.status); // Update with real status
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper for status color
    const isOnline = partnerStatus === 'online' || partnerStatus === 'busy';

    const toggleStatus = async () => {
        try {
            const newStatus = isOnline ? 'offline' : 'online';
            await axios.post('http://localhost:3000/api/delivery/toggle-status', { status: newStatus }, { withCredentials: true });
            setPartnerStatus(newStatus);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem('deliveryPartner');
            navigate('/delivery/login');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] pb-safe relative overflow-hidden selection:bg-[#FF5E00]/30 selection:text-[#FF5E00]">
            {/* Ambient Background (optimized opacity for mobile) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#FF5E00]/10 rounded-full blur-[80px] md:blur-[120px] opacity-30 animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-500/5 rounded-full blur-[60px] md:blur-[100px] opacity-20"></div>
                <div className="absolute inset-0 bg-white/5 opacity-5 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-8">
                {/* Header - Compact for Mobile */}
                <header className="flex items-center justify-between gap-4 mb-6 md:mb-10 animate-fade-in-up">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/delivery/dashboard')}
                            className="group p-3 bg-white/5 rounded-full hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all active:scale-95 shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Profile</h1>
                        </div>
                    </div>
                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-full transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider hidden md:block">Logout</span>
                    </button>
                </header>

                {/* Identity Card - Responsive Padding */}
                <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[24px] md:rounded-[32px] p-5 md:p-8 mb-6 md:mb-8 shadow-2xl relative overflow-hidden group animate-fade-in-up delay-100">

                    <div className="flex flex-row items-center md:items-start gap-4 md:gap-6 relative z-10">
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#FF5E00] via-orange-400 to-yellow-500">
                                <div className="w-full h-full rounded-full bg-[#151515] flex items-center justify-center overflow-hidden border-2 md:border-4 border-[#151515]">
                                    <span className="text-2xl md:text-4xl font-black text-white">{partner.fullname.charAt(0)}</span>
                                </div>
                            </div>
                            {/* Live Status Indicator - Clickable */}
                            <button
                                onClick={toggleStatus}
                                className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-[#151515] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                title={isOnline ? "Go Offline" : "Go Online"}
                            >
                                <div className={`w-3 h-3 md:w-5 md:h-5 rounded-full border-[2px] md:border-[3px] border-[#151515] transition-all duration-500 ${isOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></div>
                            </button>
                        </div>

                        <div className="text-left flex-1 min-w-0">
                            <h2 className="text-xl md:text-3xl font-bold text-white mb-0.5 truncate">{partner.fullname}</h2>
                            <p className="text-gray-400 font-medium text-xs md:text-base mb-2 md:mb-4 flex items-center gap-2 truncate">
                                {partner.email}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={toggleStatus}
                                    className={`px-3 py-1 border text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full transition-all active:scale-95 flex items-center gap-1.5 ${isOnline ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'}`}
                                >
                                    {isOnline ? (
                                        <>
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            {partnerStatus}
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                            {partnerStatus}
                                        </>
                                    )}
                                </button>
                                <span className="px-3 py-1 bg-[#FF5E00]/10 border border-[#FF5E00]/20 text-[#FF5E00] text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                                    Agent
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Dashboard - Stacked for Mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 animate-fade-in-up delay-200">
                    {/* Today's Earnings - Full Width on Mobile */}
                    <div className="col-span-2 bg-gradient-to-br from-[#FF5E00] to-orange-700 rounded-[24px] p-5 md:p-6 relative overflow-hidden shadow-2xl shadow-orange-900/20 group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-20 h-20 md:w-24 md:h-24 text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.72 2.13-1.71 0-1.1-1.05-1.58-2.66-2.09-2.08-.66-3.57-1.36-3.57-3.42 0-1.83 1.48-2.9 3.2-3.19V4h2.67v2c1.55.35 2.92 1.37 3.07 3.22H14.4c-.15-1.11-1.15-1.84-2.28-1.84-1.29 0-2.01.76-2.01 1.61 0 1.05 1.13 1.55 2.76 2.08 2.08.66 3.48 1.45 3.48 3.39 0 1.83-1.42 2.95-3.04 3.14z" /></svg>
                        </div>
                        <p className="text-orange-100/80 text-xs md:text-sm font-bold uppercase tracking-wider mb-1 relative z-10">Today's Earnings</p>
                        <h3 className="text-4xl md:text-5xl font-black text-white relative z-10 mb-1">₹{stats.todayEarnings || 0}</h3>
                        <p className="text-white/60 text-[10px] md:text-xs font-bold bg-white/20 inline-block px-2 py-0.5 rounded-lg backdrop-blur-sm relative z-10">+ ₹40 avg/order</p>
                    </div>

                    {/* Today's Orders */}
                    <div className="bg-[#151515] border border-white/5 rounded-[24px] p-4 md:p-6 hover:border-[#FF5E00]/30 transition-all flex flex-col justify-between">
                        <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2">Today's Orders</p>
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-1">{stats.todayDeliveries || 0}</h3>
                        <span className="text-green-500 text-[10px] md:text-xs font-bold bg-green-500/10 px-2 py-1 rounded-md w-fit">Active</span>
                    </div>

                    {/* Lifetime Stats */}
                    <div className="bg-[#151515] border border-white/5 rounded-[24px] p-4 md:p-6 flex flex-col justify-between hover:border-[#FF5E00]/30 transition-all">
                        <div>
                            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Lifetime</p>
                            <h3 className="text-xl md:text-2xl font-black text-white">₹{stats.totalEarnings}</h3>
                        </div>
                        <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-white/5">
                            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Deliveries</p>
                            <h3 className="text-lg md:text-xl font-bold text-white">{stats.totalDeliveries}</h3>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                        <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm">📜</span>
                            History
                        </h3>
                        <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase bg-[#151515] px-3 py-1 rounded-full border border-white/5">
                            Recent 50
                        </span>
                    </div>

                    <div className="space-y-3 pb-24">
                        {history.length === 0 ? (
                            <div className="text-center py-20 bg-[#111] rounded-[32px] border border-dashed border-white/10">
                                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl opacity-50">👻</div>
                                <p className="text-gray-500 font-medium">No deliveries found.</p>
                            </div>
                        ) : (
                            history.map((order, i) => (
                                <div
                                    key={order._id}
                                    className="bg-[#111] active:scale-[0.98] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-3 transition-all"
                                    style={{ animationDelay: `${i * 50}ms` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center border border-white/5 shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-white font-bold text-sm">#{order._id.slice(-6).toUpperCase()}</span>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20 uppercase hidden xs:inline-block">
                                                    Done
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-[10px] md:text-xs font-medium">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-right">
                                        <div className="hidden xs:block">
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Total</p>
                                            <p className="text-gray-400 font-bold text-sm">₹{order.totalAmount}</p>
                                        </div>
                                        <div className="bg-[#FF5E00]/5 px-3 py-1.5 rounded-lg border border-[#FF5E00]/10">
                                            <p className="text-[#FF5E00] text-[8px] md:text-[10px] font-black uppercase mb-0.5 tracking-wider">Earned</p>
                                            <p className="text-[#FF5E00] font-black text-lg md:text-xl">₹40</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfile;
