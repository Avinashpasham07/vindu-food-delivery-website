import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DeliveryProfile = () => {
    const [stats, setStats] = useState({ totalEarnings: 0, totalDeliveries: 0, todayEarnings: 0, todayDeliveries: 0 });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [partnerStatus, setPartnerStatus] = useState('offline');
    const navigate = useNavigate();
    const partner = JSON.parse(localStorage.getItem('deliveryPartner'));

    useEffect(() => {
        if (!partner) {
            navigate('/delivery/login');
            return;
        }
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await apiClient.get('/delivery/history');
            setStats(res.data.stats);
            setHistory(res.data.history);
            setPartnerStatus(res.data.status);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        try {
            const isOnline = partnerStatus === 'online' || partnerStatus === 'busy';
            const newStatus = isOnline ? 'offline' : 'online';
            await apiClient.post('/delivery/toggle-status', { status: newStatus });
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

    const chartData = useMemo(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = days.map(day => ({ name: day, earnings: 0 }));
        
        if (history && Array.isArray(history)) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setHours(0, 0, 0, 0);
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            history.forEach(order => {
                const orderDate = new Date(order.createdAt);
                if (orderDate >= sevenDaysAgo) {
                    const dayIdx = orderDate.getDay(); 
                    const monIdx = (dayIdx + 6) % 7;   
                    data[monIdx].earnings += 40;
                }
            });
        }

        // Safer Sync: Only clobber if stats definitely has a value, otherwise trust history sum
        const todayIdx = (new Date().getDay() + 6) % 7;
        if (stats.todayEarnings && stats.todayEarnings > 0) {
            data[todayIdx].earnings = stats.todayEarnings;
        }

        return data;
    }, [history, stats]);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-[#FF5E00]/20 border-t-[#FF5E00] rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] pb-24 relative overflow-x-hidden selection:bg-[#FF5E00]/30 selection:text-[#FF5E00]">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-[#FF5E00]/5 rounded-full blur-[150px] opacity-30"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[150px] opacity-20"></div>
            </div>

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 pt-10">
                {/* Visual Header - Expanded */}
                <header className="flex justify-between items-center mb-16 animate-in slide-in-from-top-4 duration-500">
                    <button onClick={() => navigate('/delivery/dashboard')} className="w-14 h-14 rounded-2xl bg-[#111] flex items-center justify-center border border-white/5 hover:bg-[#FF5E00] hover:text-white transition-all transform hover:rotate-[-5deg] shadow-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    </button>
                    <div className="text-right">
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white flex flex-col items-end">
                            Fleet <span className="text-[#FF5E00]">Terminal</span>
                        </h1>
                        <div className="mt-4 bg-[#FF5E00]/10 px-4 py-2 rounded-xl border border-[#FF5E00]/20 inline-block">
                             <p className="text-[9px] font-black tracking-[0.3em] uppercase opacity-60 text-white mb-1">Authenticated Rider</p>
                             <p className="text-[#FF5E00] text-sm font-black tracking-widest uppercase">ID: {partner?._id?.slice(-10).toUpperCase() || 'SEARCHING...'}</p>
                        </div>
                    </div>
                </header>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT COLUMN: Profile & Stats */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Identity Card */}
                        <div className="w-full bg-[#111] border border-white/10 rounded-[60px] p-12 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none text-9xl font-black italic -mr-6 -mt-6 uppercase">Active</div>
                            
                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="relative mb-8">
                                    <div className="w-32 h-32 rounded-full p-1.5 bg-gradient-to-tr from-[#FF5E00] via-orange-400 to-yellow-500 shadow-3xl shadow-orange-500/30">
                                        <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center border-8 border-[#050505] overflow-hidden">
                                            <span className="text-5xl font-black text-white">{partner?.fullname?.charAt(0) || '?'}</span>
                                        </div>
                                    </div>
                                    <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full border-6 border-[#050505] ${partnerStatus === 'online' ? 'bg-green-500 shadow-[0_0_20px_#22c55e]' : 'bg-red-500'}`}></div>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter mb-2">{partner?.fullname || 'Commander'}</h2>
                                <p className="text-gray-500 text-sm font-bold italic tracking-widest mb-10 opacity-60">{partner?.email || 'Offline Contact'}</p>
                                
                                <div className="flex gap-4 w-full">
                                    <button onClick={toggleStatus} className={`flex-1 py-5 rounded-3xl text-xs font-black uppercase tracking-[0.2em] border transition-all ${partnerStatus === 'online' ? 'bg-green-500/10 border-green-500/30 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                                        {partnerStatus}
                                    </button>
                                    <button onClick={handleLogout} className="px-10 py-5 bg-red-500/10 border border-red-500/10 text-red-500 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all">Exit</button>
                                </div>
                            </div>
                        </div>

                        {/* Metric Grid */}
                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="bg-[#111] rounded-[45px] p-10 border border-white/5 shadow-3xl group hover:border-[#FF5E00]/20 transition-all">
                                <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Total Gains</p>
                                <h3 className="text-4xl font-black text-white group-hover:text-[#FF5E00] transition-colors tracking-tighter">₹{stats.totalEarnings}</h3>
                            </div>
                            <div className="bg-[#111] rounded-[45px] p-10 border border-white/5 shadow-3xl group hover:border-[#FF5E00]/20 transition-all">
                                <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">Success Missions</p>
                                <h3 className="text-4xl font-black text-white group-hover:text-[#FF5E00] transition-colors tracking-tighter">{stats.totalDeliveries}</h3>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Charts & Logs */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Weekly Chart */}
                        <div className="w-full bg-[#111] rounded-[60px] p-12 border border-white/5 shadow-3xl animate-in fade-in duration-700">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none mb-1">Momentum</h3>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Weekly Earnings distribution</p>
                                </div>
                                <div className="text-right">
                                     <p className="text-3xl font-black text-[#FF5E00] tracking-tighter">7-Day Avg</p>
                                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] font-mono leading-none mt-1">Status: Optimized</p>
                                </div>
                            </div>

                            <div className="h-72 w-full -ml-10">
                                <ResponsiveContainer width="115%" height="100%">
                                    <BarChart data={chartData}>
                                        <defs>
                                            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#FF5E00" stopOpacity={1}/>
                                                <stop offset="100%" stopColor="#FF5E00" stopOpacity={0.05}/>
                                            </linearGradient>
                                        </defs>
                                        <Bar dataKey="earnings" radius={[12, 12, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={index === (new Date().getDay() + 6) % 7 ? "url(#barGrad)" : "#FF5E00"}
                                                    fillOpacity={index === (new Date().getDay() + 6) % 7 ? 1 : 0.25}
                                                />
                                            ))}
                                        </Bar>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 900}} dy={15} />
                                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.01)'}} contentStyle={{backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '25px', padding: '15px'}} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Logs Feed - Responsive Grid if wide */}
                        <div className="w-full">
                            <div className="flex items-center justify-between mb-8 px-4">
                                 <h3 className="text-2xl font-black text-white italic">Mission Logs</h3>
                                 <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">Showing all activity</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {history.length === 0 ? (
                                    <div className="col-span-full py-24 text-center bg-[#111] rounded-[60px] border border-dashed border-white/5">
                                        <p className="text-gray-700 font-black uppercase tracking-[0.5em] text-xs">No Signal Detected</p>
                                    </div>
                                ) : (
                                    history.map((order, i) => (
                                        <div key={order._id} className="w-full bg-[#111] p-8 rounded-[45px] border border-white/5 flex items-center justify-between group transition-all hover:bg-white/[0.03] shadow-2xl">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform">🏆</div>
                                                <div>
                                                    <h4 className="text-lg font-black text-white mb-1 tracking-tighter uppercase leading-none">Victory</h4>
                                                    <p className="text-[#FF5E00] text-[10px] font-black uppercase tracking-[0.2em]">{new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • #{order?._id?.slice(-6).toUpperCase() || 'TRIP'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="text-3xl font-black text-green-500 tracking-tighter leading-none">+₹{order.totalAmount || 40}</p>
                                                <span className="text-[9px] font-black text-gray-800 uppercase mt-2">Paid In Full</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryProfile;
