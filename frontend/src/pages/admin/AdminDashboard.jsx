import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import Skeleton from '../../components/Skeleton';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/admin/stats');
                setStats(response.data.stats);
                setRecentOrders(response.data.recentOrders);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
                if (error.response?.status === 403) {
                    // Not an admin
                    navigate('/home');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] text-white p-8">
                <Skeleton width="300px" height="48px" className="mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} height="120px" className="rounded-3xl" />)}
                </div>
                <Skeleton width="100%" height="400px" className="rounded-[40px]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 p-6 space-y-8 hidden lg:block">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-[#FF5E00] rounded-xl flex items-center justify-center font-black text-xl">V</div>
                    <span className="font-black text-xl tracking-tighter uppercase">Vindu Admin</span>
                </div>

                <nav className="space-y-1">
                    {[
                        { id: 'overview', name: 'Overview', icon: '📊' },
                        { id: 'partners', name: 'Restaurants', icon: '🍽️' },
                        { id: 'users', name: 'Customers', icon: '👥' },
                        { id: 'orders', name: 'Global Orders', icon: '🛒' },
                        { id: 'settings', name: 'Platform Settings', icon: '⚙️' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-[#FF5E00] text-white shadow-lg shadow-[#FF5E00]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </button>
                    ))}
                </nav>

                <div className="pt-20">
                    <button onClick={() => navigate('/home')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-red-500 transition-all border border-dashed border-white/10 hover:border-red-500/30">
                        <span>👋</span> Exit Dashboard
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">Command Center</h1>
                        <p className="text-gray-500 font-medium">Real-time platform oversight.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold">Admin User</p>
                            <p className="text-[10px] text-[#FF5E00] font-bold uppercase tracking-widest">Master Access</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF5E00] to-orange-400 border-2 border-white/10"></div>
                    </div>
                </header>

                {activeTab === 'overview' && (
                    <div className="space-y-12 animate-fade-in-up">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString()}`, trend: '+12.5%', color: 'from-emerald-500/20' },
                                { label: 'Active Users', value: stats?.totalUsers, trend: '+43', color: 'from-blue-500/20' },
                                { label: 'Total Partners', value: stats?.totalPartners, trend: '+2', color: 'from-[#FF5E00]/20' },
                                { label: 'Global Orders', value: stats?.totalOrders, trend: '+156', color: 'from-purple-500/20' }
                            ].map((stat, i) => (
                                <div key={i} className={`bg-[#111] border border-white/5 p-6 rounded-[32px] relative overflow-hidden group hover:border-white/10 transition-all`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
                                    <div className="flex items-end justify-between relative z-10">
                                        <h2 className="text-3xl font-black tracking-tight">{stat.value}</h2>
                                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">{stat.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Table */}
                        <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black tracking-tight">Recent Global Orders</h3>
                                <button className="text-[#FF5E00] text-xs font-bold hover:underline">View Full Logs</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                                            <th className="pb-6 px-4">Order ID</th>
                                            <th className="pb-6 px-4">Customer</th>
                                            <th className="pb-6 px-4">Amount</th>
                                            <th className="pb-6 px-4">Status</th>
                                            <th className="pb-6 px-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.02]">
                                        {recentOrders.map(order => (
                                            <tr key={order._id} className="hover:bg-white/[0.01] transition-colors group">
                                                <td className="py-5 px-4 font-mono text-xs text-gray-500">#{order._id.slice(-6).toUpperCase()}</td>
                                                <td className="py-5 px-4 font-bold text-sm text-gray-300">{order.userId?.fullname || 'Guest'}</td>
                                                <td className="py-5 px-4 font-black text-sm">₹{order.totalAmount}</td>
                                                <td className="py-5 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-[#FF5E00]/10 text-[#FF5E00] border-[#FF5E00]/20'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-5 px-4 text-xs font-medium text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab !== 'overview' && (
                    <div className="h-[400px] flex flex-col items-center justify-center bg-[#111] border border-dashed border-white/10 rounded-[40px] animate-fade-in">
                        <span className="text-4xl mb-4">🚧</span>
                        <h3 className="text-xl font-bold">Module Under Construction</h3>
                        <p className="text-gray-500">We are adding advanced management features to the {activeTab} section.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
