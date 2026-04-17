import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/client';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../context/ToastContext';
import { 
    BarChart3, 
    Utensils, 
    Bike, 
    Users, 
    ShoppingCart, 
    Settings, 
    LogOut, 
    Flame,
    Box,
    LayoutDashboard,
    ChevronRight,
    Search,
    Bell
} from 'lucide-react';

// Sub-components for Admin Dashboard

const PartnersView = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchPartners = async () => {
        try {
            const response = await apiClient.get('/admin/partners');
            setPartners(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPartners(); }, []);

    const toggleStatus = async (id) => {
        try {
            await apiClient.put(`/admin/partner/${id}/toggle-status`);
            showToast('Partner status updated successfully', 'success');
            fetchPartners();
        } catch (error) {
            showToast('Failed to update status', 'error');
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Encrypted Records...</div>;

    return (
        <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="py-6 px-8">Restaurant</th>
                        <th className="py-6 px-8">Email</th>
                        <th className="py-6 px-8">Status</th>
                        <th className="py-6 px-8 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                    {partners.map(p => (
                        <tr key={p._id} className="hover:bg-white/[0.01] transition-colors group">
                            <td className="py-6 px-8">
                                <span className="font-bold text-gray-300 block">{p.name}</span>
                                <span className="text-[10px] text-gray-600 block">{p.address || 'India'}</span>
                            </td>
                            <td className="py-6 px-8 text-sm text-gray-500">{p.email}</td>
                            <td className="py-6 px-8">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${p.isVerified ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                    {p.isVerified ? 'VERIFIED' : 'PENDING'}
                                </span>
                            </td>
                            <td className="py-6 px-8 text-right">
                                <button
                                    onClick={() => toggleStatus(p._id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p.isVerified ? 'bg-white/5 hover:bg-red-500/10 hover:text-red-500' : 'bg-[#FF5E00] hover:bg-[#FF5E00]/80'}`}
                                >
                                    {p.isVerified ? 'Deactivate' : 'Activate Partner'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DeliveryView = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const fetchRiders = async () => {
        try {
            const response = await apiClient.get('/admin/delivery-partners');
            setRiders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRiders(); }, []);

    const toggleStatus = async (id) => {
        try {
            await apiClient.put(`/admin/delivery-partner/${id}/toggle-status`);
            showToast('Rider verification status updated', 'success');
            fetchRiders();
        } catch (error) {
            showToast('Failed to update rider status', 'error');
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">Connecting to Fleet Tracking...</div>;

    return (
        <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="py-6 px-8">Rider</th>
                        <th className="py-6 px-8">Contact</th>
                        <th className="py-6 px-8">Live Status</th>
                        <th className="py-6 px-8">Earnings</th>
                        <th className="py-6 px-8 text-right">Verification</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                    {riders.map(r => (
                        <tr key={r._id} className="hover:bg-white/[0.01] transition-colors group">
                            <td className="py-6 px-8">
                                <span className="font-bold text-gray-300 block">{r.fullname}</span>
                                <span className="text-[10px] text-gray-600 font-bold tracking-widest uppercase block">ID: {r._id.slice(-6).toUpperCase()}</span>
                            </td>
                            <td className="py-6 px-8">
                                <p className="text-sm text-gray-500">{r.email}</p>
                                <p className="text-xs text-gray-600">{r.phone}</p>
                            </td>
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${r.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-700'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${r.status === 'online' ? 'text-emerald-500' : 'text-gray-600'}`}>
                                        {r.status}
                                    </span>
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <span className="font-black text-white">₹{r.earnings || 0}</span>
                            </td>
                            <td className="py-6 px-8 text-right">
                                <button
                                    onClick={() => toggleStatus(r._id)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${r.isVerified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                                >
                                    {r.isVerified ? 'VERIFIED' : 'APPROVE RIDER'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get('/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <div className="p-12 text-center text-gray-500 font-bold">Retrieving Citizen Data...</div>;

    return (
        <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="py-6 px-8">User</th>
                        <th className="py-6 px-8">Streak</th>
                        <th className="py-6 px-8">Status</th>
                        <th className="py-6 px-8">Joined</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                    {users.map(u => (
                        <tr key={u._id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-6 px-8">
                                <span className="font-bold block">{u.fullname}</span>
                                <span className="text-xs text-gray-600 block truncate max-w-[200px]">{u.email}</span>
                            </td>
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                                    <span className="font-black text-white">{u.streakCount}</span>
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20`}>
                                    {u.isGoldMember ? 'GOLD MEMBER' : 'STANDARD'}
                                </span>
                            </td>
                            <td className="py-6 px-8 text-xs text-gray-600 font-bold uppercase tracking-widest">
                                {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiClient.get('/admin/orders');
                setOrders(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-12 text-center text-gray-500 font-bold">Syncing Global Logs...</div>;

    return (
        <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/5">
                        <th className="py-6 px-8">ID</th>
                        <th className="py-6 px-8">Customer</th>
                        <th className="py-6 px-8">Amount</th>
                        <th className="py-6 px-8">Status</th>
                        <th className="py-6 px-8">Ref</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                    {orders.map(o => (
                        <tr key={o._id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-6 px-8 font-mono text-[10px] text-gray-600">#{o._id.slice(-6).toUpperCase()}</td>
                            <td className="py-6 px-8 font-bold text-gray-300">{o.userId?.fullname || 'Anonymous'}</td>
                            <td className="py-6 px-8 font-black text-white text-lg">₹{o.totalAmount}</td>
                            <td className="py-6 px-8">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${o.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-[#FF5E00]/10 text-[#FF5E00] border-[#FF5E00]/20'}`}>
                                    {o.status}
                                </span>
                            </td>
                            <td className="py-6 px-8 text-[10px] text-gray-700 font-black uppercase tracking-widest">{o.paymentMethod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const SettingsView = () => {
    const { showToast } = useToast();
    const [isMaintenance, setIsMaintenance] = useState(false);

    const toggleMaintenance = () => {
        setIsMaintenance(!isMaintenance);
        showToast(isMaintenance ? 'Platform Live Mode Restored' : 'Platform Maintenance Mode Active', 'info');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 space-y-6">
                <h4 className="text-lg font-bold">Platform Status Control</h4>
                <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5">
                    <div>
                        <p className="font-bold">System Maintenance</p>
                        <p className="text-xs text-gray-600 mt-1">Locks all non-admin routes for system updates.</p>
                    </div>
                    <button
                        onClick={toggleMaintenance}
                        className={`w-14 h-8 rounded-full transition-all relative ${isMaintenance ? 'bg-red-500' : 'bg-gray-800'}`}
                    >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isMaintenance ? 'left-7' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-[32px] p-8 space-y-6">
                <h4 className="text-lg font-bold">Broadcast Center</h4>
                <div className="space-y-4">
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">Global Dashboard Notice</p>
                    <textarea
                        className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm outline-none focus:border-[#FF5E00]/50 transition-all"
                        placeholder="Enter announcement text for all users..."
                    ></textarea>
                    <button className="w-full py-4 bg-white/5 hover:bg-[#FF5E00] text-gray-500 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                        Deploy Broadcast
                    </button>
                </div>
            </div>
        </div>
    );
};

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
                        { id: 'overview', name: 'Overview', icon: BarChart3 },
                        { id: 'partners', name: 'Restaurants', icon: Utensils, badge: stats?.pendingPartners },
                        { id: 'delivery', name: 'Delivery Partners', icon: Bike, badge: stats?.pendingRiders },
                        { id: 'users', name: 'Customers', icon: Users },
                        { id: 'orders', name: 'Global Orders', icon: ShoppingCart },
                        { id: 'settings', name: 'Platform Settings', icon: Settings }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-[#FF5E00] text-white shadow-lg shadow-[#FF5E00]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                                {item.name}
                            </div>
                            {item.badge > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white animate-pulse`}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="pt-20">
                    <button onClick={() => navigate('/home')} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-red-500 transition-all border border-dashed border-white/10 hover:border-red-500/30">
                        <LogOut className="w-4 h-4" /> Exit Dashboard
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
                                { 
                                    label: 'Total Partners', 
                                    value: stats?.totalPartners, 
                                    trend: stats?.pendingPartners > 0 ? `${stats.pendingPartners} PENDING` : '+2', 
                                    trendColor: stats?.pendingPartners > 0 ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-emerald-500 bg-emerald-500/10',
                                    color: 'from-[#FF5E00]/20' 
                                },
                                { 
                                    label: 'Global Orders', 
                                    value: stats?.totalOrders, 
                                    trend: stats?.pendingRiders > 0 ? `${stats.pendingRiders} RIDERS UNVERIFIED` : '+156', 
                                    trendColor: stats?.pendingRiders > 0 ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-purple-500 bg-purple-500/10',
                                    color: 'from-purple-500/20' 
                                }
                            ].map((stat, i) => (
                                <div key={i} className={`bg-[#111] border border-white/5 p-6 rounded-[32px] relative overflow-hidden group hover:border-white/10 transition-all`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
                                    <div className="flex items-end justify-between relative z-10">
                                        <h2 className="text-3xl font-black tracking-tight">{stat.value}</h2>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-full border transition-all ${stat.trendColor || 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}>
                                            {stat.trend}
                                        </span>
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

                {activeTab === 'partners' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-black tracking-tighter">Restaurant Partners</h2>
                            <div className="px-4 py-2 bg-[#111] border border-white/5 rounded-xl flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">System Live</span>
                            </div>
                        </div>

                        <PartnersView />
                    </div>
                )}

                {activeTab === 'delivery' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <h2 className="text-3xl font-black tracking-tighter">Delivery Fleet</h2>
                        <DeliveryView />
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <h2 className="text-3xl font-black tracking-tighter">Customer Directory</h2>
                        <UsersView />
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <h2 className="text-3xl font-black tracking-tighter">Global Order History</h2>
                        <OrdersView />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <h2 className="text-3xl font-black tracking-tighter">Platform Control</h2>
                        <SettingsView />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
